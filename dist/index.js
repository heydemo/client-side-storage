'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _StorageAPI = require('./StorageAPI');

Object.defineProperty(exports, 'StorageAPI', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_StorageAPI).default;
  }
});

var _localStorage = require('./methods/localStorage');

Object.defineProperty(exports, 'localStorageMethod', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_localStorage).default;
  }
});

var _sqlLite = require('./methods/sqlLite');

Object.defineProperty(exports, 'sqlLiteStorageMethod', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_sqlLite).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }