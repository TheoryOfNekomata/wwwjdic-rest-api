/*global module,require,__dirname,console*/

(function(module, require, __dirname, console) {
    "use strict";

    var _unzip = require('unzip');
    var _fs = require('fs');
    var _zlib = require('zlib');
    var _iconv = require('iconv-lite');
    var _path = require('path');

    var _src = {
        protocol: 'ftp',
        //host: 'ftp.monash.edu.au',
        host: 'ftp.edrdg.org',
        //host: 'localhost',
        //path: 'pub/nihongo'
        path: 'pub/Nihongo'
        //path: 'wwwjdic-reader/data/test'
    };

    var _dir = function(absPath) {
        return __dirname + '/../..' + absPath;
    };

    var _files = [
        {
            encoding: 'EUC-JP',
            name: 'kanjidic.gz'
        },
        {
            encoding: 'EUC-JP',
            name: 'kanjd212.gz'
        },
        {
            encoding: 'EUC-JP',
            name: 'enamdict.gz'
        },
        {
            encoding: 'EUC-JP',
            name: 'edict.gz'
        },
        {
            encoding: 'EUC-JP',
            name: 'edict2.gz'
        },
        {
            encoding: 'EUC-JP',
            name: 'radkfile.gz'
        },
        {
            encoding: 'EUC-JP',
            name: 'kradfile.gz'
        },
        {
            name: '4j324_sj.zip',
            files: [
                {
                    name:'4j324_sj.txt',
                    encoding: 'Shift-JIS'
                }
            ]
        },
        {
            name: '4j324_sj.zip',
            files: [
                {
                    name:'4j324_sj.txt',
                    encoding: 'Shift-JIS'
                }
            ]
        },
        {
            name: 'JinmeiKanji.zip',
            files: [
                {
                    name:'NewJinmeiKanji.csv'
                },
                {
                    name:'OldJinmeiKanji.csv'
                }
            ]
        },
        {
            name: 'JLPT_4_3_2.zip',
            files: [
                {
                    name:'JLPT2_vocab.csv'
                },
                {
                    name:'JLPT3_vocab.csv'
                },
                {
                    name:'JLPT4_vocab.csv'
                }
            ]
        },
        {
            name: 'VerbLists.zip',
            files: [
                {
                    name:'EssentialVerbs.csv'
                },
                {
                    name:'OtherVerbs.csv'
                },
                {
                    name:'SuruVerbs.csv'
                }
            ]
        }
    ];

    var _inputDir = _dir("/input/");

    var buildData = function() {
        _files.forEach(function(file) {
            var _inPath = _path.normalize(_inputDir + 'dl/' + file.name);
            var _dotIndex = file.name.indexOf('.');
            var _ext = _dotIndex > -1 ? file.name.slice(_dotIndex) : '';
            var _outFilename = _path.basename(file.name, _ext);
            var _outPath = _path.normalize(_inputDir + 'extract/' + _outFilename);
            var _inEncoding = file.encoding;

            var _readStream = _fs.createReadStream(_inPath);
            var _writeStream;
            var _decompressStream;
            var _encodeStream;

            switch(_ext) {
                case '.gz':
                    _writeStream = _fs.createWriteStream(_outPath);
                    _decompressStream = _zlib.createGunzip();
                    _encodeStream = _iconv.decodeStream(_inEncoding);
                    _readStream
                        .pipe(_decompressStream)
                        .pipe(_encodeStream);

                    _encodeStream
                        .on('data', function(data) {
                            _writeStream.write(data.toString());
                        })
                        .on('end', function() {
                            _writeStream.end();
                        });
                    break;
                case '.zip':
                    var _theFiles = file.files;
                    _decompressStream = _unzip.Parse();
                    _readStream
                        .pipe(_decompressStream)
                        .on('entry', function(entry) {
                            var fileName = entry.path;

                            var _fileEntry = _theFiles.filter(function(theFile) {
                                return theFile.name === fileName;
                            });

                            var _isFound = _fileEntry.length > 0;

                            if(!_isFound) {
                                entry.autodrain();
                                return;
                            }

                            _fileEntry = _fileEntry[0];
                            _writeStream = _fs.createWriteStream(_path.normalize(_inputDir + 'extract/' + fileName));

                            if(!_fileEntry.encoding) {
                                entry.pipe(_writeStream);
                                return;
                            }

                            _encodeStream = _iconv.decodeStream(_fileEntry.encoding);
                            entry.pipe(_encodeStream);

                            _encodeStream
                                .on('data', function (data) {
                                    _writeStream.write(data.toString());
                                })
                                .on('end', function () {
                                    _writeStream.end();
                                });
                        });
                    break;
            }
        });
    };

    module.exports = {
        build: buildData
    };

})(module, require, __dirname, console);
