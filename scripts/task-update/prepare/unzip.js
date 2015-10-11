/*global module,require*/

(function unzip(module, require) {
    "use strict";

    var
        path = require('path'),
        fs = require('fs'),
        extract = require('unzip'),

        _cb,
        _fileDef,
        _pending = [],

        _markAsFinished = function(filename) {
            var _index = _pending.indexOf(filename);

            _pending.splice(_index, 1);

            if(_pending.length < 1) {
                _cb();
            }
        },

        _writeToFile = function(entry) {
            var _outFilename = _fileDef.files[entry.path].name,
                _writeStream = fs.createWriteStream('./input/' + _outFilename);

            _pending.push(_outFilename);

            entry.pipe(_writeStream);

            _writeStream.on('finish', function() {
                _markAsFinished(_outFilename);
            });
        },

        _onIterateEntries = function _onIterateEntries(entry) {
            var _fileDefFiles = Object.keys(_fileDef.files);

            if(_fileDefFiles.indexOf(entry.path) === -1) {
                entry.autodrain();
                return;
            }

            _writeToFile(entry);
        },

        _getInputFilename = function _getInputFilename() {
            return _fileDef.name || path.basename(_fileDef.origin);
        },

        _extractFiles = function _extractFiles() {
            fs.createReadStream('./input/' + _getInputFilename())
                .pipe(extract.Parse())
                .on('entry', _onIterateEntries);
        };

    module.exports = function _unzip(fileDef, options, cb) {
        _cb = cb;
        _fileDef = fileDef;

        _extractFiles();
    };

})(module, require);
