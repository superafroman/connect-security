/**
 * Service that deals with logging a user in based on a hashed token.
 * 
 * Configuration options: { userProvider: UserProvider, rememberMe: { secret:
 * '', // hash secret validityTime: 1814400000, // milliseconds token is valid
 * for parameter: 'rememberMe' // remember me form parameter } }
 */

require('cookies');

var COOKIE_NAME = 'connect_security_remember_me_cookie';

var RememberMeService = module.exports = function(options) {
  options = options || {};
  options.rememberMe = options.rememberMe || {};

  this.userProvider = options.userProvider;
  if (!this.userProvider) {
    throw new Error('RememberMeService requires a UserProvider.');
  }

  this.secret = options.rememberMe.secret || '';
  this.validFor = options.rememberMe.validFor || 1814400000;
  this.parameter = options.rememberMe.parameter || 'rememberMe';
};

RememberMeService.prototype.autoLogin = function(request, response, callback) {
  var cookies = new Cookies(request, response);
  var token = cookies.get(COOKIE_NAME);
  if (token) {
    for ( var i = 0; i < token.length % 4; i++) {
      token = token + '=';
    }
    var parts = new Buffer(token, 'base64').toString().split(/:/);
    if (parts[1] >= new Date()) {
      this.userProvider.loadUserByUsername(parts[0], (function(scope) {
        return function(user) {
          if (!user) {
            callback();
          } else {
            var hash = scope.hash(user, parts[1]);
            if (hash === parts[2]) {
              callback(user);
            } else {
              callback();
            }
          }
        };
      })(this));
    }
  } else {
    callback();
  }
};

RememberMeService.prototype.loginSuccessful = function(request, response,
    callback) {
  var rememberMe = request.body[this.parameter];
  if (rememberMe === 'on') {
    var user = require('../security').getUser(request);
    var validTo = +new Date() + this.validFor;
    var hash = this.hash(user, validTo);
    var token = new Buffer(user.getUsername() + ':' + validTo + ':' + hash);
    token = token.toString('base64');
    while (token[token.length - 1] === '=') {
      token = token.substring(0, token.length - 1);
    }
    var cookies = new Cookies(request, response);
    cookies.set(COOKIE_NAME, token, {
      expires : new Date(validTo)
    });
  }
  callback();
};

RememberMeService.prototype.logoutSuccessful = function(request, response,
    callback) {
  var cookies = new Cookies(request, response);
  cookies.set(COOKIE_NAME);
  callback();
};

RememberMeService.prototype.hash = function(user, validTo) {
  var crypto = require('crypto');
  var hash = crypto.createHash('md5');
  hash.update(user.getUsername() + ':' + user.getPassword() + ':' + validTo
      + ':' + this.secret);
  return hash.digest('hex');
};