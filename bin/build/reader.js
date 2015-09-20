/*global module,require*/

(function inputReader(module, require) {
    'use strict';

    var
        _fs = require('fs'),
        _path = require('path'),

        _encoding = 'utf8',

        // -- Script functions --

        _isEmptyRow = function _isEmptyRow(raw) {
            return raw.length < 1;
        },

        _read = function _read(datasetName, raw, reader) {
            var _data = {
                info: {},
                entries: []
            },
                _reader = require('./reader/' + reader)(datasetName);

            raw = raw.split('\n');

            while(raw.length > 0) {
                var _raw = raw.shift().trim();

                if(_isEmptyRow(_raw)) { continue; }
                if(_reader.isCommentRow(_raw)) {
                    _data.info[datasetName] = _reader.readInfoRow(_raw);
                    continue;
                }

                _data.entries.push(_reader.readDataRow(_raw));
            }

            return _data;
        };

    // -- Main function --

    module.exports = function(filePath, reader, cb) {
        _fs.readFile(filePath, { encoding: _encoding, flag: 'r' }, function _onRead(err, data) {
            if (!!err) {
                throw err;
            }

            cb(_read(_path.basename(filePath), data, reader));
        });
    };

})(module, require);
