/*global module,require*/

(function json(module, require) {
    "use strict";

    var _name,

        _header,
        _footer,
        _entriesHeader,
        _entriesSeparator,
        _entriesFooter,

        _getFilename = function _getFilename() {
            return _name + '.json';
        },

        _getHeader = function _getHeader() {
            return _header;
        },

        _getFooter = function _getFooter() {
            return _footer;
        },

        _getEntriesHeader = function _getEntriesHeader() {
            return _entriesHeader;
        },

        _getEntriesSeparator = function _getEntriesSeparator() {
            return _entriesSeparator;
        },

        _getEntriesFooter = function _getEntriesFooter() {
            return _entriesFooter;
        },

        _formatInfo = function _formatInfo(info) {
            return '"info":'+JSON.stringify(info);
        },

        _formatData = function _formatData(data) {
            return JSON.stringify(data);
        };

    module.exports = function _json(filename, options) {
        _name = filename;
        _header = '{';
        _footer = '}';
        _entriesSeparator = ',';
        _entriesHeader = _entriesSeparator + '"entries":[';
        _entriesFooter = ']';

        return {
            getFilename: _getFilename,
            getHeader: _getHeader,
            getFooter: _getFooter,
            getEntriesHeader: _getEntriesHeader,
            getEntriesFooter: _getEntriesFooter,
            getEntriesSeparator: _getEntriesSeparator,
            formatInfo: _formatInfo,
            formatData: _formatData
        };
    };

})(module, require);
