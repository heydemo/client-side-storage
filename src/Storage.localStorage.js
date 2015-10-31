var Q = require('q');
if (typeof(localStorage) == 'undefined') {
  var localStorage = require('localStorage');
}

var LocalStorage = {
  isSupported: function() {
    if (typeof(localStorage) != 'undefined') {
      return true;
    }
  },
  get: function(variable) {
    var deferred = Q.defer();
    var value = localStorage.getItem(variable);
    value = (value == null) ? undefined : JSON.parse(value);
    deferred.resolve(value);
    return deferred.promise;
  },
  set: function(variable, value) {
    value = JSON.stringify(value);
    var deferred = Q.defer(); 
    localStorage.setItem(variable, value);
    deferred.resolve();
    return deferred.promise;
  },
  setMultiple: function(obj) {
    var value;
    for (var key in obj) {
      value = obj[key];
      Storage.set(key, value);
    }
  },
  getMultiple: function(keys) {
    var deferred = Q.defer(); 
    var values = {};
    keys.forEach(function(key) {
      var value = localStorage.getItem(key);
      value = (value == null) ? undefined : JSON.parse(value);
      values[key] = value;
    })
    deferred.resolve(values);
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

module.exports = LocalStorage;
