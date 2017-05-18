"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
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
function urls(app, prefix, views) {
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
    app.use(prefix, notFoundHandler); // 404 Handler, place last
    app.use(new errors_1.ErrorHandler(app).handle);
    return app;
}
exports.urls = urls;
/**
 * Handler for 404 responses.
 * Will instantiate a NotFoundError
 * @function    notFoundHandler
 * */
function notFoundHandler(req, res, next) {
    return next(new errors_1.NotFoundError(`Could not find page ${req.originalUrl}`));
}
exports.notFoundHandler = notFoundHandler;
