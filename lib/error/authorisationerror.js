
var AuthorisationError = module.exports = function() {
    Error.prototype.constructor.apply(this, arguments);
};

AuthorisationError.prototype = new Error();

AuthorisationError.prototype.constructor = AuthorisationError;

AuthorisationError.prototype.name = 'AuthorisationError';
