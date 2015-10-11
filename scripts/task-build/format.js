#!/usr/bin/env node
/*global module*/

(function format(module) {
    "use strict";

    var _getStream = function(format) {
        switch(format) {
            case 'json':
            case 'xml':
                return 'structured';
        }

        return 'passthrough';
    };

    module.exports = function _format(dataset, cli, configData, cb) {
        return module.require('./format/stream/' + _getStream(cli.format))(dataset, cli, configData, cb);
    };

})(module);
