"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DuplicationError extends Error {
    constructor(message) {
        super(message);
        this.status = 400;
    }
}
exports.DuplicationError = DuplicationError;
