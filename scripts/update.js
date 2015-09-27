/*global require,process*/

(function update(require, process) {
    "use strict";

    var _async = require('async'),

        _utils = require('./utils'),

        _subtasks = {
            download: require('./update/download'),
            prepare: require('./update/prepare')
        },

        _makeOptions = function(args, configData) {
            var _options = configData;
            _options.download = false;

            if(!args) {
                return _options;
            }

            _options.download = args.indexOf('-D') > -1 || args.indexOf('--download') > -1;

            return _options;
        },

        _update = function(args) {
            var _options,
                _runQueue = [];

            _utils.readJson('config.json', function _onReadConfig(err, configData) {
                if(!!err) {
                    throw err;
                }

                _options = _makeOptions(args, configData);

                if(_options.download) {
                    _runQueue.push(function _update_download(cb) {
                        _subtasks.download(_options, cb);
                    });
                }

                _runQueue.push(function _update_prepare(cb) {
                    _subtasks.prepare(_options, cb);
                });

                _async.series(_runQueue);
            });
        };

    _update(process.argv.slice(2));

})(require, process);