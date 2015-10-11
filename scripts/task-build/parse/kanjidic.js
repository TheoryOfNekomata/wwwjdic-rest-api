/*global module*/

(function(module) {
    "use strict";

    var
        format = module.require('./kanjidic/format'),
        prefixes = module.require('./kanjidic/prefixes'),
        ctype = module.require('./kanjidic/ctype'),
        _ = module.require('lodash'),

        _chunk,
        _chunks,

        _hasPrefix = function _hasPrefix(rawData, prefix) {
            return rawData.indexOf(prefix) === 0;
        },

        _isAttrMultiple = function _isAttrMultiple(attr) {
            switch(attr) {
                case 'meaning':
                case 'reading.kun':
                case 'reading.on':
                case 'strokes':
                case 'reading.korean':
                case 'reading.pinyin':
                case 'reading.special.nanori':
                case 'reading.special.name_as_radical':
                    return true;
            }
            return false;
        },

        _classifyChunkAgainstPrefix = function _classifyChunkAgainstPrefix(rawData) {
            for (var _prefix in prefixes) {
                if(prefixes.hasOwnProperty(_prefix)) {
                    var _attr = prefixes[_prefix].attr;
                    if (rawData.indexOf(_prefix) === 0) {
                        return [_prefix, _attr];
                    }
                }
            }

            return ['', 'unknown'];
        },

        _classifyChunk = function _classifyChunk(rawData) {
            // this method returns the prefix and the classification
            //
            // row data is checked against its first character

            if(_hasPrefix(rawData, '-')) { return _classifyChunk(rawData.slice(1)); }
            if(ctype.isHiragana(rawData)) { return ['', 'reading.kun']; }
            if(ctype.isKatakana(rawData)) { return ['', 'reading.on']; }
            if(ctype.isKanji(rawData)) { return ['', 'kanji']; }
            if(ctype.isShiftJisCode(rawData)) { return ['', 'shiftJis']; }

            return _classifyChunkAgainstPrefix(rawData);
        },

        _parseReadingSpecial = function _parseReadingSpecial(chunkCount) {
            var _data = [];

            while(ctype.isHiragana(_chunks[0]) || ctype.isKatakana(_chunks[0])) {
                _data.push(_chunks.shift());
            }

            return {
                data: _data
            };

            //if(typeof chunkCount !== 'number') {
            //    chunkCount = parseInt(chunkCount);
            //}

            //if(chunkCount === 1) { // T1 - nanori
            //
            //}
            //
            //if(chunkCount === 2) { // T2 - radical name
            //    while(ctype.isHiragana(_chunks[0]) || ctype.isKatakana(_chunks[0])) {
            //        _data.push(_chunks.shift());
            //    }
            //
            //    return {
            //        data: _data
            //    };
            //}
            //
            //for(var i = 1; i <= chunkCount; i++) {
            //    _data.push(_chunks.shift());
            //}
            //
            //return {
            //    data: _data
            //};
        },

        _parseMeaning = function _parseMeaning(chunk) {
            var _data = chunk,
                _end = /}$/gi;

            while(_data.search(_end) === -1) {
                _data += ' ' + _chunks.shift();
            }

            // remove end character
            _data = _data.slice(0, -1);

            return {
                data: _data
            };
        },

        _parseKun = function _parseKun(chunk) {
            var _periodIndex = chunk.indexOf('.'),
                _hasOkurigana = _periodIndex !== -1;

            if(_hasOkurigana) {
                return {
                    data: {
                        base: chunk.slice(0, _periodIndex),
                        okurigana: chunk.slice(_periodIndex + 1)
                    }
                };
            }

            return {
                data: {
                    base: chunk
                }
            };
        },

        _parseIndexDb = function(chunk) {
            var _periodIndex = chunk.indexOf('.');

            return {
                data: {
                    volume: chunk.slice(0, _periodIndex),
                    chapter: chunk.slice(_periodIndex + 1)
                }
            };
        },

        _parseIndexMp = function(chunk) {
            var _periodIndex = chunk.indexOf('.');

            return {
                data: {
                    volume: chunk.slice(0, _periodIndex),
                    page: chunk.slice(_periodIndex + 1)
                }
            };
        },

        _parseNumberAttr = function(chunk) {
            return {
                data: parseInt(chunk)
            };
        },

        _getData = function(chunk, attr) {
            switch(attr) {
                case 'reading.special': return _parseReadingSpecial(chunk);
                case 'meaning': return _parseMeaning(chunk);
                case 'reading.kun': return _parseKun(chunk);
                case 'index.db': return _parseIndexDb(chunk);
                case 'index.mp': return _parseIndexMp(chunk);
                case 'frequency':
                case 'level.jouyou':
                case 'level.jlpt':
                case 'strokes':
                case 'radical.bushu':
                case 'radical.kangxi':
                    return _parseNumberAttr(chunk);
            }
            return { data: chunk };
        },

        _parseChunk = function _parseChunk() {
            var _nextChunk = _chunks.shift(),
                _class = _classifyChunk(_nextChunk),
                _prefix = _class[0],
                _attr = _class[1],
                _specialReadingAttr = null;

            _nextChunk = _nextChunk.slice(_prefix.length);

            if(_prefix === 'T') {
                switch(parseInt(_nextChunk)) {
                    case 1:
                        _specialReadingAttr = 'reading.special.nanori';
                        break;
                    case 2:
                        _specialReadingAttr = 'reading.special.name_as_radical';
                        break;
                }
            }

            var _attrData = _getData(_nextChunk, _attr);

            _attrData.attr = _specialReadingAttr || _attr;

            return _attrData;
        },

        _parse = function() {
            if(format.isInfoChunk(_chunk)) {
                return {
                    type: 'info',
                    data: {
                        '#': _chunk.replace(format.getInfoRegExp(), '')
                    }
                };
            }

            var _data = {
                type: 'entry',
                data: {}
            };

            while(_chunks.length > 0) {
                var _attrData = _parseChunk(),
                    _attr = _attrData.attr;

                if(_isAttrMultiple(_attr)) {
                    if(!_.has(_data.data, _attr)) {
                        _.set(_data.data, _attr, []);
                    }

                    _.get(_data.data, _attr).push(_attrData.data);
                    continue;
                }
                _.set(_data.data, _attr, _attrData.data);
            }

            return _data;
        };
    
    module.exports = function(chunk) {
        _chunk = chunk;
        _chunks = _chunk.split(' ');

        return _parse();
    };

})(module);
