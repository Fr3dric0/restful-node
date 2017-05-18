/**
 * Is responsible for parsing,
 * handling and responding error messages.
 *
 * This object is automatically
 * appended as the last route in `routes/index.js#urls`
 * @module ErrorHandler
 * */
export default class ErrorHandler {
    protected app;

    constructor(app) {
        this.app = app;

        // Remember to bind this to all methods
        this.handle = this.handle.bind(this);
    }

    handle(err, req, res, next) {

        const response: {error?: string, stack?: any } = {};

        // Only appends `error`
        // field if a message exists
        if (err.message && err.message.length > 0) {
            response.error = err.message;
        }

        // Ensures stack-trace is excluded when in production
        if (this.app.get('env') !== 'production') {
            response.stack = err.stack;
        }

        res.status(err.status || 500)
            .json(response);
    }
}
