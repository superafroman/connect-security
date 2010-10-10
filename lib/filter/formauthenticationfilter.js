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
		throw new Error('UserProvider must be set.');
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
        // TODO: plug-in user lookup
		Security.setUser(request, {name: 'Max', roles: ['user', 'admin']});
		this.success(request, response);
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

FormAuthenticationFilter.prototype.success = function(request, response) {
	var callback = function() {
    	var returnUrl = SavedRequest.getRedirectUrl(request) || this.defaultSuccessUrl;
    	response.writeHead(303, {'Location': returnUrl});
    	response.end('');
	};
	if (this.rememberMeService) {
		this.rememberMeService.loginSuccessful(request, response, callback);
	} else {
		callback();
	}
};

FormAuthenticationFilter.prototype.failure = function(request, response) {
    response.writeHead(303, {'Location': this.failureUrl});
    response.end('');    
};

