
var vows = require('vows');
var assert = require('assert');

var PlainTextPasswordEncoder = require('../lib/passwordencoder/plaintextpasswordencoder');

vows.describe('PlainTextPasswordEncoder').addBatch({
	"A PlainTextPasswordEncoder": {
		topic: function() {
			return new PlainTextPasswordEncoder();
		},
		"when calling `encode('passwd')`": {
			topic: function(passwordEncoder) {
				return passwordEncoder.encode('passwd');
			},
			"should return 'passwd'": function(result) {
				assert.equal(result, 'passwd');
			}
		}
	}
}).export(module);