
/**
 * Generic HttpError, with status code 500
 * */
class HttpError extends Error {

    constructor (message) {
        super(message);
        this.status = 500;
    }
}

/**
 * 404 Not Found Responses
 * */
class NotFoundError extends HttpError {

    constructor (message = null) {
        super(message);
        this.status = 404;
    }
}

/**
 * 400 responses
 * */
class BadRequestError extends HttpError {

    constructor (message) {
        super(message);
        this.status = 400;
    }
}


module.exports = {
    HttpError,
    NotFoundError,
    BadRequestError
};