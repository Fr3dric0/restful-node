

/**
 * Will attach settings and configurations
 * to the application and request-object
 * @param {Express} app Express-application
 * @param {Object}  config Object with configuration values
 * */
export function settings(app, config = {}) {
    const debug = app.get('env') !== 'production';

    if (!app.restful) { app.restful = {}; }
    if (!app.restful.settings) { app.restful.settings = {}; }

    app.restful.settings.debug = debug;
    app.restful.settings.config = config;

    return (req, res, next) => {
        if (!req.settings) {
            req.settings = {};
        }

        req.settings.config = config;
        req.settings.env = app.get('env');
        req.settings.debug = debug;

        next();
    };
}