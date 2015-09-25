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
                _reader = require('./reader/' + reader)(datasetName),
                _info = [];

            if(_reader.isRowBased) {

                raw = raw.split('\n');

                while(raw.length > 0) {
                    var _raw = raw.shift().trim();

                    if(_isEmptyRow(_raw)) {
                        continue;
                    }
                    if(_reader.isCommentRow(_raw)) {
                        var _readInfo = _reader.readInfoRow(_raw);
                        switch(typeof _readInfo) {
                            case 'string':
                                _info.push(_readInfo);
                                continue;
                        }
                        _data.info[datasetName] = _readInfo;
                        continue;
                    }

                    _data.entries.push(_reader.readDataRow(_raw));
                }


                if(typeof _info[0] === 'string') {
                    _data.info[datasetName] = _info.join(' ');
                }

                return _data;
            }

            while(raw.length > 0) {
                var _readData = _reader.read();
                switch(_readData.type) {
                    case 'entry':
                        _data.entries.push(_readData.content);
                        break;
                    case 'info':
                        _data.info[datasetName] = _readData.content;
                        break;
                }
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
