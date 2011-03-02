/**
 * A password encoder that simply returns the password in plain text.
 */

var PlainTextPasswordEncoder = module.exports = function() {
};

PlainTextPasswordEncoder.prototype.encode = function(password) {
  return password;
};