import Storage from '../src/storage-methods';
require('mocha-as-promised')();
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect  = chai.expect;
var Q = require('q');


describe('client-side-storage', function() {
  it("Should be able to save and retrieve a value", function() {
    return Storage.init()
    .then(function() {
      return Storage.clear();
    })
    .then(function() {
      return Storage.set('test_value', 'test me')
    })
    .then(function() {
      return Storage.get('test_value');
    })
    .then(function(value) {
       return result.should.equal(5); 
    });

  });

  it("should be able to update an existing value", function() {
    Storage.init()
    .then(function() {
      return Storage.clear();
    })
    .then(function() {
      return Storage.set('test_value', 'test me')
    })
    .then(function() {
      return Storage.set('test_value', 'updated value');
    })
    .then(function() {
      return Storage.get('test_value');
    })
    .then(function(value) {
      expect(value).to.equal('updated value');
      done();
    });
  });

  it("should be able to remove an existing value", function() {
    Storage.init()
    .then(function() {
      return Storage.clear();
    })
    .then(function() {
      return Storage.set('test_value', 'test me')
    })
    .then(function() {
      return Storage.remove('test_value');
    })
    .then(function() {
      return Storage.get('test_value');
    })
    .then(function(value) {
      expect(value).to.equal(undefined);
      done();
    });
  });

  var test_value, test_value2;
  it("should be able to clear all values", function() {
    Storage.init()
    .then(function() {
      return Storage.clear();
    })
    .then(function() {
      return Storage.set('test_value', 'test me')
    })
    .then(function() {
      return Storage.set('test_value2', 'another test');
    })
    .then(function() {
      return Storage.clear();
    })
    .then(function() {
      return Storage.get('test_value');
    })
    .then(function(value) {
      test_value = value;
      return Storage.get('test_value2');
    })
    .then(function(value) {
      test_value2 = value;
      expect(test_value).to.equal(undefined);
      expect(test_value2).to.equal(undefined);
      done();
    });
  });

  it("should be able to set multiple values with an object", function() {
    var test_value, test_value2;
    Storage.init()
    .then(function() {
      return Storage.clear();
    })
    .then(function() {
      return Storage.set({'test_value': 'test me', 'test_value2': 'another test'});
    })
    .then(function() {
      return Storage.get('test_value');
    })
    .then(function(value) {
      test_value = value;
      return Storage.get('test_value2');
    })
    .then(function(value) {
      test_value2 = value;
      expect(test_value).to.equal('test me');
      expect(test_value2).to.equal('another test');
      done();
    });
  });

  it("should get multiple values", function() {
    var test_value, test_value2;
    Storage.init()
    .then(function() {
      return Storage.clear();
    })
    .then(function() {
      return Storage.set({'test_value': 'test me', 'test_value2': 'another test'});
    })
    .then(function() {
      return Storage.get(['test_value', 'test_value2']);
    })
    .then(function(values) {
      expect(values).to.deep.equal({'test_value': 'test me', 'test_value2': 'another test'});
      done();
    });
  });

  it("should return multiple values which should all be undefined", function() {
    Storage.init()
    .then(function() {
      return Storage.clear();
    })
    .then(function() {
      return Storage.get(['test_value', 'test_value2', 'test_value3']);
    })
    .then(function(values) {
      expect(values).to.deep.equal({'test_value': undefined, 'test_value2': undefined, 'test_value3': undefined});
      done();
    });
  });
});
