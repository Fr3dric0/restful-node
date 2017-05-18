import Controller from './controllers/controller';
import AuthController from './controllers/auth.controller';
import { urls, notFoundHandler } from './routes';
import {
    HttpError,
    NotFoundError,
    BadRequestError,
    ErrorHandler,
    DuplicationError
} from './errors';


// Pollyfills
declare global {
    interface Array<T> {
        includes(searchElement: T): boolean;
    }
}

// Add Array includes polyfill if needed
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes#Polyfill
if (!Array.prototype.includes) {
    Array.prototype.includes = function (searchElement /*, fromIndex*/) {
        'use strict';
        const O = Object(this);
        const len = parseInt(O.length, 10) || 0;
        if (len === 0) {
            return false;
        }
        const n = parseInt(arguments[1], 10) || 0;
        let k;
        if (n >= 0) {
            k = n;
        } else {
            k = len + n;
            if (k < 0) {
                k = 0;
            }
        }
        let currentElement;
        while (k < len) {
            currentElement = O[k];
            if (searchElement === currentElement) { // NaN !== NaN
                return true;
            }
            k++;
        }
        return false;
    };
}

module.exports = {
    controllers: { Controller, AuthController },
    routes: { urls, notFoundHandler },
    errors: {
        ErrorHandler,
        HttpError,
        NotFoundError,
        BadRequestError,
        DuplicationError
    }
};