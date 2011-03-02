/**
 * Core Security object for configuring the security
 * filter chain, authentication handlers, etc..
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
    roles = [ roles ];
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
  return Security.getUser(request) != null;
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
  if (user) {
    request.session[USER_KEY] = user;
  } else {
    delete request.session[USER_KEY];
  }
};

Security.errorHandler = function() {
  return new ErrorHandler({
    entryPoint : entryPoint
  });
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
  var LogoutFilter = require('./filter/logoutfilter');

  var formAuth = new FormAuthenticationFilter(options);
  var logoutFilter = new LogoutFilter(options);

  var filters = [ formAuth, logoutFilter ];
  if (options.rememberMe) {
    var RememberMeAuthenticationFilter = require('./filter/remembermeauthenticationfilter');
    filters.unshift(new RememberMeAuthenticationFilter(options));
  }

  return Security({
    filters: filters,
    entryPoint: new FormAuthenticationEntryPoint(formAuth, options)
  });
};
