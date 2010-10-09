/**
 * 
 */
     
var ErrorHandler = require('./errorhandler');
var SecurityError = require('./error/securityerror');

var USER_KEY = '__connect_security_user';

var filters;
var entryPoint;

var Security = module.exports = function(options) {
    options = options || {};
    filters = options.filters || [];
    entryPoint = options.entryPoint;
    
    return function(request, response, next) {
        var i = 0;
        function nextFilter() {
            filter = filters[i++];
			console.log('filter = ' + filter);
            if (filter) {
                filter.doFilter(request, response, nextFilter);
            } else {
                next();
            }
        }
        nextFilter();
    };
};

Security.addFilter = function(filter) {
    filters.push(filter);
};

Security.hasRole = function(roles, request) {
    if (typeof roles === 'string') {
        roles = [roles];
    }
    var user = Security.getUser(request) || {};
	if (user.roles) {
		return roles.some(function(role) {
			return user.roles.some(function(userRole) {
				return role == userRole;
			});
		});
	}
	return false;
};

Security.isAuthenticated = function(request) {
	var user = Security.getUser(request);
	console.log('user = ' + user + ', user != null === ' + (user != null));
	return user != null;
};

Security.getUser = function(request) {
	if (!request.session) {
		throw new Error('connect-security requires sessions to work');
	}
    return request.session[USER_KEY];
};

Security.setUser = function(request, user) {
	if (!request.session) {
		throw new Error('connect-security requires sessions to work');
	}
    request.session[USER_KEY] = user;
};

Security.errorHandler = function() {
    return new ErrorHandler({entryPoint: entryPoint});
};

Security.secure = function(roles, request, callback) {
	if (Security.hasRole(roles, request)) {
		callback();
	} else {
		throw new SecurityError('Access to secure function denied.');
	}
};

/**
 * Set up default form authentication chain.
 */
Security.formAuthenticationChain = function(options) {
    
    var FormAuthenticationFilter = require('./filter/formauthenticationfilter');
    var FormAuthenticationEntryPoint = require('./entrypoint/formauthenticationentrypoint');
    
    var formAuth = new FormAuthenticationFilter(options);
    
    return Security({
        filters: [
            formAuth
        ],
        entryPoint: new FormAuthenticationEntryPoint(formAuth, options)
    });
};
