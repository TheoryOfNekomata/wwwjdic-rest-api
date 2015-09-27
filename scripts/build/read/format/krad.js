/*global module,require*/

(function readerEdict(module, require) {
    "use strict";

    var
        // -- Script locals --

        _datasetName,

        // -- Script functions --

        _isCommentRow = function _isCommentRow(raw) {
            return raw.indexOf('#') === 0;
        },

        _startParsing = function _startParsing(parser) {
            return parser.parse();
        },

        _readDataRow = function _readDataRow(chunks) {
            return _startParsing(
                require('./../parse/krad')(chunks)
            );
        },

        _readInfoRow = function _readInfoRow(raw) {
            return raw;
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