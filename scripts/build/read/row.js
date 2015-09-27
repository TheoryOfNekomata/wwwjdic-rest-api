/*global module,require*/

(function row(module, require) {
    "use strict";

    var _formats = {
            'kanjidic': require('./format/kanjidic'),
            'edict': require('./format/edict'),
            'krad': require('./format/krad'),
            //'tanakacorpus': require('./read/tanakacorpus'),
            //'csv-wakan': require('./read/csv-wakan')
        },

        _data,
        _reader = null,
        _info,
        _writer,
        _raw,
        _datasetDef,
        _options,
        _cb,
        _isEntryStart,

        _isEmptyRow = function _isEmptyRow(raw) {
            return raw.length < 1;
        },

        _readCommentRow = function _readCommentRow(raw) {
            var _readInfo = _reader.readInfoRow(raw);
            switch(typeof _readInfo) {
                case 'string':
                    _info.push(_readInfo.slice(1));
                    return;
            }

            if(!!_writer) {
                _writer.write('info', _readInfo);
                return;
            }
            _data.info = _readInfo;
        },

        _readDataRow = function _readDataRow(raw) {
            if(!!_isEntryStart) {
                _writer.write('data', 'separator');
            }

            if(!_isEntryStart) {
                _writer.write('data', 'header');
                _isEntryStart = true;
            }

            if(!!_writer) {
                _writer.write('data', _reader.readDataRow(raw));
                return;
            }
            _data.entries.push(_reader.readDataRow(raw));
        },

        _readRaw = function(raw) {
            var _raw = raw.shift().trim();

            if(_isEmptyRow(_raw)) {
                return;
            }

            if(_reader.isCommentRow(_raw)) {
                return _readCommentRow(_raw);
            }

            _readDataRow(_raw);
        },

        _startBuild = function _startBuild(format) {
            var _streamFormats = ['json', 'xml'];


            if(_streamFormats.indexOf(format) !== -1) {
                _writer = require('./../write')(_datasetDef.name, _options);
                _writer.write('header');
            }
        },

        _endBuild = function _endBuild() {
            if(!!_writer) {
                _writer.write('data', 'footer');
                _writer.write('footer');
                _writer.close();
                _cb();
            }
        },

        _init = function _init() {
            _isEntryStart = false;

            _raw = _raw.split('\n');

            _startBuild(_options.output);

            if(!!_writer) {
                _data = {entries: []};
            }

            _info = [];
            _reader = _formats[_datasetDef.reader](_datasetDef.name);
        },

        _endRead = function _endRead() {
            _endBuild();
        },

        _writeInfoString = function _writeInfoString() {
            if(typeof _info[0] === 'string') {
                if(!!_writer) {
                    _writer.write('info', _info.join('\n'));
                    return;
                }

                _data.info = _info.join('\n');
            }
        },

        _hasRows = function _hasRows() {
            return _raw.length > 0;
        },

        _start = function _start() {
            _init();

            while(_hasRows()) {
                _readRaw(_raw);
            }

            if(typeof _info[0] === 'string') {
                _writeInfoString();
            }

            _endRead();
        };

    module.exports = function _row(raw, datasetDef, options, cb) {
        _raw = raw;
        _datasetDef = datasetDef;
        _options = options;
        _cb = cb;

        _start();
    };

})(module, require);