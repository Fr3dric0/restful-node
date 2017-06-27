import { DBConfig } from './db-config';

/**
 * Will setup the mongoose connection,
 * and ensure mongoose uses ES5 promises
 *
 * @module      config/db
 * @function    setupMongoose
 * */
export function setupMongoose(mongoose, config: DBConfig) {
    return new Promise((rsv, rr) => {
        mongoose.Promise = global.Promise; // TODO:ffl - Didn't work as expected
        mongoose.connect(`mongodb://${!!(config.username && config.pwd) ? (config.username + ':' + config.pwd + '@') : ''}${config.domain || 'localhost'}:${config.port || 27017}/${config.database}`)
            .then(() => rsv(true))
            .catch((err) => rr(err));
    });
}
