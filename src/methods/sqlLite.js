var Q = require('q');
import webSqlPromise from 'websql-promisified';

export default class SQLLite {
  constructor(label) {
    this.name = 'sqlLite';
    this.label = label || this.name;
    this.init = this.init.bind(this);
  }
  init() {
    let openDatabase = this.getOpenDatabaseFunction();
    this._db = openDatabase(this.label, "1.0", "Bliss: Bliss App DB", 50000);
    this._db = webSqlPromise(this._db);
    if (!this.tablesCreated()) {
      return this.createTable();
    }
    else {
      let deferred = Q.defer();
      deferred.resolve();
      return deferred.promise;
    }
  }
  tablesCreated() {
    if (typeof localStorage !== 'undefined') {
      return !!localStorage.getItem(`runway_${this.name}_tables_created`);
    }
    return false;
  }
  setTableCreated() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`runway_${this.name}_tables_created`, true);
    }
  }
  createTable() {
    return this._db.transaction((tx) => {
      tx.executeSql(`CREATE TABLE IF NOT EXISTS ${this.label} (key, value, dataType)`, []);
    })
    .then(() => {
      this.setTableCreated();
    });
  }
  getOpenDatabaseFunction() {
    if (typeof(openDatabase) != 'undefined') {
      return openDatabase;
    }
    else {
      return require('websql');
    }
  }
  isSupported() {
    if (typeof(this.getOpenDatabaseFunction()) != 'undefined') {
      return true;
    }
  }
  get(variable) {
    return this._db.transaction((tx) => {
      tx.executeSql(`SELECT * FROM ${this.label} WHERE key = '${variable}'`, []);
    })
    .then((results) => {
      let rows = this.getSqlResultRows(results[0]);
      if (!rows.length) {
        return;
      }
      else {
        return JSON.parse(rows[0].value);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }
  /**
   *  Deal with inconsistencies webSQL implementations  
   */
  getSqlResultRows(result) {
    let sql_rows, return_rows = [];
    if (result) {
      if (result.rows && result.rows._array) {
        sql_rows = result.rows._array;
      }
      else if (result.rows.length) {
        sql_rows = result.rows;
      }
    }
    if (sql_rows) {
      for (var count = 0; count < sql_rows.length; count++) {
        return_rows.push(sql_rows[String(count)]);
      }
    }
    return return_rows;
  }
  exists(variable) {
    return this.get(variable)
    .then((value) => {
      return typeof(value) != 'undefined';
    });
  }
  set(variable, value) {
    value = JSON.stringify(value);
    return this.exists(variable)
    .then((exists) => {
      return exists ? this.update(variable, value) : this.insert(variable, value);
    });
  }
  update(variable, value) {
    return this._db.transaction((tx) => {
      tx.executeSql(`UPDATE ${this.label} SET value = '${value}' WHERE key = '${variable}'`, []);
    })
  }
  insert(variable, value) {
    return this._db.transaction((tx) => {
      tx.executeSql(`INSERT INTO ${this.label} (key, value, dataType) VALUES ('${variable}', '${value}', '')`, []);
    })
    .catch((error) => {
      console.log('INSERT ERROR');
      console.log(error);
    });
  }
  setMultiple(obj) {
    var value;
    var promises = [];
    for (var key in obj) {
      value = obj[key];
      let promise = this.set(key, value);
      promises.push(promise);
    }
    return Q.all(promises);
  }
  // "'key', 'key2'", etc
  getKeyString(keys) {
    return "'"+ keys.join("', '") + "'";
  }
  getMultiple(keys) {
    let key_string = this.getKeyString(keys);
    return this._db.transaction((tx) => {
      tx.executeSql(`SELECT * FROM ${this.label} WHERE key IN (${key_string})`, []);
    })
    .then((results) => {
      let returnObj = {};
      if (!results[0].rows.length) {
        keys.forEach((key) => {
          returnObj[key] = undefined;
        });
      }
      else {
        results[0].rows._array.forEach((row) => {
          returnObj[row.key] = JSON.parse(row.value);
        });
      }
      return returnObj;
    });
  }
  remove(variable) {
    return this._db.transaction((tx) => {
      tx.executeSql(`DELETE FROM ${this.label} WHERE key = '${variable}'`, []);
    });
  }
  clear(variable) {
    return this._db.transaction((tx) => {
      tx.executeSql(`DELETE FROM ${this.label}`, []);
    });
  }
}
