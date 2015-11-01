var Q = require('q');
var _db;

var dbInitialize = function(tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS client_side_storage (key, value, dataType)');
};

var dbError = function(err) {
  console.log("SQL Error: " + err.message);
}

var PhonegapStorage = {
  init: function() {
    _db = window.openDatabase("BlissDB", "1.0", "Bliss: Bliss App DB",	50000);
    _db.transaction(Storage.dbInitialize, Storage.dbError);
  },
  isSupported: function() {
    return false;
  },
  get: function(variable) {
    var deferred = Q.defer();
    var value = localStorage.getItem(variable);
    deferred.resolve(value);
    return deferred.promise;
  },
  set: function(variable, value) {
    var deferred = Q.defer();
    localStorage.setItem(variable, value);
    deferred.resolve();
    return deferred.promise;
  },
  remove: function(variable) {
    var deferred = Q.defer();
    localStorage.removeItem(variable);
    deferred.resolve();
    return deferred.promise;
  },
  clear: function(variable) {
    var deferred = Q.defer();
    localStorage.clear();
    deferred.resolve();
    return deferred.promise;
  }
}

module.exports = PhonegapStorage;
