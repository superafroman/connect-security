/**
 * Filter to process form authentication attempts.
 */
 
var FormAuthenticationFilter = module.exports = function(options) {
    options = options || {};
    if (!options.loginUrl) {
        options.loginUrl = '/login';
    }
    if (!options.logoutUrl) {
        options.logoutUrl = '/logout';
    }
    this.loginUrl = options.loginUrl;
    this.logoutUrl = options.logoutUrl;
};

FormAuthenticationFilter.prototype.doFilter = function(request, response, next) {
    
}