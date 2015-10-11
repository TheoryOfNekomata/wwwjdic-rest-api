#!/usr/bin/env node
/*global module*/

(function download(module) {
    "use strict";

    var httpRequest = module.require('http-request'),
        iconv = module.require('iconv-lite'),
        fs = module.require('fs'),
        path = module.require('path'),
        numeral = module.require('numeral'),
        ProgressBar = module.require('progress'),

        _cli,
        _configData,
        _cb,

        _file = {},
        _length = 0,
        _total = {},
        _bar,

        _getFileDefName = function _getFileDefName(sourceDef) {
            return sourceDef.name || path.basename(sourceDef.origin);
        },

        _setProgress = function _setProgress(label, current, total) {
            _file[label] = {
                progress: current,
                total: total
            };
        },

        _calculateTotal = function _calculateTotal() {
            _length = 0;
            _total.progress = 0;
            _total.total = 0;

            Object.keys(_file)
                .forEach(function(label) {
                    _length++;
                    _total.progress += _file[label].progress;
                    _total.total += _file[label].total;
                });
        },

        _updateProgressBar = function _updateProgressBar() {
            if(!_bar) {
                _bar = new ProgressBar('    :bar :percent (:csize of :tsize)', {
                    complete: '█',
                    incomplete: '░',
                    width: 24,
                    total: _total.total
                });
            }

            _bar.update(_total.progress / _total.total, {
                csize: numeral(_total.progress).format('0.0b'),
                tsize: numeral(_total.total).format('0.0b')
            });
        },

        _isAllFilesStarted = function _isAllFilesStarted() {
            return (_length === _configData.sources.length);
        },

        _isFinished = function _isFinished() {
            return (_total.progress === _total.total);
        },

        _onFinishDownload = function _onFinishDownload() {
            _bar.terminate();
            console.log('  Sources retrieved successfully.');
            _cb(_cli, _configData);
        },

        _doWriteFile = function(sourceDef, pipe) {
            var _filename = './input/' + _getFileDefName(sourceDef);

            if(!!sourceDef.encoding) {
                pipe = pipe
                    .pipe(iconv.decodeStream(sourceDef.encoding))
                    .pipe(iconv.encodeStream(_configData.destEncoding));
            }

            pipe
                .pipe(fs.createWriteStream(_filename));
        },

        _onIterateInputFiles = function _onIterateInputFiles(sourceDef, index) {
            var _onProgress = function _onProgress(current, total) {
                _setProgress(index, current, total);
                _calculateTotal();

                if(!_isAllFilesStarted()) {
                    return;
                }

                _updateProgressBar();

                if(!_isFinished()) {
                    return;
                }

                _onFinishDownload();
            };

            httpRequest.get({
                url: sourceDef.origin,
                stream: true,
                progress: _onProgress
            }, null, function(err, res) {
                if(!!err) {
                    switch(err.code) {
                        case 'EAI_AGAIN': break;
                        default: _cb(err);
                    }
                }

                _doWriteFile(sourceDef, res.stream);
            });
        },

        _doDownload = function _doDownload() {
            _configData.sources.forEach(_onIterateInputFiles);
        };

    module.exports = function _download(cli, configData, cb) {
        _cli = cli;
        _configData = configData;
        _cb = cb;

        _doDownload();
    };

})(module);