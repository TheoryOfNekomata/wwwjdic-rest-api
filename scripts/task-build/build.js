#!/usr/bin/env node
/*global module*/

(function build(module) {
    "use strict";

    module.exports = function _build(cli, data) {
        var onFinish = function onFinish() {
            console.log('');
            console.log('  Task [build] done.');
            console.log('');
        };

        console.log('');
        console.log('  Building datasets...');
        console.log('');
        return module.require('./init')(cli, data, onFinish);
    };

})(module);