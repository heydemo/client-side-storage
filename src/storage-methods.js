var StorageAPI = require('./StorageAPI');

StorageAPI.registerStorageMethod('localStorage', require('./methods/localStorage'));
//StorageAPI.registerStorageMethod('phonegap', require('./Storage.phonegap'));

module.exports = StorageAPI;
