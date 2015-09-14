/*global module,require,__dirname*/

(function(module, require, __dirname) {
    "use strict";

    var fs = require('fs');
    var express = require('express');
    var path = require('path');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');

    var routes = require('./routes/index');
    var data = require('./middleware/app/download');

    var app = express();

    app.set('env', 'development');

    app.engine('json', function(filePath, options, callback) {
        fs.readFile(filePath, function (err, content) {
            if (err) {
                return callback(new Error(err));
            }
            return callback(null, content.toString());
        });
    });

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use('/', routes);

    data.build();

// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Invalid Request');
        err.status = 400;
        next(err);
    });

// error handlers

// development error handler
// will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res
                .status(err.status || 500)
                .json({
                    message: err.message,
                    error: err
                });
        });
    }

// production error handler
// no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        var status = err.status || 500;

        res
            .status(status)
            .json({
                message: err.message,
                status: status
            });
    });


    module.exports = app;

})(module, require, __dirname);
