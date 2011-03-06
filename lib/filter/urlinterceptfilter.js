/**
 * Filter that handles securing urls.
 */

var ElResolver = require('../elresolver');
var SecurityError = require('../error/securityerror');

var UrlInterceptFilter = module.exports = function(interceptUrls) {
  this.interceptUrls = interceptUrls;
  for (var i = 0; i < this.interceptUrls.length; i++) {
    var urlConfig = this.interceptUrls[i];
    if (urlConfig.access) {
      urlConfig.allowAccess = function(request) {
        return ElResolver.resolve(this.access, request);
      };
    }
  }
};

UrlInterceptFilter.prototype.doFilter = function(request, response, next) {
  var url = require('url').parse(request.url);
  for (var i = 0; i < this.interceptUrls.length; i++) {
    var urlConfig = this.interceptUrls[i];
    if (urlConfig.url.exec(url.pathname) != null) {
      if (urlConfig.allowAccess && !urlConfig.allowAccess(request)) {
        throw new SecurityError('Access to secure url denied.');
      }
      break;
    }
  }
  next();
};
