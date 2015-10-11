#!/usr/bin/env node
/*global module*/

(function structured(module) {
    "use strict";

    var PassThrough = module.require('stream').PassThrough;

    module.exports = function(dataset, cli, configData, cb) {
        return new PassThrough();
    };

})(module);
