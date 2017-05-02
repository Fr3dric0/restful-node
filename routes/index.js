const { NotFoundError } = require('../error/http.error');
const ErrorHandler = require('../error/error-handler');
const routeMapper = require('../helper/route-mapper');

// Add your own controllers
const HelloWorld = require('../controller/hello-world');

/**
 * Attach your routes to the app variable.
 * Example:
 * ```
 * app.use('/api/user', routeMapper(new UserController()));
 * ```
 *
 * @param   {Express}   app
 * @param   {String}    prefix
 * @return  {Express}   app
 * */
const urls = function(app, prefix = '/') {

    // Controllers
    app.use(prefix, routeMapper(new HelloWorld()));


    // Error Handlers
    app.use(prefix, notFoundHandler); // 404 Handler, place last
    app.use(new ErrorHandler(app).handle);

    return app;
};

/**
 * Handler for 404 responses.
 * Will instantiate a NotFoundError
 * @function    notFoundHandler
 * */
const notFoundHandler = (req, res, next) => {
    return next(new NotFoundError(`Could not find page ${req.originalUrl}`));
};

module.exports = urls;
