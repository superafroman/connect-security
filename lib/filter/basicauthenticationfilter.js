
var HEADER = 'Authorization';

var HEADER_MATCH = \^Basic\s(.*)\;

var BasicAuthenticationFilter = module.exports = function(options) {

	options = options || {};
	
	this.ignoreFailure = options.ignoreFailure || true;
	this.entryPoint = options.entryPoint || null;
	
	if (!this.ignoreFailure && !this.entryPoint) {
		throw new Error('');
	}
	
	if (options.rememberMe) {
		this.rememberMeService = new RememberMeService(options);
	}
};

BasicAuthenticationFilter.prototype.doFilter = function(request, response, callback) {
	var security = require('../security');
	if (!security.isAuthenticated(request)) {
		// check Auth header, decode base64 user/pass, lookup user, authenticate.
		// request.headers['Authorization'];
	} else {
		callback();
	}
};
