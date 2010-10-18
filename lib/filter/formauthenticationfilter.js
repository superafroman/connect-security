/**
 * Filter to process form authentication attempts.
 */

var PlainTextPasswordEncoder = require('../passwordencoder/plaintextpasswordencoder');
var RememberMeService = require('../service/remembermeservice');
var SavedRequest = require('../savedrequest');
var Security = require('../security');

var FormAuthenticationFilter = module.exports = function(options) {
    options = options || {};
	this.userProvider = options.userProvider;
	if (!this.userProvider) {
		throw new Error('FormAuthenticationFilter requires a UserProvider.');
	}
	if (options.rememberMe) {
		this.rememberMeService = new RememberMeService(options);
	}
    this.loginUrl = options.loginUrl || '/login';
    this.logoutUrl = options.logoutUrl || '/logout';
    this.usernameParameter = options.usernameParameter || 'username';
    this.passwordParameter = options.passwordParameter || 'password';
    this.defaultSuccessUrl = options.defaultSuccessUrl || '/';
	this.failureUrl = options.failureUrl || this.loginUrl + '?error=1';
	this.passwordEncoder = options.passwordEncoder || new PlainTextPasswordEncoder();
};

FormAuthenticationFilter.prototype.doFilter = function(request, response, next) {
    if (this.isLoginRequest(request)) {
        this.userProvider.loadUserByUsername(request.body[this.usernameParameter], (function(scope) {
			return function(user) {
				if (user && 
					  user.getPassword() === this.passwordEncoder.encode(request.body[scope.passwordParameter])) {
					Security.setUser(request, user);
					scope.success(request, response, next);
				} else {
					scope.failure(request, response, next);
				}
			}
		})(this));
	} else if (this.isLogoutRequest(request)) {
		Security.setUser(request, null);
		if (this.rememberMeService) {
			this.rememberMeService.logoutSuccessful(request, response, next);
		} else {
			next();
		}
	} else {
       	next();
    }
};

FormAuthenticationFilter.prototype.isLoginRequest = function(request) {
    var url = require('url').parse(request.url);
	var StringUtils = require('../stringutils');
    if (StringUtils.endsWith(url.pathname, this.loginUrl) && 
        request.method === 'POST' && 
        request.body[this.usernameParameter] != null) {
        return true;
    }
    return false;
};

FormAuthenticationFilter.prototype.isLogoutRequest = function(request) {
    var url = require('url').parse(request.url);
	var StringUtils = require('../stringutils');
    return StringUtils.endsWith(url.pathname, this.logoutUrl);
};

FormAuthenticationFilter.prototype.success = function(request, response, callback) {
	var cb = (function(scope) {
		return function() {
    		var returnUrl = SavedRequest.getRedirectUrl(request) || scope.defaultSuccessUrl;
    		response.writeHead(303, {'Location': returnUrl});
    		response.end('');
			callback();
		};
	})(this);
	if (this.rememberMeService) {
		this.rememberMeService.loginSuccessful(request, response, cb);
	} else {
		cb();
	}
};

FormAuthenticationFilter.prototype.failure = function(request, response, callback) {
    response.writeHead(303, {'Location': this.failureUrl});
    response.end('');
};
