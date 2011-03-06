/**
 * Basic EL resolver.  Just evals configured access variable
 * and provides access to some basic functions.
 */

var request;

function hasRole(roles) {
  var Security = require('./security');
  return Security.hasRole(roles, request);
}

function isAuthenticated() {
  var Security = require('./security');
  return Security.isAuthenticated(request);
}

var ELResolver = module.exports = {};

ELResolver.resolve = function(el, aRequest) {
  request = aRequest;
  var r = eval(el);
  aRequest = null;
  return r;
};

