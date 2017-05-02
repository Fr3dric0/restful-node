const routeMapper = require('../helper/router');
const HelloWorld = require('../controller/hello-world');
const { NotFoundError } = require('../error/http-errors');

/**
 *
 * @param   {Express}   app
 * @param   {String}    prefix
 * @return  {Express}   app
 * */
const urls = function(app, prefix = '/') {

    const helloWorld = new HelloWorld();

    app.use(prefix, routeMapper(helloWorld));
    // app.use(prefix, routeMapper(helloWorld, {
    //     prefix: ':name/:age'
    // }));



    app.use(prefix, notFoundHandler); // 404 Handler
    return app;
};

/**
 * Handler for 404 responses
 * @function    notFoundHandler
 * */
const notFoundHandler = (req, res, next) => {
    return next(new NotFoundError(`Could not find page ${req.originalUrl}`));
};

module.exports = urls;
