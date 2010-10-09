/**
 * Entry point into form authentication process.  Redirects to configured
 * login URL.
 */

var SavedRequest = require('../savedrequest');

var FormAuthenticationEntryPoint = module.exports = function(formAuth, options) {
     options = options || {};
     this.loginUrl = formAuth.loginUrl;
};

FormAuthenticationEntryPoint.prototype.commence = function(request, response, error) {
	console.log('commence');
    SavedRequest.setRedirectUrl(request);
    response.writeHead(303, {'Location': this.loginUrl});
    response.end('');
};