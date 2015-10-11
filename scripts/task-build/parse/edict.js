/*global module*/

(function parserEdict(module) {
    "use strict";

    var
        format = module.require('./edict/format'),
        tags = module.require('./edict/tags'),

        _chunk,

        _isValidTag = function(tagish, includeSenses) {
            var _isValid = tags.indexOf(tagish) !== -1;

            if(includeSenses) {
                _isValid = _isValid || !isNaN(parseInt(tagish));
            }

            return _isValid;
        },

        _getTags = function(match, includeSenses) {
            if(match.indexOf(',') !== -1) {
                return match.slice(1, -1).split(',').map(function(aMatch) {
                    return aMatch.trim();
                }).filter(function(aMatch) {
                    return _isValidTag(aMatch, includeSenses);
                });
            }
            var _aMatch = match.slice(1, -1);
            return _isValidTag(_aMatch, includeSenses) ? [_aMatch] : [];
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

                _tags = _tags.concat(_getTags(_matchedTags, true));

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

        _getSenseNumber = function(tags) {
            // zero-index
            for(var i = 0; i < tags.length; i++) {
                var _senseTagish = parseInt(tags[i]);

                if(!isNaN(_senseTagish)) {
                    //console.log(_senseTagish - 1);
                    return _senseTagish - 1;
                }
            }
            return -1;
        },

        _parseGlosses = function _parseGlosses(chunk) {
            var _lastTags = [],
                _sense = 0,
                _glosses = [];

            chunk.split('/').forEach(function(rawGloss) {
                rawGloss = rawGloss.trim();

                if(rawGloss === '(P)') {
                    return;
                }

                var _parsedTags = _parseTags(rawGloss),
                    _parsedGloss = _parseGlossText(rawGloss),
                    _tagSense;

                if(_parsedTags.length > 0) {
                    _lastTags = _parsedTags;
                }

                _tagSense = _getSenseNumber(_lastTags);

                if(_tagSense !== -1) {
                    _sense = _tagSense;
                }

                _glosses[_sense] = _glosses[_sense] || [];
                _glosses[_sense].push({
                    gloss: _parsedGloss,
                    tags: _lastTags
                });
            });

            return _glosses;
        },

        _parse = function _parse() {
            if(format.isInfoChunk(_chunk)) {
                return {
                    type: 'info',
                    data: {
                        '#': _chunk.replace(format.getInfoRegExp(), '')
                    }
                };
            }

            var _segments = _chunk.match(/^(.+?)\s+(\[.+?\]\s+)*(.+)$/), // TODO need to fix this for EDICT2 alternate reading/writing
                _data = {
                    type: 'entry',
                    data: {
                        headword: _segments[1],
                        senses: _parseGlosses(_segments[3].slice(1, -1))
                    }
                };

            if(typeof(_segments[2]) === 'string') {
                _data.reading = _segments[2].trim().slice(1, -1);
            }

            return _data;
        };
    
    module.exports = function(chunk) {
        _chunk = chunk;

        return _parse();
    };

})(module);
