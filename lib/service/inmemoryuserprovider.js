/**
 * Simple in memory UserProvider.
 */

var InMemoryUserProvider = module.exports = function(options) {	
	options = options || {};
	this.users = options.users || {};
};

InMemoryUserProvider.prototype.loadUserByUsername = function(username, callback) {
	callback(this.users[username]);
};

InMemoryUserProvider.prototype.registerUser = function(username, password, roles) {
	this.users[username] = {
		username: username, 
		password: password, 
		roles: roles
	};
};
