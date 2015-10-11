/*global module*/

(function format(module) {
    "use strict";

    var
        _infoChunkRegExp = /^\s*？？？\s*/g,
        _getInfoRegExp = function _getInfoRegExp() {
            return _infoChunkRegExp;
        },
        _isInfoChunk = function _isInfoChunk(_chunk) {
            return _chunk.search(_infoChunkRegExp) === 0;
        };

    module.exports = {
        getInfoRegExp: _getInfoRegExp,
        isInfoChunk: _isInfoChunk
    };

})(module);
