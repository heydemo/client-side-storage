'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _websqlPromisified = require('websql-promisified');

var _websqlPromisified2 = _interopRequireDefault(_websqlPromisified);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Q = require('q');

var SQLLite = (function () {
  function SQLLite(label) {
    _classCallCheck(this, SQLLite);

    this.name = 'sqlLite';
    this.label = label || this.name;
    this.init = this.init.bind(this);
  }

  _createClass(SQLLite, [{
    key: 'init',
    value: function init() {
      var openDatabase = this.getOpenDatabaseFunction();
      this._db = openDatabase(this.label, "1.0", "Bliss: Bliss App DB", 50000);
      this._db = (0, _websqlPromisified2.default)(this._db);
      return this.createTable();
    }
  }, {
    key: 'createTable',
    value: function createTable() {
      var _this = this;

      return this._db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + _this.label + ' (key, value, dataType)', []);
      });
    }
  }, {
    key: 'getOpenDatabaseFunction',
    value: function getOpenDatabaseFunction() {
      if (typeof openDatabase != 'undefined') {
        return openDatabase;
      } else {
        return require('websql');
      }
    }
  }, {
    key: 'isSupported',
    value: function isSupported() {
      if (typeof this.getOpenDatabaseFunction() != 'undefined') {
        return true;
      }
    }
  }, {
    key: 'get',
    value: function get(variable) {
      var _this2 = this;

      return this._db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM ' + _this2.label + ' WHERE key = \'' + variable + '\'', []);
      }).then(function (results) {
        if (!results[0].rows.length) {
          return;
        } else {
          return JSON.parse(results[0].rows._array[0].value);
        }
      }).catch(function (error) {
        console.log(error);
      });
    }
  }, {
    key: 'exists',
    value: function exists(variable) {
      return this.get(variable).then(function (value) {
        return typeof value != 'undefined';
      });
    }
  }, {
    key: 'set',
    value: function set(variable, value) {
      var _this3 = this;

      value = JSON.stringify(value);
      return this.exists(variable).then(function (exists) {
        return exists ? _this3.update(variable, value) : _this3.insert(variable, value);
      });
    }
  }, {
    key: 'update',
    value: function update(variable, value) {
      var _this4 = this;

      return this._db.transaction(function (tx) {
        tx.executeSql('UPDATE ' + _this4.label + ' SET value = \'' + value + '\' WHERE key = \'' + variable + '\'', []);
      });
    }
  }, {
    key: 'insert',
    value: function insert(variable, value) {
      var _this5 = this;

      return this._db.transaction(function (tx) {
        tx.executeSql('INSERT INTO ' + _this5.label + ' (key, value, dataType) VALUES (\'' + variable + '\', \'' + value + '\', \'\')', []);
      }).catch(function (error) {
        console.log('INSERT ERROR');
        console.log(error);
      });
    }
  }, {
    key: 'setMultiple',
    value: function setMultiple(obj) {
      var value;
      var promises = [];
      for (var key in obj) {
        value = obj[key];
        var promise = this.set(key, value);
        promises.push(promise);
      }
      return Q.all(promises);
    }
    // "'key', 'key2'", etc

  }, {
    key: 'getKeyString',
    value: function getKeyString(keys) {
      return "'" + keys.join("', '") + "'";
    }
  }, {
    key: 'getMultiple',
    value: function getMultiple(keys) {
      var _this6 = this;

      var key_string = this.getKeyString(keys);
      return this._db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM ' + _this6.label + ' WHERE key IN (' + key_string + ')', []);
      }).then(function (results) {
        var returnObj = {};
        if (!results[0].rows.length) {
          keys.forEach(function (key) {
            returnObj[key] = undefined;
          });
        } else {
          results[0].rows._array.forEach(function (row) {
            returnObj[row.key] = JSON.parse(row.value);
          });
        }
        return returnObj;
      });
    }
  }, {
    key: 'remove',
    value: function remove(variable) {
      var _this7 = this;

      return this._db.transaction(function (tx) {
        tx.executeSql('DELETE FROM ' + _this7.label + ' WHERE key = \'' + variable + '\'', []);
      });
    }
  }, {
    key: 'clear',
    value: function clear(variable) {
      var _this8 = this;

      return this._db.transaction(function (tx) {
        tx.executeSql('DELETE FROM ' + _this8.label, []);
      });
    }
  }]);

  return SQLLite;
})();

exports.default = SQLLite;