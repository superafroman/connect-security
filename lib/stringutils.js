
var StringUtils = module.exports = {};

StringUtils.endsWith = function(string, suffix) {
  return string.indexOf(suffix, string.length - suffix.length) !== -1;
};
