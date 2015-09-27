/*global module, require*/

(function prepare(module, require) {
    "use strict";

    var
    // -- Node dependencies --
        _utils = require('./../utils'),
        _async = require('async'),

        _subtasks = {
            fourchar: require('./prepare/fourchar'),
            unzip: require('./prepare/unzip')
        },
        _prepareSources = function _prepareSources(options, cb3) {
            var _asyncTasks = [];

            options.sources.forEach(function _onIterateInputFiles(fileDef) {
                if(!fileDef.prepare) {
                    return;
                }

                _asyncTasks.push(function(cb2) {
                    _subtasks[fileDef.prepare](fileDef, options, cb2);
                });
            });

            _async.parallel(_asyncTasks, cb3);
        };

    // -- Script functions --

    module.exports = function _prepare(options, cb) {
        _utils.print('Preparing source files...');

        _prepareSources(options, cb);
    };

})(module, require);
