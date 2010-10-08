/**
 * Middleware that handles AuthenticationError.
 */

var AuthenticationError = require('./error/authenticationerror');
var AuthorisationError = require('./error/authorisationerror');
 
var ErrorHandler = module.exports = function(options) {
    
	options = options || {};
	
	var entryPoint = options.entryPoint;
	
	if (!options.entryPoint) {
		throw new Error('Error handler setup without entry point.');
	}
	
	return function(error, request, response, next) {
		if (error instanceof AuthenticationError) {
			entryPoint.commence(request, response, error);
		} else if (error instanceof AuthorisationError) {
            response.writeHead(403);
            response.end('');
		}
	};
};