#!/usr/bin/env node
/*global module*/

(function update(module) {
    "use strict";

    var
        _onFinish = function _onFinish() {
            console.log('');
            console.log('  Task [update] done.');
            console.log('');
        },

        _prepare = function _prepare(cli, data) {
            _doPrepare(cli, data, _onFinish);
        },

        _doPrepare = function _doPrepare(cli, data, cb) {
            console.log('');
            console.log('  Preparing datasets...');
            console.log('');
            module.require('./prepare')(cli, data, cb);
        },

        _download = function _download(cli, data, cb) {
            console.log('');
            console.log('  Retrieving sources...');
            console.log('');
            return module.require('./download')(cli, data, cb);
        };

    module.exports = function _update(cli, data) {
        if(cli.download) {
            return _download(cli, data, _prepare);
        }

        _prepare(cli, data);
    };

})(module);