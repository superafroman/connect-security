
var HEADER = 'Authorization';

var HEADER_MATCH = '^Basic\\s(.*)';

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
		var header = request.headers[HEADER];
		var match = header.match(HEADER_MATCH);
		if (match != null) {
			var details = match[1];
			// decode / load user
		} else {
			callback();
		}
	} else {
		callback();
	}
};
