/*global module,require*/

(function index(module, require) {
    "use strict";

    var
        _express = require('express'),
        _logger = require('morgan'),
        _fs = require('fs'),

        _routes = require('./routes/index'),

        _app = _express();

    // view engine setup
    _app.set('env', 'development');
    _app.engine('json', function(filePath, options, callback) {
        _fs.readFile(filePath, function (err, content) {
            if (err) {
                return callback(new Error(err));
            }
            return callback(null, content.toString());
        });
    });

    _app.use(_logger('dev'));

    _app.use('/', _routes);

    // catch 404 and forward to error handler
    _app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (_app.get('env') === 'development') {
        _app.use(function (err, req, res, next) {
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
    _app.use(function (err, req, res, next) {
        res
            .status(err.status || 500)
            .json({
                message: err.message
            });
    });

    module.exports = _app;

})(module, require);
