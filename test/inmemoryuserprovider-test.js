
var vows = require('vows');
var assert = require('assert');

var InMemoryUserProvider = require('../lib/service/inmemoryuserprovider');

vows.describe('InMemoryUserProvider').addBatch({
	"An InMemoryUserProvider with user named 'Fred'": {
		topic: function() {
			return new InMemoryUserProvider({
				users: {
					'fred': {name: 'Fred', password: '12345', roles: ['user']}
				}
			});
		},
		"calling `loadUserByUsername('Fred')`": {
			topic: function(userProvider) {
				userProvider.loadUserByUsername('Fred', (function(scope) {
					return function(result) {
						scope.callback(null, result);
					};
				})(this));
			},
			"should return user with username 'Fred'": function(result) {
				assert.equal(result.name, 'Fred');
			}
		},
		"calling `loadUserByUsername('Bob')`": {
			topic: function(userProvider) {
				userProvider.loadUserByUsername('Bob', (function(scope) {
					return function(result) {
						scope.callback(null, result);
					};
				})(this));
			},
			"should return null": function(result) {
				assert.equal(result, null);
			}
		}
	}
}).export(module);