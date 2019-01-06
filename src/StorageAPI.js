/*
 * Simple wrapper api to support key/value storage on chrome extensions, phonegap, localstorage, etc
 *
 */

var Q = require('q');


export default class Storage {
  constructor(prefix) {
    this._subscribers = [];
    this.prefix = prefix;
    this.wrapMethod(this, 'get');
    this.wrapMethod(this, 'remove');
    this.wrapMethod(this, 'clear');
    this.subscribe = this.subscribe.bind(this);
    this.notifySubscribers = this.notifySubscribers.bind(this);
    this._init = false;
    this._current_method = false;
    this._storage_methods = [];
  }
  addStorageMethod(methodClass) {
    if (typeof(methodClass) !== 'function') {
      throw new Error('storageMethod must be a function');
    }
    let method = new methodClass(this.prefix);  
    this._storage_methods[method.name] = method;
  }
  _selectCorrectStorageMethod() {
    for (var name in this._storage_methods) {
      var storage_method = this._storage_methods[name];
      if (storage_method.isSupported()) {
        this._current_method = name;
      }
    }
    if (!this._current_method) {
      throw new Error('No supported storage methods found!');
    }
  }
  getCurrentMethod() {
    if (!this._current_method) {
      throw new Error('Current method is not yet selected!');
    }
    return this._storage_methods[this._current_method];
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
        this._init = true;
        deferred.resolve(value);
      })
      .catch((error) => {
        console.log(error);
      });
    }
    else {
      this._init = true;
      deferred.resolve(true);
    }

    return deferred.promise;

  }
  ensureInit() {
    if (!this._init) {
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
    var deferred = Q.defer();
    var setType = (typeof(key) == 'object') ? 'setMultiple' : 'set';
    var args = [...arguments];
    var that = this;
    this.ensureInit()
    .then(function() {
      var method = that.getCurrentMethod();
      return that.returnPromise(method[setType].apply(method, args));
    })
    .then((returnedValue) => {
      deferred.resolve(returnedValue);
      this.notifySubscribers(args);
    })
    .catch((error) => {
      console.log(error);
    });
    return deferred.promise;
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
  subscribe(callback) {
    this._subscribers.push({ callback });
  }
  notifySubscribers(args) {
    var keyValueObj = this.formatArgsAsKeyValueObj(args);
    this._subscribers.forEach((subscriber) => {
      subscriber.callback(keyValueObj);
    });
  }
  formatArgsAsKeyValueObj(args) {
    let type = typeof(args[0]);
    let simple_types = ['string', 'number'];
    if (simple_types.indexOf(type) == -1) {
      return args; 
    }
    else {
      let key = args[0];
      let value = args[1];
      return { [key]: value };
    }
  }
}
