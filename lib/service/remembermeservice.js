/**
 * Configuration options:
 * {
 *   userProvider: UserProvider,
 *   rememberMe: {
 *     secret: '',               // hash secret
 *     validityTime: 1814400000, // milliseconds token is valid for
 *     parameter: 'rememberMe'   // remember me form parameter
 *   }
 * }
 */

require('cookie');

var COOKIE_NAME = 'CONNECT_SECURITY_REMEMBER_ME_COOKIE';

var RememberMeService = module.exports = function(options) {
	options = options || {};
	options.rememberMe = options.rememberMe || {};
	
	this.userProvider = options.userProvider;
	if (!this.userProvider) {
		throw new Error('RememberMeService requires a UserProvider.');
	}
	
	this.secret = options.rememberMe.secret || '';
	this.validityTime = options.rememberMe.validityTime || 1814400000;
	this.parameter = options.rememberMe.parameter || 'rememberMe'; 
};

RememberMeService.prototype.autoLogin = function(request, callback) {
	var token = request.getCookie(COOKIE_NAME);
	if (token) {
		var parts = new Buffer(token, 'base64').toString().split(/:/);
		if (parts[1] >= new Date()) {
			this.userProvider.loadUserByUsername(parts[0], function(user) {
				if (!user) {
					callback();
				} else {
					var hash = this.hash(user, parts[1]);
					if (hash === parts[2]) {
						callback(user);
					} else {
						callback();
					}
				}
			});
		}
	} else {
		callback();
	}
};

RememberMeService.prototype.loginSuccessful = function(request, response, callback) {
	console.log('[RememberMeService.loginSuccessful] param = ' + request.body[this.parameter]);
	if (request.body[this.parameter]) {
		var user = require('../security').getUser(request);
		var validTo = + new Date() + this.validityTime;
		var hash = this.hash(user, validTo);
		var token = new Buffer(user.getUsername() + ':' + validTo + ':' + hash);
		token = token.toString('base64');
		response.setCookie(COOKIE_NAME, token, {expires: validTo});
	}
	callback();
};

RememberMeService.prototype.logoutSuccessful = function(request, response, callback) {
	response.clearCookie(COOKIE_NAME);
	callback();
};

RememberMeService.prototype.hash = function(user, validTo) {
	var crypto = require('crypto');
	var hash = crypto.createHash('md5');
	hash.update(user.username + ':' + user.password + ':' + validTo + ':' + this.secret);
	return hash.digest('hex');
};