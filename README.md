# client-side-storage

## Usage

```javascript
var StorageAPI = require('client-side-storage');

//Optional name 'MyStorage' prevents namespace collisions
var MyStorage  = new StorageAPI('MyStorage');

MyStorage.addStorageMethod(require('client-side-storage/dist/methods/localStorage'));

MyStorage.set('stuff', 'things')
.then(function() {
  return MyStorage.get('stuff');
})
.then(function(stuff) {
  console.log(stuff); // 'things'
});

```

### Set / Retrieve multiple items

```javascript
MyStorage.set({stuff: 'things', children: 'the future'})
.then(function() {
  return MyStorage.get(['stuff', 'children']);
})
.then(function(obj) {
  console.log(obj); // {stuff: 'things', children: 'the future'}
});





```

### Remove item
```javascript
MyStorage.remove('stuff')
.then(function() {
  console.log('stuff is gone');
});
```

### Clear storage
```javascript
MyStorage.clear()
.then(function() {
  console.log('the past is dead, hoss...');
});
```

## Implement your own Storage Method

Implementing new methods is easy.  Simply return a value from your implemented
methods as below.  See client-side-storage/methods/localStorage.js for example

```javascript
class MyStorageMethod() {
  constructor(name) {
    //Save use for prefixing when viable
    this.name = name;
  }
  //This method must be synchronous
  isSupported() {
    //Return true if the storage method will work in the current enviroment
    if (typeof(RandomGlobal.Storage.Plugin) != 'undefined') {
      return true;
    }
  }
  get(variable) {
    return '42';
    //OR - if you need async, simply return a promise
    var deferred = Q.defer();
    deferred.resolve(42);
    return deferred.promise;
  }
  getMultiple(array_of_values) {
    //getMultiple will be called when Storage.get is called with an array of values
    //Your class should return an object of key-value pairs (or a promise which resolves to one)
    return {key1: 'cool_value', key2: 'cool_value2'}
  }
  set(key, value) {
    //set key equal to value in your method
    //if async, return a promise that will resolve when the process is complete
    //i.e.

    var deffered = Q.defer();
    setValueOnServer(function() {
      deferred.resolve(true);
    });
    return deferred.promise;

  }
  setMultiple(obj) {
    //Called when Storage.set is called with an object of key value pairs
    //Set all keys in storage, return a promise or value as above

  }
  remove(variable) {
    //Delete variable, then return promise or value as above
  }
  clear() {
    //Clear your storage then return promise or value as above
  }

}
```
