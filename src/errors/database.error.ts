
export class DuplicationError extends Error {
    status: number = 400;

    constructor (message) { super(message); }
}