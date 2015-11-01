/*
 * Simple wrapper api to support key/value storage on chrome extensions, phonegap, localstorage, etc
 *
 */

var Q = require('q');

var _storage_methods = {};

var _current_method;

var _init = false;

export default class Storage {
  constructor(prefix) {
    this.prefix = prefix;
    this.wrapMethod(this, 'get');
    this.wrapMethod(this, 'set');
    this.wrapMethod(this, 'remove');
    this.wrapMethod(this, 'clear');
  }
  addStorageMethod(methodClass) {
    if (typeof(methodClass) !== 'function') {
      throw new Error('storageMethod must be a function');
    }
    let method = new methodClass(this.prefix);  
    _storage_methods[method.name] = method;
  }
  _selectCorrectStorageMethod() {
    for (var name in _storage_methods) {
      var storage_method = _storage_methods[name];
      if (storage_method.isSupported()) {
        _current_method = name;
      }
    }
    if (!_current_method) {
      throw new Error('No supported storage methods found!');
    }
  }
  getCurrentMethod() {
    return _storage_methods[_current_method]
  }
  /*
   *  Wrapper function which ensures we always return a promise
   */
  returnPromise(value) {
    if (this._isPromise(value)) {
      return value;
    }
    else {
      var deferred = Q.defer();
      deferred.resolve(value);
      return deferred.promise;
    }
  }
  _isPromise(value) {
    return (typeof(value) == 'object' && typeof(value.then) === 'function');
  }
  init() {
    var deferred = Q.defer();
    this._selectCorrectStorageMethod();

    var promise;
    var method = this.getCurrentMethod();
    var args = [...arguments];

    if (typeof(method.init) === 'function') {
      this.returnPromise(method.init.apply(null, args))
      .then((value) => {
        _init = true;
        deferred.resolve(value);
      });
    }
    else {
      _init = true;
      deferred.resolve(true);
    }

    return deferred.promise;

  }
  ensureInit() {
    if (!_init) {
      return this.init();
    }
    else {
      return this.returnPromise(true);
    }
  }
  wrapMethod(obj, method_name) {
    var original_method = obj[method_name];
    var that = this;
    obj[method_name] = function() {

      var deferred = Q.defer();
      var args = [...arguments];

      obj.ensureInit()
      .then(function() {
        try {
          var return_value = original_method.apply(obj, args);
          return obj.returnPromise(return_value);
        }
        catch(error) {
          console.log('Error in StorageMethod.'+ method_name +' : ' + error);
        }
      })
      .then(function(resolved_value) {
        deferred.resolve(resolved_value);
      });

      return deferred.promise;
    }
  }
  get(key) {
    var getType = (typeof(key) == 'object') ? 'getMultiple' : 'get';
    var method = this.getCurrentMethod();
    var args = [...arguments];
    return method[getType].apply(method, args);
  }
  set(key, value) {
    var setType = (typeof(key) == 'object') ? 'setMultiple' : 'set';
    var method = this.getCurrentMethod();
    var args = [...arguments];
    return method[setType].apply(method, args);
  }
  remove() {
    var method = this.getCurrentMethod();
    var args = [...arguments];
    return method.remove.apply(method, args);
  }
  clear() {
    var method = this.getCurrentMethod();
    var args = [...arguments];
    return method.clear();
  }
}
