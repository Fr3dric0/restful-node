const { NotFoundError } = require('../error/http.error');
const ErrorHandler = require('../error/error-handler');

// Add your own controllers
import { HelloWorld } from '../controllers/hello-world';

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
export function urls(app, prefix = '/', views: any[]) {

    // Controllers
    app.use(prefix, new HelloWorld().asView());

    // Error Handlers
    app.use(prefix, notFoundHandler); // 404 Handler, place last
    app.use(new ErrorHandler(app).handle);

    return app;
}

urls(app, '/', [

]);

/**
 * Handler for 404 responses.
 * Will instantiate a NotFoundError
 * @function    notFoundHandler
 * */
export function notFoundHandler (req, res, next) {
    return next(new NotFoundError(`Could not find page ${req.originalUrl}`));
}

//module.exports = urls;
