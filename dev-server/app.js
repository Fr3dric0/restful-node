const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const restful = require('../dist');

const app = express();


app.use(restful.setup.settings(app, {
    // Place configuration values
}));

// Set logger to only print detailed
// responses, if NODE_ENV is not in production
app.use(!app.restful.settings.debug ?
    morgan('combined', {
        skip: function (req, res) {
            return res.statusCode < 400 // Only log requests of type error
        }
    }) :
    morgan('dev')
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

///////////////////////////
//  DATABASE CONNECTION  //
// Provide configuration //
// as parameter          //
///////////////////////////
restful.database.setupMongoose(mongoose, { database: 'hello-world' })
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

const { urls } = restful.routes;
urls(app, '/api', [
    { url: '/basic', controller: new BasicController() },
    { controller: new HelloWorld() }
]);

module.exports = app;
