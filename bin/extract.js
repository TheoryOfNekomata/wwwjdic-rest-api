/*global require,__dirname,console*/

(function extract(require, __dirname, console) {
    "use strict";

    var
        // -- Node dependencies --

        _unzip = require('unzip'),
        _fs = require('fs'),
        _zlib = require('zlib'),
        _iconv = require('iconv-lite'),
        _path = require('path'),

        // -- Input files --

        _files = [

            // Main KANJIDIC data
            { name: 'kanjidic.gz', encoding: 'EUC-JP', origin: 'http://ftp.monash.edu.au/pub/nihongo/kanjidic.gz' },

            // Extended KANJIDIC data
            { name: 'kanjd212.gz', encoding: 'EUC-JP', origin: 'http://ftp.monash.edu.au/pub/nihongo/kanjd212.gz' },

            // More Extended KANJIDIC data
            { name: 'kanjd213u.gz', encoding: 'UTF-8', origin: 'http://ftp.monash.edu.au/pub/nihongo/kanjd213u.gz' },

            // ENAMDICT data for place and person names
            { name: 'enamdict.gz', encoding: 'EUC-JP', origin: 'http://ftp.monash.edu.au/pub/nihongo/enamdict.gz' },

            // EDICT data
            { name: 'edict.gz', encoding: 'EUC-JP', origin: 'http://ftp.monash.edu.au/pub/nihongo/edict.gz' },

            // Extended EDICT data
            { name: 'edict2.gz', encoding: 'EUC-JP', origin: 'http://ftp.monash.edu.au/pub/nihongo/edict2.gz' },

            // Kanji lookup data of radical
            { name: 'radkfile.gz', encoding: 'EUC-JP', origin: 'http://ftp.monash.edu.au/pub/nihongo/radkfile.gz' },

            // Radical lookup data of kanji
            { name: 'kradfile.gz', encoding: 'EUC-JP', origin: 'http://ftp.monash.edu.au/pub/nihongo/kradfile.gz' },

            // Example entries from the Tanaka corpus
            { name: 'examples.gz', encoding: 'EUC-JP', origin: 'http://ftp.monash.edu.au/pub/nihongo/examples.gz' },

            // Four-character idiom data
            { name: '4j324_sj.zip', origin: 'http://home.earthlink.net/~4jword/index3.htm', files: [
                { name:'4j324_sj.txt', encoding: 'Shift-JIS' }
            ]},

            // Kanji for use in names
            { name: 'JinmeiKanji.zip', origin: 'http://wakan.manga.cz/files/JinmeiKanji.zip', files: [
                { name:'NewJinmeiKanji.csv' },
                { name:'OldJinmeiKanji.csv' }
            ]},

            // JLPT 2, 3, and 4 vocabulary
            { name: 'JLPT_4_3_2.zip', origin: 'http://wakan.manga.cz/files/JLPT_4_3_2.zip', files: [
                { name:'JLPT2_vocab.csv' },
                { name:'JLPT3_vocab.csv' },
                { name:'JLPT4_vocab.csv' }
            ]},

            // Verb lists
            { name: 'VerbLists.zip', origin: 'http://wakan.manga.cz/files/VerbLists.zip', files: [
                { name:'EssentialVerbs.csv' },
                { name:'OtherVerbs.csv' },
                { name:'SuruVerbs.csv' }
            ]}

        ],

        // -- Helper functions --

        _dir = function _dir(absPath) {
            return __dirname + '/..' + absPath;
        },

        // -- Script functions --

        _extractGzip = function _extractGzip(_baseDir, _filename, _inEncoding, _outPath) {
            var _readStream = _fs.createReadStream(_baseDir + 'dl/' + _filename),
                _writeStream = _fs.createWriteStream(_outPath),
                _decompressStream = _zlib.createGunzip(),
                _encodeStream = _iconv.decodeStream(_inEncoding);

            _readStream
                .pipe(_decompressStream)
                .pipe(_encodeStream);

            _encodeStream
                .on('data', function _onEncode(data) { _writeStream.write(data.toString()); })
                .on('end', function _onEncodeEnd() { _writeStream.end(); });
        },

        _extractZip = function _extractZip(_baseDir, _filename, _getFiles) {
            var _readStream = _fs.createReadStream(_baseDir + 'dl/' + _filename),
                _writeStream,
                _decompressStream = _unzip.Parse(),
                _encodeStream;

            _readStream
                .pipe(_decompressStream)
                .on('entry', function _onExtractZip(entry) {
                    // Enumerate through extracted files

                    var _fileName = entry.path,
                        _fileEntry = _getFiles.filter(function _getRequiredFile(theFile) {
                            return theFile.name === _fileName;
                        }),
                        _isFound = _fileEntry.length > 0;

                    if(!_isFound) {
                        // File is not found, move on to next file
                        entry.autodrain();
                        return;
                    }

                    _fileEntry = _fileEntry[0];
                    _writeStream = _fs.createWriteStream(_path.normalize(_baseDir + 'extract/' + _fileName));

                    if(!_fileEntry.encoding) {
                        entry.pipe(_writeStream);
                        return;
                    }

                    _encodeStream = _iconv.decodeStream(_fileEntry.encoding);

                    entry.pipe(_encodeStream);

                    _encodeStream
                        .on('data', function _onEncode(data) { _writeStream.write(data.toString()); })
                        .on('end', function _onEncodeEnd() { _writeStream.end(); });
                });
        },

        // -- Main function --

        _extract = function _extract() {
            var _inputDir = _dir("/input/");

            console.log('Checking presence of raw data files...');
            console.log();

            _files.forEach(function _enumerateFiles(file) {
                var _inPath = _path.normalize(_inputDir + 'dl/' + file.name);

                _fs.stat(_inPath, function _onCheckFileExists(err) {
                    if(!!err) {
                        if(err.code !== 'ENOENT') {
                            throw err;
                        }
                        console.log('File [' + file.name + '] does not exist.');
                        console.log('Please re-download from: [' + file.origin + ']');
                        console.log();
                        return;
                    }

                    console.log('File [' + file.name + '] exists. Extracting data...');
                    console.log();

                    var
                        _filename = file.name,
                        _dotIndex = _filename.indexOf('.'),
                        _ext = _dotIndex > -1 ? file.name.slice(_dotIndex) : '',
                        _outFilename = _path.basename(file.name, _ext),
                        _outDir = _path.normalize(_inputDir + 'extract'),
                        _outPath = _outDir + '/' + _outFilename,
                        _inEncoding = file.encoding,
                        _doExtract = function _doExtract() {
                            switch(_ext) {
                                case '.gz':
                                    _extractGzip(_inputDir, _filename, _inEncoding, _outPath);
                                    break;
                                case '.zip':
                                    var _getFiles = file.files;
                                    _extractZip(_inputDir, _filename, _getFiles);
                                    break;
                            }
                        };

                    _fs.stat(_outDir, function _onCheckOutputDirExists(err2) {
                        if(!!err2) {
                            if(err2.code !== 'ENOENT') {
                                throw err2;
                            }

                            try {
                                _fs.mkdir(_outDir, function _onCreateDir(err3) {
                                    if (!!err3 && err3.code !== 'EEXIST') {
                                        throw err3;
                                    }

                                    _doExtract();
                                });
                            } catch(err3) {
                                _doExtract();
                                return;
                            }
                            return;
                        }

                        _doExtract();
                    });
                });
            });
        };

    _extract();

})(require, __dirname, console);
