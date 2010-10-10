
var RememberMeService = require('../service/remembermeservice');

var RememberMeAuthenticationFilter = module.exports = function(options) {
	this.rememberMeService = new RememberMeService(options);
};

RememberMeAuthenticationFilter.prototype.doFilter = function(request, response, callback) {
	var Security = require('../security');
	if (!Security.isAuthenticated()) {
		this.rememberMeService.autoLogin(request, function(user) {
			if (user) {
				Security.setUser(user, request);
			}
			callback();
		});
	}
};
