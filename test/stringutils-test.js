var vows = require('vows');
var assert = require('assert');

var StringUtils = require('../lib/stringutils');

vows.describe('StringUtils').addBatch({
  "StringUtils": {
    topic: function() {
      return StringUtils;
    },
    "when calling `endsWith('this is the end', 'start')`": {
      topic: function(stringUtils) {
        return stringUtils.endsWith('this is the end', 'start');
      },
      "should return `false`": function(result) {
        assert.equal(result, false);
      }
    },
    "when calling `endsWith('this is the end', 'end')`": {
      topic: function(stringUtils) {
        return stringUtils.endsWith('this is the end', 'end');
      },
      "should return `true`": function(result) {
        assert.equal(result, true);
      }
    }
  }
}).export(module);