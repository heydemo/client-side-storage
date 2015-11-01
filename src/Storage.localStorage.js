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
    var value = localStorage.getItem(variable);
    value = (value == null) ? undefined : JSON.parse(value);
    return value;
  },
  set: function(variable, value) {
    value = JSON.stringify(value);
    localStorage.setItem(variable, value);
    return true;
  },
  setMultiple: function(obj) {
    var value;
    for (var key in obj) {
      value = obj[key];
      localStorage.setItem(key, JSON.stringify(value));
    }
    return true;
  },
  getMultiple: function(keys) {
    var values = {};
    keys.forEach(function(key) {
      var value = localStorage.getItem(key);
      value = (value == null) ? undefined : JSON.parse(value);
      values[key] = value;
    })
    return values;
  },
  remove: function(variable) {
    var deferred = Q.defer(); 
    localStorage.removeItem(variable);
    deferred.resolve();
    return deferred.promise;
  },
  clear: function(variable) {
    localStorage.clear();
  }
}

module.exports = LocalStorage;
