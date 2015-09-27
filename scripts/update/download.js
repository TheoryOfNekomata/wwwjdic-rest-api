/*global module, require*/

(function download(module, require) {
    "use strict";

    var
        // -- Node dependencies --

        _utils = require('./../utils'),
        _httpRequest = require('http-request'),
        _iconv = require('iconv-lite'),
        _fs = require('fs'),
        _path = require('path'),

        // -- Script functions --

        _retrieveSources = function _retrieveSources(configData, cb) {
            var _file = {},
                _length = 0,
                _total = {},
                _lastPercent = -1,
                _currPercent,
                _onFinish = function(cb) {
                    _utils.detachCharm();
                    _utils.print();
                    _utils.print('Sources retrieved.');
                    cb();
                };

            _utils.attachCharm();

            configData.sources.forEach(function _onIterateInputFiles(sourceDef) {
                var _fileDefName = !!sourceDef.name ? sourceDef.name  : _path.basename(sourceDef.origin);

                _httpRequest.get({
                    url: sourceDef.origin,
                    stream: true,
                    progress: function _onProgress(current, total) {
                        _length = 0;
                        _total.progress = 0;
                        _total.total = 0;

                        _file[_fileDefName] = {
                            progress: current,
                            total: total
                        };

                        for(var _name in _file) {
                            if(_file.hasOwnProperty(_name)) {
                                _length++;
                                _total.progress += _file[_name].progress;
                                _total.total += _file[_name].total;
                            }
                        }

                        if(_length === configData.sources.length) {
                            _currPercent = _total.progress / _total.total;

                            if(_lastPercent !== _currPercent) {
                                _utils.print(
                                    _utils.toPercent(_currPercent) + ' (' +
                                    _utils.toSize(_total.progress) + ' of ' + _utils.toSize(_total.total) +
                                    ') downloaded.     ',

                                    true
                                );
                                _lastPercent = _currPercent;
                            }

                            if(_total.progress === _total.total) {
                                _onFinish(cb);
                            }
                        }
                    }
                }, null, function(err, res) {
                    if(!!err) {
                        switch(err.code) {
                            case 'EAI_AGAIN': break;
                            default: throw err;
                        }
                    }

                    var _filename = _utils.dir('/input/' + _fileDefName),
                        _writeStream = _fs.createWriteStream(_filename),
                        _pipeStream = res.stream;

                    if(!!sourceDef.encoding) {
                        _pipeStream = _pipeStream
                            .pipe(_iconv.decodeStream(sourceDef.encoding))
                            .pipe(_iconv.encodeStream(configData.destEncoding));
                    }

                    _pipeStream
                        .pipe(_writeStream);
                });
            });
        };

    module.exports = function _download(options, cb) {
        _utils.print('Retrieving sources...');

        _retrieveSources(options, cb);
    };

})(module, require);
