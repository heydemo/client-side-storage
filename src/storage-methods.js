var StorageAPI = require('./StorageAPI');


StorageAPI.registerStorageMethod('localStorage', require('./Storage.localStorage'));

module.exports = StorageAPI;
