const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const eca = require('../dist');
const { setupMongoose } = eca.database;

const app = express();

// Set logger to only print detailed
// responses, if NODE_ENV is not in production
let logger = null;
if (app.get('env') === 'production') {
    logger = morgan('combined', {
        skip: function (req, res) {
            return res.statusCode < 400 // Only log messages with error type severity
        }
    });
} else {
    logger = morgan('dev');
}

app.use(logger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

///////////////////////////
//  DATABASE CONNECTION  //
// Provide configuration //
// as parameter          //
///////////////////////////
setupMongoose({ database: 'hello-world' })
    .then((db) => {
        console.log('Database connection established');
    })
    .catch( err => {throw err});

///////////////////////////
//  ROUTE REGISTRATION   //
// Also handles errors   //
///////////////////////////
const HelloWorld = require('./controller/hello-world');
const BasicController = require('./controller/basic-controller');

const { urls } = eca.routes;
urls(app, '/api', [
    { url: '/basic', controller: new BasicController() },
    { controller: new HelloWorld() }
]);

module.exports = app;
