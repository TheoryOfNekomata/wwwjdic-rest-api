/*global module,require,console,process,__dirname*/

(function utils(module, require, console, process, __dirname) {
    "use strict";

    var _path = require('path'),
        _fs = require('fs'),
        _numeral = require('numeral'),
        _moment = require('moment'),
        _charm,
        _dir = function _dir(path) {
            return _path.normalize(__dirname + '/..' + (path.indexOf('/') !== 0 ? '/' : '') + path);
        },

        _readJson = function _readJson(path, cb) {
            _fs.readFile(_dir(path), function(err, data) {
                cb(err, JSON.parse(data));
            });
        },

        _print = function _print(args, isSticky) {
            if(isSticky) {
                _charm.push();
            }

            console.log(!!args ? args : '');

            if(isSticky) {
                _charm.pop();
            }
        },

        _toSize = function(bytes) {
            return _numeral(bytes).format('0.0 b');
        },

        _toPercent = function(fraction) {
            return _numeral(fraction).format('0%');
        },

        _attachCharm = function _attachCharm() {
            _charm = require('charm')(process);
        },

        _detachCharm = function _detachCharm() {
            _charm.destroy();
        },

        _getDateNow = function _getDateNow() {
            return _moment(new Date()).format('YYYY-MM-DD');
        };

    module.exports = {
        dir: _dir,
        readJson: _readJson,
        attachCharm: _attachCharm,
        detachCharm: _detachCharm,
        print: _print,
        toSize: _toSize,
        toPercent: _toPercent,
        getDateNow: _getDateNow
    };

})(module, require, console, process, __dirname);
