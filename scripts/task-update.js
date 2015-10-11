#!/usr/bin/env node
/*global module,process*/

(function taskUpdate(module, process) {
    "use strict";

    var cli = module.require('commander'),
        JSONStream = module.require('JSONStream'),
        fs = module.require('fs'),

        _readPackageStream = JSONStream.parse('version'),
        _readConfigStream = JSONStream.parse('config');

    _readPackageStream.on('data', function(version) {
        cli
            .version(version)
            .option('-D, --download', 'download all the datasets')
            .parse(process.argv);

        fs.createReadStream('./config.json')
            .pipe(_readConfigStream);

        _readConfigStream.on('data', function(config) {
            module.require('./task-update/update')(cli, config);
        });
    });

    fs.createReadStream('./package.json')
        .pipe(_readPackageStream);

})(module, process);
