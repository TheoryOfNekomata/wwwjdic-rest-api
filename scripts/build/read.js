/*global module,require*/

(function read(module, require) {
    'use strict';

    var
        _fs = require('fs'),
        _utils = require('./../utils'),

        _doRead = function _doRead(raw, datasetDef, options, cb) {
            // TODO readers beside row-based datasets
            require('./read/row')(raw, datasetDef, options, cb);
        },

        _readFile = function _readFile(datasetDef, options, cb) {
            _fs.readFile(_utils.dir('/input/' + datasetDef.name), { encoding: options.destEncoding }, function _onRead(err, data) {
                if (!!err) {
                    throw err;
                }

                _doRead(data, datasetDef, options, cb);
            });
        };

    // -- Main function --

    module.exports = function _read(datasetDef, options, cb) {
        _readFile(datasetDef, options, cb);
    };

})(module, require);
