import { DBConfig } from './db-config';
import * as mongoose from 'mongoose';

/**
 * Will setup the mongoose connection,
 * and ensure mongoose uses ES5 promises
 *
 * @module      config/db
 * @function    setupMongoose
 * */
export const setupMongoose = (config: DBConfig) => {
  mongoose.Promise = global.Promise;
  
  mongoose.connect(
    `mongodb://${!!(config.username && config.pwd) ? (config.username + ':' + config.pwd + '@') : ''}${config.domain || 'localhost'}:${config.port || 27017}/${config.database}`
  );
  
  const db = mongoose.connection;
  db.on('error', onConnectionError);
  db.on('connection', onConnectionSuccess);
  
  return db;
};

export const onConnectionSuccess = () => {
  console.log('Successfully connected to database');
};

export const onConnectionError = (err) => {
  console.error(err);
};
