var Q = require('q');
if (typeof(localStorage) == 'undefined') {
  var localStorage = require('localStorage');
}

class LocalStorage {
  constructor(name) {
    this.name = name;
  }
  isSupported() {
    if (typeof(localStorage) != 'undefined') {
      return true;
    }
  }
  get(variable) {
    var value = localStorage.getItem(this.name +'_'+ variable);
    value = (value == null) ? undefined : JSON.parse(value);
    return value;
  }
  set(variable, value) {
    value = JSON.stringify(value);
    localStorage.setItem(this.name +'_'+ variable, value);
    return true;
  }
  setMultiple(obj) {
    var value;
    for (var key in obj) {
      value = obj[key];
      localStorage.setItem(this.name +'_'+ key, JSON.stringify(value));
    }
    return true;
  }
  getMultiple(keys) {
    var values = {};
    keys.forEach((key) => {
      var value = localStorage.getItem(this.name +'_'+ key);
      value = (value == null) ? undefined : JSON.parse(value);
      values[key] = value;
    });
    return values;
  }
  remove(variable) {
    var deferred = Q.defer(); 
    localStorage.removeItem(this.name +'_'+ variable);
    deferred.resolve();
    return deferred.promise;
  }
  clear(variable) {
    localStorage.clear();
  }
}

module.exports = LocalStorage;
