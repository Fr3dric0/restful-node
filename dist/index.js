"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("./controllers/controller");
const auth_controller_1 = require("./controllers/auth.controller");
const routes_1 = require("./routes");
const errors_1 = require("./errors");
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
        }
        else {
            k = len + n;
            if (k < 0) {
                k = 0;
            }
        }
        let currentElement;
        while (k < len) {
            currentElement = O[k];
            if (searchElement === currentElement) {
                return true;
            }
            k++;
        }
        return false;
    };
}
module.exports = {
    controllers: { Controller: controller_1.default, AuthController: auth_controller_1.default },
    routes: { urls: routes_1.urls, notFoundHandler: routes_1.notFoundHandler },
    errors: {
        ErrorHandler: errors_1.ErrorHandler,
        HttpError: errors_1.HttpError,
        NotFoundError: errors_1.NotFoundError,
        BadRequestError: errors_1.BadRequestError,
        DuplicationError: errors_1.DuplicationError
    }
};
