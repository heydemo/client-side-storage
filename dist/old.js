'use strict';

var StorageAPI = require('./StorageAPI');

var localStorageMethod = require('./methods/localStorage');

var sqlLiteStorageMethod = require('./methods/sqlLite');

module.exports = {
  StorageAPI: StorageAPI,
  localStorageMethod: localStorageMethod,
  sqlLiteStorageMethod: sqlLiteStorageMethod
};