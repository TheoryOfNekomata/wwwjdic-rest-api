/*global module*/

(function parserEdict(module) {
    "use strict";

    var _chunks,

        _parse = function _parse() {
            var _splitChunks = _chunks.split(':').map(function(chunk) {
                return chunk.trim();
            }),
                _kanji = _splitChunks[0],
                _components = _splitChunks[1].split(' ');

            return {
                kanji: _kanji,
                radicals: _components
            };
        };
    
    module.exports = function(chunks) {
        _chunks = chunks;

        return {
            parse: _parse
        };
    };

})(module, require);
