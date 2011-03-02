/**
 * Keep track of a request URL for retrieving at some
 * other time.
 */

var REQUEST_KEY = '__connect_security_savedrequest_key';

var SavedRequest = module.exports = {};

SavedRequest.getRedirectUrl = function(request) {
  if (!request.session) {
    throw new Error('connect-security requires sessions to work');
  }
  if (request.session[REQUEST_KEY]) {
    var url = request.session[REQUEST_KEY];
    delete request.session[REQUEST_KEY];
    return url;
  }
  return null;
};

SavedRequest.setRedirectUrl = function(request) {
  if (!request.session) {
    throw new Error('connect-security requires sessions to work');
  }
  // TODO: format with params
  var url = request.url;
  request.session[REQUEST_KEY] = url;
};