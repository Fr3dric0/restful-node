"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * @module
 * */
class ErrorHandler {
    constructor(app) {
        this.app = app;
        // Remember to bind this to all methods
        this.handle = this.handle.bind(this);
    }
    handle(err, req, res, next) {
        res.status(err.status || 500);
        const response = {};
        // Only append `error`
        // field if a message exists
        if (err.message && err.message.length > 0) {
            response.error = err.message;
        }
        if (this.app.get('env') !== 'production') {
            response.stack = err.stack;
        }
        res.json(response);
    }
}
exports.ErrorHandler = ErrorHandler;
module.exports = ErrorHandler;
