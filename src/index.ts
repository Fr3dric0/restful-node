import Controller from './controllers/rest-controller';
import AuthController from './controllers/auth.controller';
import FileController from './controllers/file.controller';
import { setupMongoose } from './database/database-setup';
import { urls, notFoundHandler } from './routes';
import * as errors from './errors';

import Filter from './auth/filter';
import JWTFilter from './auth/jwt.filter';
import JWT from './auth/jwt';
import JWTAuthController from './controllers/jwt-auth.controller';

import { MimeTypes } from './files/mimetypes';

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
    errors,

    controllers: {
        Controller,
        AuthController,
        JWTAuthController,
        FileController
    },
    routes: { urls, notFoundHandler },
    database: { setupMongoose },
    auth: {
        Filter,
        JWT,
        JWTFilter
    },
    files: {
        MimeTypes
    }
};