/*
 * Simple wrapper api to support key/value storage on chrome extensions, phonegap, localstorage, etc
 *
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var _slice = Array.prototype.slice;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Q = require('q');

var _storage_methods = {};

var _current_method;

var _init = false;

var Storage = (function () {
  function Storage(prefix) {
    _classCallCheck(this, Storage);

    this.prefix = prefix;
    this.wrapMethod(this, 'get');
    this.wrapMethod(this, 'set');
    this.wrapMethod(this, 'remove');
    this.wrapMethod(this, 'clear');
  }

  _createClass(Storage, [{
    key: 'addStorageMethod',
    value: function addStorageMethod(methodClass) {
      if (typeof methodClass !== 'function') {
        throw new Error('storageMethod must be a function');
      }
      var method = new methodClass(this.prefix);
      _storage_methods[method.name] = method;
    }
  }, {
    key: '_selectCorrectStorageMethod',
    value: function _selectCorrectStorageMethod() {
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
  }, {
    key: 'getCurrentMethod',
    value: function getCurrentMethod() {
      return _storage_methods[_current_method];
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
      return typeof value == 'object' && typeof value.then === 'function';
    }
  }, {
    key: 'init',
    value: function init() {
      var deferred = Q.defer();
      this._selectCorrectStorageMethod();

      var promise;
      var method = this.getCurrentMethod();
      var args = [].concat(_slice.call(arguments));

      if (typeof method.init === 'function') {
        this.returnPromise(method.init.apply(null, args)).then(function (value) {
          _init = true;
          deferred.resolve(value);
        });
      } else {
        _init = true;
        deferred.resolve(true);
      }

      return deferred.promise;
    }
  }, {
    key: 'ensureInit',
    value: function ensureInit() {
      if (!_init) {
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
        var args = [].concat(_slice.call(arguments));

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
      var getType = typeof key == 'object' ? 'getMultiple' : 'get';
      var method = this.getCurrentMethod();
      var args = [].concat(_slice.call(arguments));
      return method[getType].apply(method, args);
    }
  }, {
    key: 'set',
    value: function set(key, value) {
      var setType = typeof key == 'object' ? 'setMultiple' : 'set';
      var method = this.getCurrentMethod();
      var args = [].concat(_slice.call(arguments));
      return method[setType].apply(method, args);
    }
  }, {
    key: 'remove',
    value: function remove() {
      var method = this.getCurrentMethod();
      var args = [].concat(_slice.call(arguments));
      return method.remove.apply(method, args);
    }
  }, {
    key: 'clear',
    value: function clear() {
      var method = this.getCurrentMethod();
      var args = [].concat(_slice.call(arguments));
      return method.clear();
    }
  }]);

  return Storage;
})();

exports['default'] = Storage;
module.exports = exports['default'];