
var PlainTextPasswordEncoder = require('../passwordencoder/plaintextpasswordencoder');
var Security = require('../security');

var HEADER = 'Authorization';
var HEADER_MATCH = /^Basic\s(.*)/;

var BasicAuthenticationFilter = module.exports = function(options) {

	options = options || {};
	
	this.ignoreFailure = options.ignoreFailure || true;
	this.entryPoint = options.entryPoint || null;
	this.passwordEncoder = options.passwordEncoder || new PlainTextPasswordEncoder();

	if (!this.ignoreFailure && !this.entryPoint) {
		throw new Error('EntryPoint must be provided if failures are not to be ignored.');
	}
	
	if (options.rememberMe) {
		this.rememberMeService = new RememberMeService(options);
	}
};

BasicAuthenticationFilter.prototype.doFilter = function(request, response, next) {
	var security = require('../security');
	if (!security.isAuthenticated(request)) {
		var header = request.headers[HEADER];
		var match = header.match(HEADER_MATCH);
		if (match != null) {
			var details = match[1];

			var parts = new Buffer(token, 'base64').toString().split(/:/);
			var username = parts[0];
			var password = parts[1];

			this.userProvider.loadUserByUsername(username, (function(scope) {
				return function(user) {
					if (user &&
						user.getPassword() === scope.passwordEncoder.encode(password)) {
						Security.setUser(request, user);
						scope.success(request, response, next);
					} else {
						scope.failure(request, response, next);
					}
				}
			})(this));
		} else {
			next();
		}
	} else {
		next();
	}
};

BasicAuthenticationFilter.prototype.success = function(request, response, callback) {
	if (this.rememberMeService) {
		this.rememberMeService.loginSuccessful(request, response, callback);
	} else {
		callback();
	}
};

BasicAuthenticationFilter.prototype.failure = function(request, response, callback) {
	if (!this.ignoreFailure) {
		this.entryPoint.commence(request, response, null);
	} else {
		callback();
	}
};
