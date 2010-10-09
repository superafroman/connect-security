
var RememberMeService = require('../service/remembermeservice');

var RememberMeFilter = module.exports = function(options) {
	this.rememberMeService = new RememberMeService(options);
};

RememberMeFilter.prototype.doFilter = function(request, response, callback) {
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
