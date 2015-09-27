/*global module,require*/

(function readerEdict(module, require) {
    "use strict";

    var
        // -- Script locals --

        _datasetName,

        // -- Script functions --

        _isCommentRow = function _isCommentRow(raw) {
            return raw.indexOf('？？？') === 0;
        },

        _startParsing = function _startParsing(parser) {
            //var _rowData = parser.parse();
            //_rowData.dataset = _datasetName;
            //return _rowData;
            return parser.parse();
        },

        _readDataRow = function _readDataRow(chunks) {
            return _startParsing(
                require('./../parse/edict')(chunks)
            );
        },

        _readInfoRow = function _readInfoRow(raw) {
            var _infoFields = raw.split('/');

            return {
                title: _infoFields[1],
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