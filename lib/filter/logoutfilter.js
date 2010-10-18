
var RememberMeService = require('../service/remembermeservice');
var Security = require('../security');

var LogoutFilter = module.exports = function(options) {
    options = options || {};
    this.logoutUrl = options.logoutUrl || '/logout';
	if (options.rememberMe) {
		this.rememberMeService = new RememberMeService(options);
	}
};

LogoutFilter.prototype.doFilter = function(request, response, next) {
	if (this.isLogoutRequest(request)) {
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

LogoutFilter.prototype.isLogoutRequest = function(request) {
    var url = require('url').parse(request.url);
	var StringUtils = require('../stringutils');
    return StringUtils.endsWith(url.pathname, this.logoutUrl);
};