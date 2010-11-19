
var CryptoPasswordEncoder = module.exports = function(options) {
	options = options || {};
	this.algorithm = options.algorithm || 'md5';
};

// TODO: add salt
CryptoPasswordEncoder.prototype.encode = function(password) {
	var crypto = require('crypto');
	var hash = crypto.createHash(this.algorithm);
	hash.update(password);
	return hash.digest('hex');
};
