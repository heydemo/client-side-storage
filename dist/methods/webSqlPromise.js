'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var webSqlPromise = (function () {
  function webSqlPromise(db) {
    _classCallCheck(this, webSqlPromise);

    this._db = db;
  }

  _createClass(webSqlPromise, [{
    key: 'executeSql',
    value: function executeSql(sql, args) {
      var deferred = _q2.default.defer();
      this._db.transaction(function (tx) {
        tx.executeSql(sql, args, function (tx, result) {
          deferred.resolve(result);
        }, function (tx, error) {
          deferred.reject(error);
        });
      });
      return deferred.promise;
    }
  }]);

  return webSqlPromise;
})();

exports.default = webSqlPromise;