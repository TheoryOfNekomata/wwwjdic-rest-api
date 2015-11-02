#!/usr/bin/env node
/*global module*/

(function read(module) {
    "use strict";

    var _getReader = function(dataset) {
        switch(dataset.reader) {
            case 'edict':
            case 'krad':
            case 'kanjidic':
            case 'tanakacorpus':
                return 'row';
        }
        return 'row'; // default
    };

    module.exports = function _read(dataset, cli, configData, cb) {
        return module.require('./read/' + _getReader(dataset))(dataset, cli, configData, cb);
    };

})(module);
