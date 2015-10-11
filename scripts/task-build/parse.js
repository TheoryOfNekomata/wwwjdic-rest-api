#!/usr/bin/env node
/*global module*/

(function parse(module) {
    "use strict";

    var
        _ = module.require('lodash'),
        fs = module.require('fs'),
        Transform = module.require('stream').Transform;

    module.exports = function _parse(dataset, cli, configData, additional) {
        return new Transform({
            readableObjectMode: true,
            transform: function(chunk, enc, cb) {
                var _parsed = module.require('./parse/' + dataset.parser)
                    (chunk.toString().trim());

                _parsed.data.dataset = dataset.name;

                if(!!dataset.category && _parsed.type === 'entry') {
                    _parsed.data.category = dataset.category;
                }

                if(!!additional && dataset.group === 'kanji') {
                    _parsed.data.radical.components = additional
                        .filter(function(item) {
                            return item.type === 'entry';
                        })
                        .filter(function(item) {
                            return item.kanji === _parsed.data.kanji;
                        })[0]
                        .radicals;
                }

                cb(null, _parsed);
            }
        });
    };

})(module);