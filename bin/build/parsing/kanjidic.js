/*global module,require*/

(function(module, require) {
    "use strict";

    require('string.prototype.codepointat');

    var
        _prefixes = {
            'B':   { attr: 'radical.bushu',              help: '' },
            'C':   { attr: 'radical.kangxi',             help: '' },
            'F':   { attr: 'frequency',                  help: '' },
            'G':   { attr: 'level.jouyou',               help: '' },
            'J':   { attr: 'level.jlpt',                 help: '' },
            'U':   { attr: 'unicode',                    help: '' },
            'DA':  { attr: 'index.DA',                   help: 'the index numbers used in the 2011 edition of the Kanji & Kana book, by Spahn & Hadamitzky.' },
            'DB':  { attr: 'index.DB',                   help: 'the index numbers used in "Japanese For Busy People" vols I-III, published by the AJLT.' }, // DB<vol>.<chapter>
            'DC':  { attr: 'index.DC',                   help: 'the index numbers used in "The Kanji Way to Japanese Language Power" by Dale Crowley.' },
            'DF':  { attr: 'index.DF',                   help: 'the index numbers used in the "Japanese Kanji Flashcards", by Max Hodges and Tomoko Okazaki (White Rabbit Press).' },
            'DG':  { attr: 'index.DG',                   help: 'the index numbers used in the "Kodansha Compact Kanji Guide".' },
            'DH':  { attr: 'index.DH',                   help: 'the index numbers used in the 3rd edition of "A Guide To Reading and Writing Japanese" edited by Ken Hensall et al.' },
            'DJ':  { attr: 'index.DJ',                   help: 'the index numbers used in the "Kanji in Context" by Nishiguchi and Kono.' },
            'DK':  { attr: 'index.DK',                   help: 'the index numbers used by Jack Halpern in his Kanji Learners Dictionary, published by Kodansha in 1999.' },
            'DL':  { attr: 'index.DL',                   help: 'the index numbers used by Jack Halpern in his Kanji Learners Dictionary, 2013 second edition.' },
            'DM':  { attr: 'index.DM',                   help: 'the numbers in Yves Maniette\'s French adapatation of Heisig\'s "Remembering The Kanji".' },
            'DN':  { attr: 'index.DN',                   help: 'the index number used in "Remembering The Kanji, 6th Edition" by James Heisig.' },
            'DO':  { attr: 'index.DO',                   help: 'the index numbers used in P.G. O\'Neill\'s Essential Kanji' },
            'DP':  { attr: 'index.DP',                   help: 'the index numbers used by Jack Halpern in his Kodansha Kanji Dictionary (2013), which is the revised version of the "New Japanese-English Kanji Dictionary" of 1990.' },
            'DR':  { attr: 'index.DR',                   help: 'these are the codes developed by Father Joseph De Roo, and published in his book "2001 Kanji" (Bonjinsha).' },
            'DS':  { attr: 'index.DS',                   help: 'the index numbers used in the early editions of "A Guide To Reading and Writing Japanese" edited by Florence Sakade.' },
            'DT':  { attr: 'index.DT',                   help: 'the index numbers used in the Tuttle Kanji Cards, compiled by Alexander Kask.' },
            'IN':  { attr: 'index.IN',                   help: 'the index codes in the reference books by Spahn & Hadamitzky for the Kanji & Kana book (Tuttle) (2nd edition).' },
            'MN':  { attr: 'index.MN',                   help: 'the index number of the kanji in the 13-volume Morohashi Daikanwajiten.' },
            'MP':  { attr: 'index.MP',                   help: 'the volume.page of the kanji in the 13-volume Morohashi Daikanwajiten.' },
            'I':   { attr: 'index.I',                    help: 'the index codes in the reference books by Spahn & Hadamitzky for The Kanji Dictionary (Tuttle 1996).' },
            'O':   { attr: 'index.O',                    help: 'the index number in "Japanese Names", by P.G. O\'Neill. (Weatherhill, 1972)' },
            'Q':   { attr: 'index.Q',                    help: 'the "Four Corner" code for that kanji.' },
            'H':   { attr: 'index.H',                    help: 'the index number in the New Japanese-English Character Dictionary (1990), edited by Jack Halpern. At most one allowed per line. If not preset, the character is not in Halpern.' },
            'K':   { attr: 'index.K',                    help: 'the index number in the Gakken Kanji Dictionary ("A New Dictionary of Kanji Usage").' },
            'L':   { attr: 'index.L',                    help: 'the index number used in "Remembering The Kanji" by James Heisig.' },
            'E':   { attr: 'index.E',                    help: 'the index number used in "A Guide To Remembering Japanese Characters" by Kenneth G. Henshall.' },
            'N':   { attr: 'index.N',                    help: 'the index number in the "Modern Reader\'s Japanese-English Character Dictionary", edited by Andrew Nelson.' },
            'V':   { attr: 'index.V',                    help: 'the index number in The New Nelson Japanese-English Character Dictionary, edited by John Haig.' },
            'P':   { attr: 'skipCode',                   help: '' },
            'S':   { attr: 'strokes',                    help: '' },
            'Y':   { attr: 'reading.pinyin',             help: '' },
            'T':   { attr: 'reading.nanori',             help: '' },
            '{':   { attr: 'meaning',                    help: '' },
            'W':   { attr: 'reading.korean',             help: '' },
            'X':   { attr: 'crossRef',                   help: '' },
            'ZPP': { attr: 'misclassification.position', help: '' },
            'ZSP': { attr: 'misclassification.strokes',  help: '' },
            'ZRP': { attr: 'misclassification.strokes2', help: '' },
            'ZBP': { attr: 'misclassification.both',     help: '' }
        },

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
                    return true;
            }
            return false;
        },

        _isHiragana = function _isHiragana(rawData) {
            return (
                rawData.codePointAt(0) >= 0x3041 &&
                rawData.codePointAt(0) <= 0x309F
            );
        },

        _isKatakana = function _isKatakana(rawData) {
            return (
                rawData.codePointAt(0) >= 0x30A1 &&
                rawData.codePointAt(0) <= 0x30FF
            );
        },

        _isKanji = function _isKanji(rawData) {
            var _isExtA = (
                    rawData.codePointAt(0) >= 0x3400 &&
                    rawData.codePointAt(0) <= 0x4DBF
                ),
                _isExtB = (
                    rawData.codePointAt(0) >= 0x20000 &&
                    rawData.codePointAt(0) <= 0x2A6DF
                ),
                _isExtC = (
                    rawData.codePointAt(0) >= 0x2A700 &&
                    rawData.codePointAt(0) <= 0x2B73F
                ),
                _isExtD = (
                    rawData.codePointAt(0) >= 0x2B740 &&
                    rawData.codePointAt(0) <= 0x2B81F
                ),
                _isExtE = (
                    rawData.codePointAt(0) >= 0x2B820 &&
                    rawData.codePointAt(0) <= 0x2CEAF
                ),
                _isStandard = (
                    rawData.codePointAt(0) >= 0x4E00 &&
                    rawData.codePointAt(0) <= 0x9FFF
                );

            return _isExtA || _isExtB || _isExtC || _isExtD || _isExtE || _isStandard;
        },

        _isShiftJisCode = function _isShiftJisCode(rawData) {
            var _isFirstCharNumeric = (
                    rawData.codePointAt(0) >= 0x30 &&
                    rawData.codePointAt(0) <= 0x39
                ),
                _isFirstCharLowerHexLetter = (
                    rawData.codePointAt(0) >= 0x61 &&
                    rawData.codePointAt(0) <= 0x66
                );

            return (
                _isFirstCharLowerHexLetter ||
                _isFirstCharNumeric
            );
        },

        _classifyChunkAgainstPrefix = function _classifyChunkAgainstPrefix(rawData) {
            for (var _prefix in _prefixes) {
                if(_prefixes.hasOwnProperty(_prefix)) {
                    var _attr = _prefixes[_prefix].attr;
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
            if(_isHiragana(rawData)) { return ['', 'reading.kun']; }
            if(_isKatakana(rawData)) { return ['', 'reading.on']; }
            if(_isKanji(rawData)) { return ['', 'kanji']; }
            if(_isShiftJisCode(rawData)) { return ['', 'shiftJis']; }

            return _classifyChunkAgainstPrefix(rawData);
        },

        _parseNanori = function _parseNanori(chunkCount) {
            var _data = [];

            if(typeof chunkCount !== 'number') {
                chunkCount = parseInt(chunkCount);
            }

            for(var i = 1; i <= chunkCount; i++) {
                _data.push(_nextChunk());
            }

            return {
                data: _data
            };
        },

        _parseMeaning = function _parseMeaning(chunk) {
            var _data = chunk,
                _end = /}$/gi;

            while(_data.search(_end) === -1) {
                _data += ' ' + _nextChunk();
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

        _nextChunk = function() {
            return _chunks.shift();
        },

        _getData = function(chunk, attr) {
            switch(attr) {
                case 'reading.nanori': return _parseNanori(chunk);
                case 'meaning': return _parseMeaning(chunk);
                case 'reading.kun': return _parseKun(chunk);
                case 'index.DB': return _parseIndexDb(chunk);
                case 'index.MP': return _parseIndexMp(chunk);
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

        _parse = function _parse() {
            var
                _chunk = _nextChunk(),
                _class = _classifyChunk(_chunk),
                _prefix = _class[0],
                _attr = _class[1];

            _chunk = _chunk.slice(_prefix.length);

            var _attrData = _getData(_chunk, _attr);
            _attrData.attr = _attr;

            return _attrData;
        },

        _getChunks = function() {
            return _chunks;
        };
    
    module.exports = function(chunks) {
        _chunks = chunks;

        return {
            parse: _parse,
            getChunks: _getChunks,
            nextChunk: _nextChunk,
            isAttrMultiple: _isAttrMultiple
        };
    };

})(module, require);
