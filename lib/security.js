/**
 * 
 */
     
var ErrorHandler = require('./errorhandler');

var USER_KEY = '__connect_security_user';

var filters;
var entryPoint;

var exports = module.exports = function(options) {
    options = options || {};
    filters = options.filters || [];
    entryPoint = options.entryPoint;
    
    return function(request, response, next) {
        var i = 0;
        function nextFilter() {
            filter = filters[++i];
            if (filter) {
                filter.doFilter(request, response, nextFilter);
            } else {
                next();
            }
        }
        nextFilter();
    };
};

exports.addFilter = function(filter) {
    filters.push(filter);
};

exports.hasRole = function(roles, request, callback) {
    if (typeof roles === 'string') {
        roles = [roles];
    }
    exports.getUser(request, function(user) {
        if (user.roles) {
            // check if one of roles is one of
        }
        callback(false);
    });
};

exports.isAuthenticated = function(request, callback) {
    exports.getUser(request, function(user) {
        callback(user != null);
    });
};

exports.getUser = function(request, callback) {
    if (request && request.session) {
        callback(request.session[USER_KEY]);
    } else {
        callback();
    }
};

exports.errorHandler = function() {
        return new ErrorHandler({entryPoint: entryPoint});
};

/**
 * Set up default form authentication chain.
 */
exports.formAuthenticationChain = function(options) {
    
    var FormAuthenticationFilter = require('./filter/formauthentication');
    var FormAuthenticationEntryPoint = require('./entrypoint/formauthentication');
    
    var formAuth = new FormAuthenticationFilter(options);
    
    return exports({
        filters: [
            formAuth
        ],
        entryPoint: new FormAuthenticationEntryPoint(formAuth, options)
    });
};
