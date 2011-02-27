/**
 * Middleware that handles SecurityErrors.  If a user is authenticated a 403 
 * response is returned, otherwise the request is passed off to the 
 * configured EntryPoint.
 */
 
var ErrorHandler = module.exports = function(options) {
    
	options = options || {};
	
	var entryPoint = options.entryPoint;
	
	if (!entryPoint) {
		throw new Error('Error handler set up without entry point.');
	}
	
	return function(error, request, response, next) {
		var SecurityError = require('./error/securityerror');
		if (error instanceof SecurityError || (error && error.name == 'SecurityError')) {
			var Security = require('./security');
			if (Security.isAuthenticated(request)) {
	            response.writeHead(403);
	            response.end('');				
			} else {
				entryPoint.commence(request, response, error);				
			}
		} else {
			next();
		}
	};
};