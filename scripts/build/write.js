/*global module,require*/

(function write(module, require) {
    "use strict";

    var _fs = require('fs'),
        _utils = require('./../utils'),
        Stream = require('./write/stream').Stream,
        _merge2 = require('merge2'),
        _stream,
        _formatter,
        _basename,
        _options,
        _compStreams,

        _writeHeader = function _writeHeader() {
            _compStreams.header.write(_formatter.getHeader());
        },

        _writeFooter = function _writeFooter() {
            _compStreams.footer.write(_formatter.getFooter());
        },

        _initStream = function _initStream() {
            _compStreams = {
                header: new Stream(),
                info: new Stream(),
                dataHeader: new Stream(),
                data: new Stream(),
                dataFooter: new Stream(),
                footer: new Stream()
            };
        },

        _writeDataHeader = function _writeDataHeader() {
            _compStreams.dataHeader.write(_formatter.getEntriesHeader());
        },

        _writeDataFooter = function _writeDataFooter() {
            _compStreams.dataFooter.write(_formatter.getEntriesFooter());
        },

        _doWrite = function() {
            _stream = _fs.createWriteStream(_getPath(_basename), { encoding: _options.destEncoding }, function(err) {
                if(!!err) {
                    throw err;
                }
            });

            _merge2(
                _compStreams.header,
                _compStreams.info,
                _compStreams.dataHeader,
                _compStreams.data,
                _compStreams.dataFooter,
                _compStreams.footer
            )
                .pipe(_stream);
        },

        _close = function _close() {
            _doWrite();
        },

        _writeInfo = function _writeInfo(info) {
            _compStreams.info.write(_formatter.formatInfo(info));
        },

        _writeData = function _writeData(data) {
            _compStreams.data.write(data);
        },

        _writeWhich = function _writeWhich(which, data) {
            switch(which) {
                case 'header': return _writeHeader();
                case 'info': return _writeInfo(data);
                case 'data':
                    if(typeof data === 'string') {
                        switch(data) {
                            case 'separator': return _writeData(_formatter.getEntriesSeparator());
                            case 'header': return _writeDataHeader();
                            case 'footer': return _writeDataFooter();
                        }
                    }
                    if(typeof data === 'object') {
                        return _writeData(_formatter.formatData(data));
                    }
                    break;
                case 'footer': return _writeFooter();
            }
        },

        _getFormatter = function _getFormatter() {
            _formatter = require('./write/format/' + _options.output)(_basename, _options);
        },

        _getPath = function _getPath() {
            return _utils.dir('/output/' + _formatter.getFilename());
        };

    module.exports = function _write(basename, options) {

        _basename = basename;
        _options = options;

        _getFormatter();
        _initStream();

        return {
            write: _writeWhich,
            close: _close
        };
    };

})(module, require);
