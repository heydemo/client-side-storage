var StorageAPI = require('./StorageAPI');

StorageAPI.registerStorageMethod('localStorage', require('./Storage.localStorage'));
//StorageAPI.registerStorageMethod('phonegap', require('./Storage.phonegap'));

module.exports = StorageAPI;
