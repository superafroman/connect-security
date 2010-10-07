/**
 * Entry point into form authentication method.  Redirects to configured
 * login URL.
 */

var RETURN_URL_KEY = '__formAuthenticationEntryPoint_returnUrl';

var FormAuthenticationEntryPoint = module.exports = function(formAuth, options) {
     options = options || {};
     this.loginUrl = formAuth.loginUrl;
     this.defaultSuccessUrl = options.defaultSuccessUrl || '/';
     this.failureUrl = options.failureUrl || this.loginUrl + '?error=1';
};

FormAuthenticationEntryPoint.prototype.commence = function(request, response) {
    // TODO: format URL (add query params etc)
    request.session[RETURN_URL_KEY] = request.url;
    response.writeHead(303, 'Location: ' + this.loginUrl);
    response.end('');
};

FormAuthenticationEntryPoint.prototype.success = function(request, response) {
    var returnUrl = request.session[RETURN_URL_KEY] || this.defaultSuccessUrl;
    delete request.session[RETURN_URL_KEY];
    response.writeHead(303, 'Location: ' + returnUrl);
    response.end('');
};

FormAuthenticationEntryPoint.prototype.failure = function(request, response) {
    response.writeHead(303, 'Location: ' + this.failureUrl);
    response.end('');    
};