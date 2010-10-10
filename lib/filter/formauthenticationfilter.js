/**
 * Filter to process form authentication attempts.
 */

require('../utils');
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
};

FormAuthenticationFilter.prototype.doFilter = function(request, response, next) {
    if (this.isLoginRequest(request)) {
        this.userProvider.loadUserByUsername(request.body[this.usernameParameter], function(user) {
			if (user) {
				// TODO: password check
				Security.setUser(request, user);
				this.success(request, response, next);
			} else {
				this.failure(request, response, next);
			}
		});
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
    if (url.pathname.endsWith(this.loginUrl) && 
        request.method === 'POST' && 
        request.body[this.usernameParameter] != null) {
        return true;
    }
    return false;
};

FormAuthenticationFilter.prototype.isLogoutRequest = function(request) {
    var url = require('url').parse(request.url);
    return url.pathname.endsWith(this.logoutUrl);
};

FormAuthenticationFilter.prototype.success = function(request, response, callback) {
	var cb = function() {
    	var returnUrl = SavedRequest.getRedirectUrl(request) || this.defaultSuccessUrl;
    	response.writeHead(303, {'Location': returnUrl});
    	response.end('');
		callback();
	};
	if (this.rememberMeService) {
		this.rememberMeService.loginSuccessful(request, response, cb);
	} else {
		cb();
	}
};

FormAuthenticationFilter.prototype.failure = function(request, response, callback) {
    response.writeHead(303, {'Location': this.failureUrl});
    response.end('');
	callback();
};
