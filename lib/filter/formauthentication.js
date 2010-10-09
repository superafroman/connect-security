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
    if (!options.usernameParameter) {
        options.usernameParameter = 'username';
    }
    if (!options.passwordParameter) {
        options.passwordParameter = 'password';
    }
    this.loginUrl = options.loginUrl;
    this.logoutUrl = options.logoutUrl;
    this.usernameParameter = options.usernameParameter;
    this.passwordParameter = options.passwordParameter;
};

FormAuthenticationFilter.prototype.doFilter = function(request, response, next) {
    if (this.requiresAuthentication(request)) {
        // plug-in user lookup
        console.log('[FormAuthenticationFilter.doFilter] authentication...');
    } else {
        next();
    }
};

FormAuthenticationFilter.prototype.requiresAuthentication = function(request) {
    var url = request.url;
    if (url.endsWith(this.loginUrl) && 
        request.method === 'POST' && 
        request.params[this.usernameParameter] != null) {
        return true;
    }
    return false;
};

