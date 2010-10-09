
var SecurityError = module.exports = function() {
	Error.apply(this, arguments);
};

SecurityError.prototype = new Error();

SecurityError.prototype.constructor = SecurityError;

SecurityError.prototype.name = 'SecurityError';
