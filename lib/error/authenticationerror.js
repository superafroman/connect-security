
var AuthenticationError = module.exports = function() {
	Error.prototype.constructor.apply(this, arguments);
};

AuthenticationError.prototype = new Error();

AuthenticationError.prototype.constructor = AuthenticationError;

AuthenticationError.prototype.name = 'AuthenticationError';
