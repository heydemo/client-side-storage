'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Simple wrapper api to support key/value storage on chrome extensions, phonegap, localstorage, etc
 *
 */

var Q = require('q');

var Storage = (function () {
  function Storage(prefix) {
    _classCallCheck(this, Storage);

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

  _createClass(Storage, [{
    key: 'addStorageMethod',
    value: function addStorageMethod(methodClass) {
      if (typeof methodClass !== 'function') {
        throw new Error('storageMethod must be a function');
      }
      var method = new methodClass(this.prefix);
      this._storage_methods[method.name] = method;
    }
  }, {
    key: '_selectCorrectStorageMethod',
    value: function _selectCorrectStorageMethod() {
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
  }, {
    key: 'getCurrentMethod',
    value: function getCurrentMethod() {
      if (!this._current_method) {
        throw new Error('Current method is not yet selected!');
      }
      return this._storage_methods[this._current_method];
    }
    /*
     *  Wrapper function which ensures we always return a promise
     */

  }, {
    key: 'returnPromise',
    value: function returnPromise(value) {
      if (this._isPromise(value)) {
        return value;
      } else {
        var deferred = Q.defer();
        deferred.resolve(value);
        return deferred.promise;
      }
    }
  }, {
    key: '_isPromise',
    value: function _isPromise(value) {
      return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object' && typeof value.then === 'function';
    }
  }, {
    key: 'init',
    value: function init() {
      var _this = this;

      var deferred = Q.defer();
      this._selectCorrectStorageMethod();

      var promise;
      var method = this.getCurrentMethod();
      var args = [].concat(Array.prototype.slice.call(arguments));

      if (typeof method.init === 'function') {
        this.returnPromise(method.init.apply(null, args)).then(function (value) {
          _this._init = true;
          deferred.resolve(value);
        }).catch(function (error) {
          console.log(error);
        });
      } else {
        this._init = true;
        deferred.resolve(true);
      }

      return deferred.promise;
    }
  }, {
    key: 'ensureInit',
    value: function ensureInit() {
      if (!this._init) {
        return this.init();
      } else {
        return this.returnPromise(true);
      }
    }
  }, {
    key: 'wrapMethod',
    value: function wrapMethod(obj, method_name) {
      var original_method = obj[method_name];
      var that = this;
      obj[method_name] = function () {

        var deferred = Q.defer();
        var args = [].concat(Array.prototype.slice.call(arguments));

        obj.ensureInit().then(function () {
          try {
            var return_value = original_method.apply(obj, args);
            return obj.returnPromise(return_value);
          } catch (error) {
            console.log('Error in StorageMethod.' + method_name + ' : ' + error);
          }
        }).then(function (resolved_value) {
          deferred.resolve(resolved_value);
        });

        return deferred.promise;
      };
    }
  }, {
    key: 'get',
    value: function get(key) {
      var getType = (typeof key === 'undefined' ? 'undefined' : _typeof(key)) == 'object' ? 'getMultiple' : 'get';
      var method = this.getCurrentMethod();
      var args = [].concat(Array.prototype.slice.call(arguments));
      return method[getType].apply(method, args);
    }
  }, {
    key: 'set',
    value: function set(key, value) {
      var _this2 = this;

      var deferred = Q.defer();
      var setType = (typeof key === 'undefined' ? 'undefined' : _typeof(key)) == 'object' ? 'setMultiple' : 'set';
      var args = [].concat(Array.prototype.slice.call(arguments));
      var that = this;
      this.ensureInit().then(function () {
        var method = that.getCurrentMethod();
        return that.returnPromise(method[setType].apply(method, args));
      }).then(function (returnedValue) {
        deferred.resolve(returnedValue);
        _this2.notifySubscribers(args);
      }).catch(function (error) {
        console.log(error);
      });
      return deferred.promise;
    }
  }, {
    key: 'remove',
    value: function remove() {
      var method = this.getCurrentMethod();
      var args = [].concat(Array.prototype.slice.call(arguments));
      return method.remove.apply(method, args);
    }
  }, {
    key: 'clear',
    value: function clear() {
      var method = this.getCurrentMethod();
      var args = [].concat(Array.prototype.slice.call(arguments));
      return method.clear();
    }
  }, {
    key: 'subscribe',
    value: function subscribe(callback) {
      this._subscribers.push({ callback: callback });
    }
  }, {
    key: 'notifySubscribers',
    value: function notifySubscribers(args) {
      var keyValueObj = this.formatArgsAsKeyValueObj(args);
      this._subscribers.forEach(function (subscriber) {
        subscriber.callback(keyValueObj);
      });
    }
  }, {
    key: 'formatArgsAsKeyValueObj',
    value: function formatArgsAsKeyValueObj(args) {
      var type = _typeof(args[0]);
      var simple_types = ['string', 'number'];
      if (simple_types.indexOf(type) == -1) {
        return args;
      } else {
        var key = args[0];
        var value = args[1];
        return _defineProperty({}, key, value);
      }
    }
  }]);

  return Storage;
})();

exports.default = Storage;