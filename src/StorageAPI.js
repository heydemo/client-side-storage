/*
 * Simple wrapper api to support key/value storage on chrome extensions, phonegap, localstorage, etc
 *
 */

var Q = require('q');

var _storage_methods = {};

var _current_method;

var _init = false;

Storage = {
  registerStorageMethod: function(name, method) {
    if (typeof(name) !== 'string') {
      throw new Error('First argument to registerStorageMethod should be name - a string');
    }
    if (typeof(method) !== 'object') {
      throw new Error('Second argument to registerStorageMethod should be method - an object');
    }
    _storage_methods[name] = method;
  },
  _selectCorrectStorageMethod: function() {
    for (var name in _storage_methods) {
      console.log('NAME');
      console.log(name);
      console.log('END NAME');
      console.log(_storage_methods);
      var storage_method = _storage_methods[name];
      if (storage_method.isSupported()) {
        _current_method = name;
      }
    }
    if (!_current_method) {
      throw new Error('No supported storage methods found!');
    }
  },
  _getCurrentMethod: function() {
    return _storage_methods[_current_method]
  },
  ensureInit: function() {
    if (!_init) {
      throw new Error('You must call Storage.init before using Storage');
    }
  },
  init: function() {
    Storage._selectCorrectStorageMethod();

    var promise;
    var method = Storage._getCurrentMethod();
    var args = Array.prototype.slice.apply(arguments);

    if (method.init) {
      promise = method.init.apply(null, args);
    }

    _init = true;

    if (promise) {
      return promise;
    }
    else {
      var deferred = Q.defer();
      deferred.resolve();
      return deferred.promise;
    }
  },
  get: function(key) {
    Storage.ensureInit();

    var getType = (typeof(key) == 'object') ? 'getMultiple' : 'get';

    var method = Storage._getCurrentMethod();
    var args = Array.prototype.slice.apply(arguments);
    return method[getType].apply(null, args);
  },
  set: function(key, value) {
    Storage.ensureInit();

    var setType = (typeof(key) == 'object') ? 'setMultiple' : 'set';

    var method = Storage._getCurrentMethod();
    var args = Array.prototype.slice.apply(arguments);
    return method[setType].apply(null, args);
  },
  remove: function() {
    Storage.ensureInit();
    var method = Storage._getCurrentMethod();
    var args = Array.prototype.slice.apply(arguments);
    return method.remove.apply(null, args);
  },
  clear: function() {
    Storage.ensureInit();
    var method = Storage._getCurrentMethod();
    var args = Array.prototype.slice.apply(arguments);
    return method.clear();
  }
}

module.exports = Storage; //asdfasdfasdfsd
