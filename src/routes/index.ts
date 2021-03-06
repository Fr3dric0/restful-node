import { NotFoundError, ErrorHandler } from '../errors/index';
import { Route } from './route';

/**
 * Routes is added to the views array,
 * with the following format
 * Example:
 * ```
 * [
 *  { controller: new IndexController() },
 *  { url: '/home', controller: new HomeController() }
 * ]
 * ```
 *
 * @param   {Express}   app     The express-app
 * @param   {String}    prefix  Url prefix
 * @param   {Route[]}   views   list of views
 * @return  {Express}   app
 * */
export function urls(app, prefix: string, views: Route[]) {
    for (const view of views) {
        if (!view.controller) {
            continue;
        }

        if (view.url && !view.url.startsWith('/')) {
            throw new TypeError(`Url '${view.url}' must be prefixed with /`);
        }

        app.use(`${prefix}${view.url || ''}`, view.controller.asView());
    }

    // Error Handlers
    app.use(prefix, notFoundHandler); // 404 Handler
    app.use(new ErrorHandler(app).handle);

    return app;
}

/**
 * Handler for 404 responses.
 * Will instantiate a NotFoundError
 * @function    notFoundHandler
 * */
export function notFoundHandler (req, res, next) {
    return next(new NotFoundError(`Could not find page ${req.originalUrl}`));
}

