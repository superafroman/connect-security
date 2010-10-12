
var BasicAuthenticationFilter = module.exports = function(options) {
};

BasicAuthenticationFilter.prototype.doFilter = function(request, response, callback) {
	var security = require('../security');
	if (!security.isAuthenticated(request)) {
		// check Auth header, decode base64 user/pass, lookup user, authenticate.
	} else {
		callback();
	}
};
