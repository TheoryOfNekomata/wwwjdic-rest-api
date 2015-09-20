/*global module,require*/

(function parserEdict(module) {
    "use strict";

    var _chunks,

        _mode,

        // TODO POS tags: ftp://ftp.edrdg.org/pub/Nihongo/edict_doc.html

        _parseGloss = function(gloss, tags) {

        },

        _parseGlosses = function _parseGlosses(chunk) {
            var _data = chunk.split('/').reduce(function(arr, next) {
                arr.push({
                    gloss: next
                });

                return arr;
            }, []);

            console.log(_data);

            //return {
            //    data: _data
            //};
        },

        _parse = function _parse() {
            var _segments = _chunks
                    .match(/^(.+?)\s+(\[.+?\]\s+)*(.+)$/),
                _data = {
                    key: _segments[1],
                    gloss: _parseGlosses(_segments[3].slice(1, -1))
                };

            if(typeof(_segments[2]) === 'string') {
                _data.reading = _segments[2].trim().slice(1, -1);
            }

            console.log(_data);

            return _data;
        };
    
    module.exports = function(chunks) {
        _chunks = chunks;

        return {
            parse: _parse
        };
    };

})(module, require);
