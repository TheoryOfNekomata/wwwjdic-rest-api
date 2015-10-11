#!/usr/bin/env node
/*global module*/

(function prepare(module) {
    "use strict";

    var path = module.require('path'),
        _cb,
        _configData,

        _pending = [],

        _setFileDefEnd = function(filename) {
            var _index = _pending.indexOf(filename);

            _pending.splice(_index, 1);

            if(_pending.length < 1) {
                _cb();
            }
        },

        _getFileDefName = function(fileDef) {
            if(!!fileDef.name) {
                return fileDef.name;
            }
            return path.basename(fileDef.origin);
        },

        _setFileDefStart = function(fileDefName) {
            _pending.unshift(fileDefName);
        },

        _startPrepare = function() {
            _configData.sources.forEach(function _onIterateInputFiles(fileDef) {
                if(!fileDef.prepare) {
                    return;
                }

                var _fileDefName = _getFileDefName(fileDef);

                _setFileDefStart(_fileDefName);

                module.require('./prepare/' + fileDef.prepare)(fileDef, _configData, function() {
                    _setFileDefEnd(_fileDefName);
                });
            });
        };

    module.exports = function _prepare(cli, configData, cb) {
        _configData = configData;
        _cb = cb;

        _startPrepare();
    };

})(module);