/**
 * Simple in memory UserProvider.
 */

var InMemoryUserProvider = module.exports = function(options) {
  options = options || {};
  this.users = options.users || {};
  for (var key in this.users) {
    var user = this.users[key];
    this.users[key.toLowerCase()] = user;
    if (!user.getUsername) {
      user.getUsername = function() {
        return this.username;
      };
    }
    if (!user.getPassword) {
      user.getPassword = function() {
        return this.password;
      };
    }
  }
};

InMemoryUserProvider.prototype.loadUserByUsername = function(username, callback) {
  callback(this.users[username.toLowerCase()]);
};
