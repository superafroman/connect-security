/**
 * 
 */

var USER_KEY = '__connect_security_user';

var filters;
var entryPoint;

var exports = module.exports = function(options) {
    options = options || {};
    filters = options.filters || [];
    entryPoint = options.entryPoint;
    
    return function(request, response, next) {
        next();
    };
};

exports.addFilter = function(filter) {
    filters.push(filter);
};

exports.isAuthenticated = function(request, callback) {
    if (request && request.session) {
        callback(request.session[USER_KEY]);
    }
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

// require('./methodsecurity');
// require('./urlsecurity');