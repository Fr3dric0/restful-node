"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Generic HttpError, with status code 500
 * */
class HttpError extends Error {
    constructor(message) {
        super(message);
        this.status = 500;
    }
}
exports.HttpError = HttpError;
/**
 * 404 Not Found Responses
 * */
class NotFoundError extends HttpError {
    constructor(message = null) {
        super(message);
        this.status = 404;
    }
}
exports.NotFoundError = NotFoundError;
/**
 * 400 responses
 * */
class BadRequestError extends HttpError {
    constructor(message) {
        super(message);
        this.status = 400;
    }
}
exports.BadRequestError = BadRequestError;
// module.exports = {
//     HttpError,
//     NotFoundError,
//     BadRequestError
// }; 
