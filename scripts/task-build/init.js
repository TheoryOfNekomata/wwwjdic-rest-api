#!/usr/bin/env node
/*global module*/

(function init(module) {
    "use strict";

    var fs = module.require('fs'),
        numeral = module.require('numeral'),
        ProgressBar = module.require('progress'),

        _datasets = [],
        _pending = [],

        _loadingThread = null,
        _loading = 0,
        _loadingLength = 3,
        _bar,
        _cli,
        _configData,
        _cb,
        _parseCount,
        _currGroup,
        _additional = {},
        _writeStream,

        _sortDatasets = function() {
            _configData.datasets.forEach(function _onIterateDatasets(dataset) {
                for(var i = 0; i < _configData.groupPriorities.length; i++) {
                    if(_configData.groupPriorities[i].indexOf(dataset.group) !== -1) {
                        return (_datasets[i] = _datasets[i] || []).push(dataset);
                    }
                }
            });
        },

        _setDatasetBegin = function(dataset) {
            _pending.unshift(dataset.name);
        },

        _setDatasetEnd = function(filename, cb) {
            var _index = _pending.indexOf(filename);

            _pending.splice(_index, 1);

            if(_pending.length < 1) {
                _loading = _loadingLength - 1;
                _updateParsedCount();

                _parseCount = 0;
                if(!!_bar) {
                    _bar.terminate();
                    _bar = null;
                }
                if(!!_loadingThread) {
                    clearInterval(_loadingThread);
                    _loadingThread = null;
                }

                cb();
            }
        },

        _getCallback = function() {
            if(_datasets.length > 0) {
                return function() { _startBuild(); };
            }

            return _cb;
        },

        _layoutPipeline = function(dataset) {
            var _onFinish = function() {
                    _setDatasetEnd(dataset.name, _getCallback());
                },

                _pipeLine,
                _readStream = module.require('./read')(dataset, _cli, _configData),
                _parseStream = module.require('./parse')(dataset, _cli, _configData, _additional[_currGroup]);

            _currGroup = dataset.group;

            _parseStream.on('data', function(data) {
                if(!_bar) {
                    _bar = new ProgressBar('    :group  Parsed :parsed entries.:bar   ', {
                        total: _loadingLength,
                        width: _loadingLength,
                        complete: '.',
                        incomplete: ' '
                    });
                }

                if(!_loadingThread) {
                    _loadingThread = setInterval(function() {
                        _updateParsedCount();
                    }, 50);
                }

                if(_currGroup === 'radicals') {
                    _additional.kanji = _additional.kanji || [];
                    _additional.kanji.push(data);
                }

                ++_parseCount;
            });

            _pipeLine = _readStream.pipe(_parseStream);

            if(dataset.group === 'radicals') {
                return;
            }

            var _formatStream = module.require('./format')(dataset, _cli, _configData),
                _writeStream = module.require('./write')(dataset, _cli, _configData);

            _pipeLine
                .pipe(_formatStream)
                .pipe(_writeStream);
        },

        _updateParsedCount = function() {
            if(!_bar) {
                return;
            }

            var _groupDisp = _currGroup.slice(0, 10) + ':';

            for(var i = _groupDisp.length; i < 11; i++) {
                _groupDisp = ' ' + _groupDisp;
            }

            _loading = (_loading + 1) % (_loadingLength * 8);
            _bar.update(_loading / (_loadingLength * 8), {
                group: _groupDisp,
                parsed: numeral(_parseCount).format('0,0')
            });
        },

        _startBuild = function() {
            var _currDatasets = [];

            while(_currDatasets.length < 1) {
                _currDatasets = _datasets.shift() || [];
            }

            _parseCount = 0;
            _bar = null;
            _loadingThread = null;

            _currDatasets.forEach(function _onIterateDatasets(dataset) {
                _setDatasetBegin(dataset);
                _layoutPipeline(dataset);
            });
        };

    module.exports = function _init(cli, configData, cb) {
        _cli = cli;
        _configData = configData;
        _cb = cb;

        _sortDatasets();
        _startBuild();
    };

})(module);
