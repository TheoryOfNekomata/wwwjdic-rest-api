/*global module,require*/

(function fourchar(module, require) {
    "use strict";

    var
        cheerio = require('cheerio'),
        fs = require('fs'),
        path = require('path'),
        Entities = require('html-entities').AllHtmlEntities,
        moment = require('moment'),

        _queryFile = function _queryFile(data) {
            data = data
                .replace(/\(adj\)/g, '(adj-i)')
                .replace(/;\s*\(in\)/g, '; in')
                .replace(/;\s*\(on\)/g, '; on')
                .replace(/;\s*\(at\)/g, '; at')
                .replace(/[（）\u3000\t]/g, ' ')
            ;

            var $ = cheerio.load(data),
                _entities = new Entities(),
                _yojijukugo = [],
                _yojiElem = $('body')
                .children('p').first()
                .children('blockquote').first()
                .children().first().next().next()
                .children().first()
                .children().first().next()
                .children().first().next()
                .children(),
                _yojiLength = _yojiElem.length - 1,
                _currElem = _yojiElem.first(),
                _getYojiText = function _getYojiText(rawYojiText) {
                    rawYojiText = rawYojiText.replace(/\n+/g, ' ');

                    var _arrYojiText = rawYojiText
                        .trim()
                        .split('<br>')
                        .map(function(yojiText) {
                            return _entities.decode(yojiText).trim();
                        })
                        .filter(function(yojiText) {
                            return yojiText.indexOf('[') !== 0;
                        });

                    if(!_arrYojiText[0]) {
                        return null;
                    }

                    _arrYojiText[0] = _arrYojiText[0]
                        .replace(/\[(.+?)\]/gi, '')
                        .trim()
                        .split(' ')
                        .filter(function(item) {
                            return item.length > 0;
                        });

                    if(_arrYojiText[0].length > 2) {
                        if(_arrYojiText[0][1] === '(') {
                            _arrYojiText[0].splice(1, 1);
                            _arrYojiText[0][1] = _arrYojiText[0][1].slice(0, -1);
                        }
                        if(_arrYojiText[0][1].indexOf('・') === 0) {
                            _arrYojiText[0][0] += _arrYojiText[0][1];
                            _arrYojiText[0].splice(1, 1);
                        }
                        if(_arrYojiText[0][1].indexOf('・') !== -1) {
                            _arrYojiText[0][1] = _arrYojiText[0][1].replace(/[・]/g, '');
                        }
                        if(!!_arrYojiText[0][2]) {
                            _arrYojiText[0][1] += '・' + _arrYojiText[0].pop();
                        }
                    }

                    if(!!_arrYojiText[2]) {
                        _arrYojiText[1] += _arrYojiText.pop();
                    }

                    if(_arrYojiText[0][1].indexOf('(') !== -1 || _arrYojiText[0][1].indexOf(')') !== -1) {
                        _arrYojiText[0][1] = _arrYojiText[0][1].replace(/[()]/g, '');
                    }

                    var _headword,
                        _reading,
                        _gloss = '/' +
                            _arrYojiText[1]
                                .replace(/\s*[;]\s*/g, '/')
                                .replace(/\[/g, '(')
                                .replace(/\]/g, ')') +
                            '/';

                    if(_arrYojiText[0][0].indexOf('・') !== -1 && _arrYojiText[0][1].indexOf('・') !== -1) {
                        _arrYojiText[0][0] = _arrYojiText[0][0].split('・');
                        _arrYojiText[0][1] = _arrYojiText[0][1].split('・');

                        var _arrYojiBoth = [];

                        _arrYojiText[0][0].forEach(function(headword) {
                            _arrYojiText[0][1].forEach(function(reading) {
                                _arrYojiBoth.push({
                                    headword: headword,
                                    reading: reading,
                                    gloss: _gloss
                                });
                            });
                        });

                        return _arrYojiBoth;
                    }

                    if(_arrYojiText[0][0].indexOf('・') !== -1) {
                        _arrYojiText[0][0] = _arrYojiText[0][0].split('・');

                        _reading = _arrYojiText[0][1];

                        return _arrYojiText[0][0].map(function(headword) {
                            return {
                                headword: headword,
                                reading: _reading,
                                gloss: _gloss
                            };
                        });
                    }

                    if(_arrYojiText[0][1].indexOf('・') !== -1) {
                        _arrYojiText[0][1] = _arrYojiText[0][1].split('・');

                        _headword = _arrYojiText[0][0];

                        return _arrYojiText[0][1].map(function(reading) {
                            return {
                                headword: _headword,
                                reading: reading,
                                gloss: _gloss
                            };
                        });
                    }

                    return {
                        headword: _arrYojiText[0][0],
                        reading: _arrYojiText[0][1],
                        gloss: _gloss
                    };
                };

            for(var i = 0; i < _yojiLength; i++) {
                var _yojiHtmlText = _currElem.html().trim();

                if(_yojiHtmlText.indexOf('<a') === 0 || _yojiHtmlText.indexOf('<center>') === 0 || _yojiHtmlText.trim().length < 1) {
                    _currElem = _currElem.next();
                    continue;
                }

                _yojijukugo = _yojijukugo.concat(_getYojiText(_yojiHtmlText));
                _currElem = _currElem.next();
            }

            return _yojijukugo.sort(function(itemA, itemB) {
                return itemA.reading.localeCompare(itemB.reading);
            });
        },

        _prepareFile = function _prepareFile(fileDef, options, cb) {
            var _fileDefName = !!fileDef.name ? fileDef.name  : path.basename(fileDef.origin);

            fs.readFile('./input/' + _fileDefName, { encoding: options.destEncoding }, function _onReadFile(err, data) {
                if(!!err) {
                    throw err;
                }

                var _fileDefNameDotIndex = _fileDefName.indexOf('.'),
                    _queryFilename = './input/' + (path.basename(_fileDefName, _fileDefNameDotIndex !== -1 ? _fileDefName.slice(_fileDefNameDotIndex) : ''));

                var _entries = _queryFile(data),
                    _lines = [
                        [
                            '　？？？ ',
                            path.basename(_queryFilename).toUpperCase() + ' - ' + fileDef.desc,
                            fileDef.attrib,
                            'Retrieved: ' + moment(new Date()).format('YYYY-MM-DD')
                        ].join('/') + '/'
                    ];

                _entries.forEach(function _onGetEntry(entry) {
                    _lines.push(
                        [
                            entry.headword,
                            '[' + entry.reading + ']',
                            entry.gloss
                        ].join(' ')
                    );
                });

                fs.writeFile(_queryFilename, _lines.join('\n'), { encoding: options.destEncoding, flag: 'w' }, cb);
            });
        };

    module.exports = function _fourchar(fileDef, options, cb) {
        _prepareFile(fileDef, options, cb);
    };

})(module, require);
