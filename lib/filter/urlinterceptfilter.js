/**
 * Filter that handles securing urls.
 */

var SecurityError = require('../error/securityerror');

var UrlInterceptFilter = module.exports = function(interceptUrls) {
  this.interceptUrls = interceptUrls;
  for (var i = 0; i < this.interceptUrls.length; i++) {
    var interceptUrl = this.interceptUrls[i];
    if (interceptUrl.access) {
      
    }
  }
};

UrlInterceptFilter.prototype.doFilter = function(request, response, next) {
  var url = require('url').parse(request.url);
  for (var i = 0; i < this.interceptUrls.length; i++) {
    if (this.interceptUrls[i].url.matches(url.pathname)) {
      if (!this.interceptUrls[i].allowAccess()) {
        throw new SecurityError('Access to secure url denied.');
      }
      break;
    }
  }
  next();
};
