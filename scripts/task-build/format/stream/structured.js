#!/usr/bin/env node
/*global module*/

(function structured(module) {
    "use strict";

    var fs = module.require('fs'),
        streamStream = module.require('stream-stream'),
        Writable = module.require('stream').Writable,
        duplexer = module.require('duplexer'),
        _format,

        _dataset,
        _cli,
        _configData,

        _streams = {
            info: null,
            entry: null
        },
        _stream,

        _init = function() {
            _format = module.require('./../type/' + _cli.format.replace(/[-]/g, '/'))(_dataset, _cli, _configData);

            _streams.info = streamStream({ separator: _format.separator.info });
            _streams.entry = streamStream({ separator: _format.separator.entry });
            _stream = streamStream({ separator: _format.separator.infoEntry });
        };

    module.exports = function(dataset, cli, configData, cb) {
        _dataset = dataset;
        _cli = cli;
        _configData = configData;

        _init();

        var _writable = new Writable({
            objectMode: true,
            write: function(chunk, enc, cb) {
                _streams[chunk.type].write(
                    _format.formatData(chunk)
                );
            }
        });

        _writable.on('finish', function() {
            _streams.info.end();
            _streams.entry.end();

            // TODO format!!!!
            _stream.write(_format.header);
            _stream.write(_streams.info);
            _stream.write(_streams.entry);
            _stream.end();
        });

        return duplexer(_writable, _stream);
    };

})(module);
