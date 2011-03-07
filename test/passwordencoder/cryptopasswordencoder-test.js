var vows = require('vows');
var assert = require('assert');

var CryptoPasswordEncoder = require('../../lib/passwordencoder/cryptopasswordencoder');

vows.describe('CryptoPasswordEncoder').addBatch({
  "A CryptoPasswordEncoder": {
    topic: function() {
      return new CryptoPasswordEncoder();
    },
    "when calling `encode('passwd')`": {
      topic: function(passwordEncoder) {
        return passwordEncoder.encode('passwd');
      },
      "should return encoded result": function(result) {
        assert.equal(result, '76a2173be6393254e72ffa4d6df1030a');
      }
    }
  }
}).export(module);
