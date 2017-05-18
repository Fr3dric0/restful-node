/**
 * Generic HttpError, with status code 500
 * */
export class HttpError extends Error {
    protected status: number;
    constructor(message) {
        super(message);
        this.status = 500;
    }
}

/**
 * 404 Not Found Responses
 * */
export class NotFoundError extends HttpError {

    constructor(message = null) {
        super(message);
        this.status = 404;
    }
}

/**
 * 400 responses
 * */
export class BadRequestError extends HttpError {

    constructor(message) {
        super(message);
        this.status = 400;
    }
}

export class ForbiddenError extends HttpError {
    constructor(message) {
        super(message);
        this.status = 403;
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message) {
        super(message);
        this.status = 401;
    }
}
