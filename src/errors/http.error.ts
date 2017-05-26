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

export class NotFoundError extends HttpError {

    constructor(message = null) {
        super(message);
        this.status = 404;
    }
}

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

export class EntityTooLargeError extends HttpError {
    constructor(message) {
        super(message);
        this.status = 413;
    }
}

export class MethodNotAllowed extends HttpError {
    constructor(message = 'Method Not Allowed') {
        super(message);
        this.status = 405;
    }
}