/*global module,require*/

(function readerKanjidic(module, require) {
    "use strict";

    var
        // -- Node dependencies --

        _ = require('lodash'),

        // -- Script locals --

        _datasetName,

        // -- Script functions --

        _isCommentRow = function _isCommentRow(raw) {
            return raw.indexOf('#') === 0;
        },

        _startParsing = function _startParsing(parser) {
            var _parserChunks = parser.getChunks(),
                _rowData = { dataset: _datasetName };

            while(_parserChunks.length > 0) {
                _parserChunks = parser.getChunks();

                if(_parserChunks[0].length < 1) {
                    parser.nextChunk();
                    continue;
                }

                var _parsedChunk = parser.parse(),
                    _attr = _parsedChunk.attr,
                    _value = _parsedChunk.data;

                if(_attr === 'unicode' || _attr === 'shiftJis') {
                    // we don't want unicode because we can do that ourselves xDDDD
                    continue;
                }

                if(parser.isAttrMultiple(_attr)) {
                    if(!_.has(_rowData, _attr)) {
                        _.set(_rowData, _attr, []);
                    }

                    _.get(_rowData, _attr).push(_value);
                    continue;
                }

                _.set(_rowData, _attr, _value);
            }

            return _rowData;
        },

        _readDataRow = function _readDataRow(chunks) {
            return _startParsing(
                require('./../parsing/kanjidic')(chunks.split(' '))
            );
        },

        _readInfoRow = function _readInfoRow(raw) {
            var _infoFields = raw.split('/');

            return {
                title: _infoFields[0].slice(2),
                copyright: _infoFields[2],
                date: _infoFields[3]
            };
        };

    module.exports = function(datasetName) {
        _datasetName = datasetName;

        return {
            isCommentRow: _isCommentRow,
            readInfoRow: _readInfoRow,
            readDataRow: _readDataRow,
            isRowBased: true
        };
    };

})(module, require);