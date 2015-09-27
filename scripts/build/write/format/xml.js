/*global module,require*/

(function xml(module, require) {
    "use strict";

    var _name,
        _options,
        _header,
        _footer,
        _entriesHeader,
        _entriesSeparator,
        _entriesFooter,
        XmlEntities = require('html-entities').XmlEntities,
        _entityFormatter = new XmlEntities(),

        _getFilename = function _getFilename() {
            return _name + '.xml';
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

        _convertXml = function(data) {
            // TODO format XML recursively
        },

        _formatInfo = function _formatInfo(info) {
            if(typeof info === 'string') {
                return '<info><![CDATA[' + _entityFormatter.encode(info) + ']]></info>';
            }

            var _info = '';
            Object.keys(info).forEach(function(key) {
                _info += '<' + key + '>' + _entityFormatter.encode(info[key]) + '</' + key + '>';
            });

            return '<info>' + _info + '</info>';
        },

        _formatData = function _formatData(data) {
            var _data = '';
            Object.keys(data).forEach(function(key) {
                _data += '<' + key + '>' + data[key] + '</' + key + '>';
            });

            return '<entry>' + _data + '</entry>';
        };

    module.exports = function _xml(name, options) {
        _name = name;
        _options = options;
        _header = '<?xml version="1.0" encoding="' + _options.destEncoding + '"?><dataset name="' + name + '">';
        _footer = '</dataset>';
        _entriesSeparator = '';
        _entriesHeader = _entriesSeparator + '<entries>';
        _entriesFooter = '</entries>';


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
