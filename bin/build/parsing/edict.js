/*global module*/

(function parserEdict(module) {
    "use strict";

    var _chunks,

        _parseTags = function(gloss) {
            var _tagsRegExp = /^(\(.+?\))/i,
                _match = gloss.match(_tagsRegExp),
                _tags = [],
                _getTags = function(match) {
                    if(match.indexOf(',') !== -1) {
                        return match.slice(1, -1).split(',').map(function(aMatch) {
                            return aMatch.trim();
                        });
                    }
                    return [match.slice(1, -1)];
                };

            while(_match !== null) {
                var _matchedTags = _match[0];

                _tags = _tags.concat(_getTags(_matchedTags));

                gloss = gloss.slice(_matchedTags.length).trim();

                _match = gloss.match(_tagsRegExp);
            }

            return _tags;
        },

        _parseGlossText = function(gloss) {
            var _tagsRegExp = /^(\(.+?\))/i,
                _match = gloss.match(_tagsRegExp);

            while(_match !== null) {
                var _matchedTags = _match[0];
                gloss = gloss.slice(_matchedTags.length).trim();
                _match = gloss.match(_tagsRegExp);
            }

            return gloss.trim();
        },

        _parseGlosses = function _parseGlosses(chunk) {
            var _lastTags,
                _sense = 0;

            return chunk.split('/').reduce(function(arr, gloss) {
                if(gloss === '(P)') {
                    return arr;
                }

                var _hasSense = false,
                    _parsedTags = _parseTags(gloss);

                if(_parsedTags.length > 0) {
                    _lastTags = _parsedTags;
                }

                _lastTags.forEach(function(tag) {
                    _hasSense = _hasSense || !isNaN(tag);
                });

                if(_hasSense) {
                    _sense++;
                }

                arr[_sense] = arr[_sense] || [];
                arr[_sense].push({
                    gloss: _parseGlossText(gloss),
                    tags: _lastTags
                });

                return arr;
            }, []);
        },

        _parse = function _parse() {
            var _segments = _chunks
                    .match(/^(.+?)\s+(\[.+?\]\s+)*(.+)$/),
                _data = {
                    key: _segments[1],
                    senses: _parseGlosses(_segments[3].slice(1, -1))
                };

            if(typeof(_segments[2]) === 'string') {
                _data.reading = _segments[2].trim().slice(1, -1);
            }

            return _data;
        };
    
    module.exports = function(chunks) {
        _chunks = chunks;

        return {
            parse: _parse
        };
    };

})(module, require);
