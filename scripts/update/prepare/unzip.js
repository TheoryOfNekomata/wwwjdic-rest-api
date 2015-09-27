/*global module,require*/

(function unzip(module, require) {
    "use strict";

    var
        _path = require('path'),
        _fs = require('fs'),
        _extract = require('unzip'),
        _utils = require('./../../utils'),

        _prepareFile = function _prepareFile(fileDef, options, cb) {
            var _fileDefName = !!fileDef.name ? fileDef.name  : _path.basename(fileDef.origin),
                _fileDefFiles = Object.keys(fileDef.files);

            _fs.createReadStream(_utils.dir('input/' + _fileDefName))
                .pipe(_extract.Parse())
                .on('entry', function (entry) {
                    if(_fileDefFiles.indexOf(entry.path) === -1) {
                        entry.autodrain();
                        return;
                    }

                    var _outFilename = fileDef.files[entry.path].name;

                    entry.pipe(_fs.createWriteStream(_utils.dir('/input/' + _outFilename)));
                })
                .on('close', cb);
        };

    module.exports = function _unzip(fileDef, options, cb) {
        _prepareFile(fileDef, options, cb);
    };

})(module, require);
