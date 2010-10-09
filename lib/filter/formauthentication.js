/**
 * Filter to process form authentication attempts.
 */

require('../utils');
var Security = require('../security');
var SavedRequest = require('../savedrequest'); 

var FormAuthenticationFilter = module.exports = function(options) {
    options = options || {};
    if (!options.loginUrl) {
        options.loginUrl = '/login';
    }
    if (!options.logoutUrl) {
        options.logoutUrl = '/logout';
    }
    if (!options.usernameParameter) {
        options.usernameParameter = 'username';
    }
    if (!options.passwordParameter) {
        options.passwordParameter = 'password';
    }
    this.loginUrl = options.loginUrl;
    this.logoutUrl = options.logoutUrl;
    this.usernameParameter = options.usernameParameter;
    this.passwordParameter = options.passwordParameter;
    this.defaultSuccessUrl = options.defaultSuccessUrl || '/';
	this.failureUrl = options.failureUrl || this.loginUrl + '?error=1';
};

FormAuthenticationFilter.prototype.doFilter = function(request, response, next) {
    if (this.isLoginRequest(request)) {
        // TODO: plug-in user lookup
		Security.setUser(request, {name: 'Max', roles: ['user', 'admin']});
		this.success(request, response);
	} else {
		if (this.isLogoutRequest(request)) {
			Security.setUser(request, null);
		}
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
    var returnUrl = SavedRequest.getRedirectUrl(request) || this.defaultSuccessUrl;
    response.writeHead(303, {'Location': returnUrl});
    response.end('');
};

FormAuthenticationFilter.prototype.failure = function(request, response) {
    response.writeHead(303, {'Location': this.failureUrl});
    response.end('');    
};

