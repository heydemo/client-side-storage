import Storage from '../src/StorageAPI.js';
import localStorageMethod from '../src/methods/localStorage.js';

var TestStorage = new Storage('test');
TestStorage.addStorageMethod(localStorageMethod);

var expect = require('chai').expect;


describe('client-side-storage', function() {

  describe('registerStorageMethod', function() {
    it('Should throw an error argument is not a class', function() {
      expect(() => { TestStorage.addStorageMethod('myStorage') }).to.throw('storageMethod must be a function');
    });
  });



  describe('localStorage', function() {
    it("should be able to save and retrieve a value", function(done) {
      TestStorage.init()
      .then(function() {
        return TestStorage.clear();
      })
      .then(function() {
        return TestStorage.set('test_value', 'test me')
      })
      .then(function() {
        return TestStorage.get('test_value');
      })
      .then(function(value) {
        expect(value).to.equal('test me');
        done();
      });
    });
    it("should be able to update an existing value", function(done) {
      TestStorage.init()
      .then(function() {
        return TestStorage.clear();
      })
      .then(function() {
        return TestStorage.set('test_value', 'test me')
      })
      .then(function() {
        return TestStorage.set('test_value', 'updated value');
      })
      .then(function() {
        return TestStorage.get('test_value');
      })
      .then(function(value) {
        expect(value).to.equal('updated value');
        done();
      });
    });

    it("should be able to remove an existing value", function(done) {
      TestStorage.init()
      .then(function() {
        return TestStorage.clear();
      })
      .then(function() {
        return TestStorage.set('test_value', 'test me')
      })
      .then(function() {
        return TestStorage.remove('test_value');
      })
      .then(function() {
        return TestStorage.get('test_value');
      })
      .then(function(value) {
        expect(value).to.equal(undefined);
        done();
      });
    });

    it("should be able to clear all values", function(done) {
      var test_value, test_value2;
      TestStorage.init()
      .then(function() {
        return TestStorage.clear();
      })
      .then(function() {
        return TestStorage.set('test_value', 'test me')
      })
      .then(function() {
        return TestStorage.set('test_value2', 'another test');
      })
      .then(function() {
        return TestStorage.clear();
      })
      .then(function() {
        return TestStorage.get('test_value');
      })
      .then(function(value) {
        test_value = value;
        return TestStorage.get('test_value2');
      })
      .then(function(value) {
        test_value2 = value;
        expect(test_value).to.equal(undefined);
        expect(test_value2).to.equal(undefined);
        done();
      });
    });

    it("should be able to set multiple values with an object", function(done) {
      var test_value, test_value2;
      TestStorage.init()
      .then(function() {
        return TestStorage.clear();
      })
      .then(function() {
        return TestStorage.set({'test_value': 'test me', 'test_value2': 'another test'});
      })
      .then(function() {
        var value = TestStorage.get('test_value');
        return value;
      })
      .then(function(value) {
        test_value = value;
        return TestStorage.get('test_value2');
      })
      .then(function(value) {
        test_value2 = value;
        expect(test_value).to.equal('test me');
        expect(test_value2).to.equal('another test');
        done();
      })
      .catch(function(error) {
        console.log(error);
      });
    });
    it("should get multiple values with an array of keys", function(done) {
      var test_value, test_value2;
      TestStorage.init()
      .then(function() {
        return TestStorage.clear();
      })
      .then(function() {
        return TestStorage.set({'test_value': 'test me', 'test_value2': 'another test'});
      })
      .then(function() {
        return TestStorage.get(['test_value', 'test_value2']);
      })
      .then(function(values) {
        expect(values).to.deep.equal({'test_value': 'test me', 'test_value2': 'another test'});
        done();
      })
      .catch(function(error) {
        console.log('caught error!');
        console.log(error);
      });
    });
    it("should return multiple values which should all be undefined", function(done) {
      TestStorage.init()
      .then(function() {
        return TestStorage.clear();
      })
      .then(function() {
        return TestStorage.get(['test_value', 'test_value2', 'test_value3']);
      })
      .then(function(values) {
        expect(values).to.deep.equal({'test_value': undefined, 'test_value2': undefined, 'test_value3': undefined});
        done();
      });
    });
  });

});
