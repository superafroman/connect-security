/**
 * EntryPoint for Basic authentication.  Sends a 401 with the
 * WWW-Authenticate header when a SecurityError is thrown.
 */

var BasicAuthenticationEntryPoint = module.exports = function(options) {
  options = options || {};
  this.realmName = options.realmName;
  if (!this.realmName) {
    throw new Error('BasicAuthenticationEntryPoint requires a realmName.');
  }
};

BasicAuthenticationEntryPoint.prototype.commence = function(request, response, error) {
  response.writeHead(401, {
    'WWW-Authenticate' : 'Basic realm="' + this.realmName + '"'
  });
  response.end('');
};