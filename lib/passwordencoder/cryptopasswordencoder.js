/**
 * A PasswordEncoder that encodes a given password using the crypto library. The
 * algorithm to use can be any supported by crypto. An optional salt can be
 * provided to encode with the password.
 */

var CryptoPasswordEncoder = module.exports = function(options) {
  options = options || {};
  this.algorithm = options.algorithm || 'md5';
  this.salt = options.salt || null;
};

CryptoPasswordEncoder.prototype.encode = function(password) {

  var crypto = require('crypto');

  var hash = crypto.createHash(this.algorithm);
  hash.update(password);

  if (this.salt) {
    hash.update('{' + this.salt + '}');
  }

  return hash.digest('hex');
};
