/**
 * Middleware that handles AuthenticationError.
 */
 
var ErrorHandler = module.exports = function(options) {
    
	options = options || {};
	
	var entryPoint = options.entryPoint;
	
	if (!options.entryPoint) {
		throw new Error('Error handler set up without entry point.');
	}
	
	return function(error, request, response, next) {
		var SecurityError = require('./error/securityerror');
		if (error instanceof SecurityError) {
			var Security = require('./security');
			if (Security.isAuthenticated(request)) {
	            response.writeHead(403);
	            response.end('');				
			} else {
				console.log('entryPoint = ' + entryPoint);
				entryPoint.commence(request, response, error);				
			}
		} else {
			next();
		}
	};
};