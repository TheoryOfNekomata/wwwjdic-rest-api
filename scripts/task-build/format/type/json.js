#!/usr/bin/env node
/*global module*/

(function json(module, process) {
    "use strict";

    module.exports = function _json(dataset, cli, configData) {
        return {
            header: '{"dataset":{"info":',
            footer: ']}}',
            separator: {
                info: '\\\r\\\n',
                entry: ',',
                infoEntry: ',"entries":['
            },
            formatData: function(chunk) {
                return JSON.stringify(chunk);
            }
        };
    };

})(module);

