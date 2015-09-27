/*global require,process*/

(function build(require, process) {
    "use strict";

    var _utils = require('./utils'),
        _async = require('async'),

        _subtasks = {
            read: require('./build/read')
        },

        _makeOptions = function _makeOptions(args, configData) {
            var _acceptedFormats = [
                    'json',
                    'db-sqlite',
                    'db-nosql',
                    'sql',
                    'xml'
                ],
                _options = configData;

            _options.output = (!args || !args[0] || _acceptedFormats.indexOf(args[0]) === -1) ? 'json' : args[0];

            return _options;
        },

        _build = function _build(args) {
            _utils.print('Building datasets. This may take a while...');

            _utils.readJson('config.json', function _onReadConfig(err, configData) {
                if(!!err) {
                    throw err;
                }

                var _options = _makeOptions(args, configData),
                    _runQueue = [];

                configData.datasets.forEach(function _onIterateDatasets(datasetDef) {
                    _runQueue.push(function _build_read(cb) {
                        _subtasks.read(datasetDef, _options, cb);
                    });
                });

                _async.series(_runQueue, function(err, results) {
                });
            });

            // TODO needs to be faster!!!!
        };

    _build(process.argv.slice(2));

})(require, process);
