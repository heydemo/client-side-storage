'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Q = require('q');
if (typeof localStorage == 'undefined') {
  var localStorage = require('localStorage');
}

var LocalStorage = (function () {
  function LocalStorage(name) {
    _classCallCheck(this, LocalStorage);

    this.name = name;
  }

  _createClass(LocalStorage, [{
    key: 'isSupported',
    value: function isSupported() {
      if (typeof localStorage != 'undefined') {
        return true;
      }
    }
  }, {
    key: 'get',
    value: function get(variable) {
      var value = localStorage.getItem(this.name + '_' + variable);
      value = value == null ? undefined : JSON.parse(value);
      return value;
    }
  }, {
    key: 'set',
    value: function set(variable, value) {
      value = JSON.stringify(value);
      localStorage.setItem(this.name + '_' + variable, value);
      return true;
    }
  }, {
    key: 'setMultiple',
    value: function setMultiple(obj) {
      var value;
      for (var key in obj) {
        value = obj[key];
        localStorage.setItem(this.name + '_' + key, JSON.stringify(value));
      }
      return true;
    }
  }, {
    key: 'getMultiple',
    value: function getMultiple(keys) {
      var _this = this;

      var values = {};
      keys.forEach(function (key) {
        var value = localStorage.getItem(_this.name + '_' + key);
        value = value == null ? undefined : JSON.parse(value);
        values[key] = value;
      });
      return values;
    }
  }, {
    key: 'remove',
    value: function remove(variable) {
      var deferred = Q.defer();
      localStorage.removeItem(this.name + '_' + variable);
      deferred.resolve();
      return deferred.promise;
    }
  }, {
    key: 'clear',
    value: function clear(variable) {
      localStorage.clear();
    }
  }]);

  return LocalStorage;
})();

exports.default = LocalStorage;