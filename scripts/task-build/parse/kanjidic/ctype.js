#!/usr/bin/env node
/*global module*/

(function ctype(module) {
    "use strict";

    module.require('string.prototype.codepointat');

    var _isHiragana = function _isHiragana(rawData) {
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
        };

    module.exports = {
        isHiragana: _isHiragana,
        isKatakana: _isKatakana,
        isKanji: _isKanji,
        isShiftJisCode: _isShiftJisCode
    };

})(module);
