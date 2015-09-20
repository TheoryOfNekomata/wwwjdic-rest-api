/*global module,require*/

(function app(module, require) {
    "use strict";

    var fs = require('fs');
    var express = require('express');
    var path = require('path');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');

    var routes = require('./routes/index');

    var expressApp = express();

    expressApp.set('env', 'development');

    expressApp.engine('json', function(filePath, options, callback) {
        fs.readFile(filePath, function (err, content) {
            if (err) {
                return callback(new Error(err));
            }
            return callback(null, content.toString());
        });
    });

    expressApp.use(logger('dev'));
    expressApp.use(bodyParser.json());
    expressApp.use(bodyParser.urlencoded({extended: false}));
    expressApp.use(cookieParser());
    expressApp.use('/', routes);

// catch 404 and forward to error handler
    expressApp.use(function (req, res, next) {
        var err = new Error('Invalid Request');
        err.status = 400;
        next(err);
    });

// error handlers

// development error handler
// will print stacktrace
    if (expressApp.get('env') === 'development') {
        expressApp.use(function (err, req, res, next) {
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
    expressApp.use(function (err, req, res, next) {
        var status = err.status || 500;

        res
            .status(status)
            .json({
                message: err.message,
                status: status
            });
    });


    module.exports = expressApp;

})(module, require);
