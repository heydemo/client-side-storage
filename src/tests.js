var Storage = require('./storage-methods');


  QUnit.test("Storage - Save and retrieve value", function(assert) {
    var done  = assert.async();
    Storage.init()
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
      assert.equal(value, 'test me');
      done();
    });
  });

  QUnit.test("Storage - update existing value", function(assert) {
    var done  = assert.async();
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
      assert.equal(value, 'updated value');
      done();
    });
  });

  QUnit.test("Storage - remove existing value", function(assert) {
    var done  = assert.async();
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
      assert.equal(value, undefined);
      done();
    });
  });

  var test_value, test_value2;
  QUnit.test("Storage - clear values", function(assert) {
    var done  = assert.async();
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
      assert.equal(test_value, undefined);
      assert.equal(test_value2, undefined);
      done();
    });
  });

  QUnit.test("Storage - test setting multiple values with an object", function(assert) {
    var test_value, test_value2;
    var done  = assert.async();
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
      assert.equal(test_value, 'test me');
      assert.equal(test_value2, 'another test');
      done();
    });
  });

  QUnit.test("Storage - get multiple values", function(assert) {
    var test_value, test_value2;
    var done  = assert.async();
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
      assert.deepEqual(values, {'test_value': 'test me', 'test_value2': 'another test'});
      done();
    });
  });

  QUnit.test("Storage - test getting multiple values which should all be undefined", function(assert) {
    var done  = assert.async();
    Storage.init()
    .then(function() {
      return Storage.clear();
    })
    .then(function() {
      return Storage.get(['test_value', 'test_value2', 'test_value3']);
    })
    .then(function(values) {
      assert.deepEqual(values, {'test_value': undefined, 'test_value2': undefined, 'test_value3': undefined});
      done();
    });
  });



