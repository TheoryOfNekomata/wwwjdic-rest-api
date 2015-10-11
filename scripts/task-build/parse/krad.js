/*global module*/

(function krad(module) {
    "use strict";

    var
        format = module.require('./krad/format'),

        _chunk,
        _parse = function _parse() {
            if(format.isInfoChunk(_chunk)) {
                var _dataChunk = _chunk.replace(format.getInfoRegExp(), '');

                return {
                    type: 'info',
                    data: {
                        '#': _dataChunk
                    }
                };
            }

            var _splitChunks = _chunk.split(':').map(function(chunkFrags) {
                    return chunkFrags.trim();
                }),
                _kanji = _splitChunks[0],
                _components = _splitChunks[1].split(' ');

            return {
                type: 'entry',
                data: {
                    kanji: _kanji,
                    radicals: _components
                }
            };
        };

    module.exports = function _krad(chunk) {
        _chunk = chunk;

        return _parse();
    };

})(module);
