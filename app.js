const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const databaseSetup = require('./config/db');

const app = express();

let logger = null;
if (app.get('env') === 'production') {
    logger = morgan('combined', {
        skip: function (req, res) { return res.statusCode < 400 }
    });
} else {
    logger = morgan('dev');
}

app.use(logger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const db = databaseSetup({ database: 'hello-world' });

const paths = require('./routes');
paths(app);

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);

    const response = {'error': err.message };

    if (app.get('env') !== 'production') {
        response.stack = err.stack;
    }

    res.json(response);
});


module.exports = app;
