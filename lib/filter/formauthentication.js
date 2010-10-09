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
	console.log('doFilter, reA = ' + this.requiresAuthentication);
    if (this.requiresAuthentication(request)) {
        // TODO: plug-in user lookup
		Security.setUser(request, {name: 'Max', roles: ['user', 'admin']});
		this.success(request, response);
    } else {
        next();
    }
};

FormAuthenticationFilter.prototype.requiresAuthentication = function(request) {
	console.log('usernameParameter = ' + this.usernameParameter);
    var url = require('url').parse(request.url);
	console.log('url = ' + url);
	console.log('method = ' + request.method);
	console.log('body = ' + request.body);
		console.log('endsWith = ' + url.endsWith);
    if (url.pathname.endsWith(this.loginUrl) && 
        request.method === 'POST' && 
        request.body[this.usernameParameter] != null) {
        return true;
    }
    return false;
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

