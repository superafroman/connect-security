
var Security = require('./security');

var exports = module.exports = {};

exports.secure = function(roles, request, callback) {
    Security.hasRole(roles, request, function(hasRole) {
        if (hasRole) {
            callback();
        } else {
            // raise error, start auth process
        }
    });
};
