import Storage from '../src/StorageAPI.js';
import localStorageMethod from '../src/methods/localStorage.js';
import sqlStorageMethod from '../src/methods/sqlLite.js';
import randomstring from 'randomstring';


var expect = require('chai').expect;

describe('StorageAPI', function() {
  describe('registerStorageMethod', function() {
    it('Should throw an error argument is not a class', function() {
      var TestStorage = new Storage('subscribe_test');
      expect(() => { TestStorage.addStorageMethod('myStorage') }).to.throw('storageMethod must be a function');
    });
  });
});

var storage_methods = [localStorageMethod, sqlStorageMethod];

storage_methods.forEach((storage_method) => {
  describe(storage_method.name, function() {
    it('Should allow clients to subscribe to the storage.set event', function(done) {
      var TestStorage = new Storage('subscribe_test');
      TestStorage.addStorageMethod(storage_method);
      let times_called = 0;
      TestStorage.subscribe((changed) => {
        expect(changed.test).to.equal('value');
        times_called++;
      });
      TestStorage.set('test', 'value')
      .then(() => {
        expect(times_called).to.equal(1);
        done();
      });
    });

    it("should be able to save and retrieve a value", function(done) {
      var TestStorage = new Storage('subscribe_test');
      TestStorage.addStorageMethod(storage_method);
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
      var TestStorage = new Storage('subscribe_test');
      TestStorage.addStorageMethod(storage_method);
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
      var TestStorage = new Storage('subscribe_test');
      TestStorage.addStorageMethod(storage_method);
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
      var TestStorage = new Storage('subscribe_test');
      TestStorage.addStorageMethod(storage_method);
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
      var TestStorage = new Storage('subscribe_test');
      TestStorage.addStorageMethod(storage_method);
      var test_value, test_value2;
      var test_value_orig  = randomstring.generate(8);
      var test_value_orig2 = randomstring.generate(8); 
      TestStorage.init()
      .then(function() {
        return TestStorage.clear();
      })
      .then(function() {
        return TestStorage.set({test_value: test_value_orig, test_value2: test_value_orig2});
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
        expect(test_value).to.equal(test_value_orig);
        expect(test_value2).to.equal(test_value_orig2);
        done();
      })
      .catch(function(error) {
        console.log(error);
      });
    });
    it("should get multiple values with an array of keys", function(done) {
      var TestStorage = new Storage('subscribe_test');
      TestStorage.addStorageMethod(storage_method);
      var test_value, test_value2;
      TestStorage.init()
      .then(function() {
        return TestStorage.clear();
      })
      .then(function() {
        return TestStorage.set({'test_value': 'test me2', 'test_value2': 'another test2'});
      })
      .then(function() {
        return TestStorage.get(['test_value', 'test_value2']);
      })
      .then(function(values) {
        expect(values).to.deep.equal({'test_value': 'test me2', 'test_value2': 'another test2'});
        done();
      })
      .catch(function(error) {
        console.log('caught error!');
        console.log(error);
      });
    });
    it("should return multiple values which should all be undefined", function(done) {
      var TestStorage = new Storage('subscribe_test');
      TestStorage.addStorageMethod(storage_method);
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
      })
      .catch((error) => {
        console.log(error);
      });
    });
  });
});
