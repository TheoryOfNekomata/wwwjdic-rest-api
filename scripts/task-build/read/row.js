#!/usr/bin/env node
/*global module*/

(function row(module) {
    "use strict";

    var byline = module.require('byline'),
        fs = module.require('fs');

    module.exports = function _row(dataset, cli, configData, cb) {
        return byline(
            fs.createReadStream(
                './input/' + dataset.name,
                { encoding: configData.destEncoding }
            )
        );
    };

})(module);