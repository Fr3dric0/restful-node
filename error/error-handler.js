class ErrorHandler {

    constructor (app) {
        this.app = app;

        // Remember to bind this to all methods
        this.handle = this.handle.bind(this);
    }

    handle (err, req, res, next) {
        res.status(err.status || 500);

        const response = { 'error': err.message };

        if (this.app.get('env') !== 'production') {
            response.stack = err.stack;
        }

        res.json(response);
    }
}

module.exports = ErrorHandler;