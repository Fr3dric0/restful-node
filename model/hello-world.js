const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { BadRequestError } = require('../error/http-errors');

const HelloWorld = new Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    created_at: { type: Date, default: Date.now() },
    hook: { type: String }
});

HelloWorld.pre('save', (next) => {
    this.hook = 'Set in the pre-save hook';

    next();
});

HelloWorld.post('save', (err, doc, next) => {
    console.log(err);
    console.log(doc);

    if (err && err.name === 'ValidationError'
        && err.errors && err.errors.description) {

        return next(new BadRequestError(err.errors.description.message))
    }

    next();
});

module.exports = mongoose.model('HelloWorld', HelloWorld);
