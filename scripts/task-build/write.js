#!/usr/bin/env node
/*global module*/

(function write(module) {
    "use strict";

    var _getWriter = function(cli) {
        switch(cli.format) {
            case 'json':
            case 'xml':
            case 'csv':
                return 'archive/' + cli.format;
            case 'sql':
                return 'script/' + cli.format;
            case 'db-sqlite':
            case 'db-nosql':
                return 'database/' + cli.format.slice(cli.format.indexOf('-') + 1);
        }
        return 'archive/json';
    };

    module.exports = function _write(dataset, cli, configData, cb) {
        return module.require('./write/' + _getWriter(cli))(dataset, cli, configData, cb);
    };

})(module);
