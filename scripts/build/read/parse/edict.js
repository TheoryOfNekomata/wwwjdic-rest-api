/*global module*/

(function parserEdict(module) {
    "use strict";

    var _chunks,

        _isValidTag = function(tagish) {
            var _validTags = [
                'adj-i',
                'adj-na',
                'adj-no',
                'adj-pn',
                'adj-t',
                'adj-f',
                'adj',
                'adv',
                'adv-n',
                'adv-to',
                'aux',
                'aux-v',
                'aux-adj',
                'conj',
                'ctr',
                'exp',
                'int',
                'iv',
                'n',
                'n-adv',
                'n-pref',
                'n-suf',
                'n-t',
                'num',
                'pn',
                'pref',
                'prt',
                'suf',
                'v1',
                'v2a-s',
                'v4h',
                'v4r',
                'v5',
                'v5aru',
                'v5b',
                'v5g',
                'v5k',
                'v5k-s',
                'v5m',
                'v5n',
                'v5r',
                'v5r-i',
                'v5s',
                'v5t',
                'v5u',
                'v5u-s',
                'v5uru',
                'v5z',
                'vz',
                'vi',
                'vk',
                'vn',
                'vs',
                'vs-c',
                'vs-i',
                'vs-s',
                'vt',
                'Buddh',
                'MA',
                'comp',
                'food',
                'geom',
                'gram',
                'ling',
                'math',
                'mil',
                'physics',
                'X',
                'abbr',
                'arch',
                'ateji',
                'chn',
                'col',
                'derog',
                'eK',
                'ek',
                'fam',
                'fem',
                'gikun',
                'hon',
                'hum',
                'ik',
                'iK',
                'id',
                'io',
                'm-sl',
                'male',
                'male-sl',
                'oK',
                'obs',
                'obsc',
                'ok',
                'on-mim',
                'poet',
                'pol',
                'rare',
                'sens',
                'sl',
                'uK',
                'uk',
                'vulg'
            ];

            return _validTags.indexOf(tagish) !== -1;
        },

        _getTags = function(match) {
            if(match.indexOf(',') !== -1) {
                return match.slice(1, -1).split(',').map(function(aMatch) {
                    return aMatch.trim();
                }).filter(function(aMatch) {
                    return _isValidTag(aMatch);
                });
            }
            var _aMatch = match.slice(1, -1);
            return _isValidTag(_aMatch) ? [_aMatch] : [];
        },

        _getParenthesisText = function(match) {
            if(match.indexOf(',') !== -1) {
                var _isTag = true;
                var _theText = match.slice(1, -1).split(',').map(function (aMatch) {
                    return aMatch.trim();
                });

                _theText.forEach(function(tagish) {
                    _isTag = _isTag && _isValidTag(tagish);
                });

                return {
                    text: '(' + _theText.join(',') + ')',
                    isTag: _isTag
                };
            }

            return {
                text: match,
                isTag: _isValidTag(match.slice(1, -1))
            };
        },

        _parseTags = function(gloss) {
            var _tagsRegExp = /^(\(.+?\))/i,
                _match = gloss.match(_tagsRegExp),
                _tags = [];

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
                _match = gloss.match(_tagsRegExp),
                _gloss = [];

            while(_match !== null) {
                var _matchedTags = _match[0],
                    _paren = _getParenthesisText(_matchedTags);

                if(!_paren.isTag) {
                    _gloss.push(_paren.text);
                }

                gloss = gloss.slice(_paren.text.length).trim();

                _match = gloss.match(_tagsRegExp);
            }

            _gloss.push(gloss.trim());

            return _gloss.join(' ');
        },

        _parseGlosses = function _parseGlosses(chunk) {
            var _lastTags = [],
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
                    headword: _segments[1],
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
