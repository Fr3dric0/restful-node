const mongoose = require('mongoose');

/**
 * Will setup the mongoose connection,
 * and ensure mongoose uses ES5 promises
 * @module      config/db
 * @function    setupMongoose
 * */
const setupMongoose = (config) => {
    mongoose.Promise = global.Promise;

    mongoose.connect(
        `mongodb://${!!(config.username && config.pwd) ? (config.username + ':' + config.pwd + '@') : ''}${config.domain || 'localhost'}:${config.port || 27017}/${config.database}`);

    const db = mongoose.connection;
    db.on('error', databaseConnectionError);
    db.on('connection', databaseConnectionSuccess);

    return db;
};

const databaseConnectionSuccess = () => {
    console.log('Successfully connected to database');
};

const databaseConnectionError = (err) => {
    console.error(err);
};

module.exports = setupMongoose;