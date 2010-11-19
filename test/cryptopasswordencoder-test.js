
var vows = require('vows');
var assert = require('assert');

var CryptoPasswordEncoder = require('../lib/passwordencoder/cryptopasswordencoder');

vows.describe('CryptoPasswordEncoder').addBatch({
	"A CryptoPasswordEncoder": {
		topic: function() {
			return new CryptoPasswordEncoder();
		},
		"when calling `encode('passwd')`": {
			topic: function(passwordEncoder) {
				return passwordEncoder.encode('passwd');
			},
			"should return 'passwd'": function(result) {
				console.log(result);
				assert.equal(result, 'passwd');
			}
		}
	}
}).export(module);
