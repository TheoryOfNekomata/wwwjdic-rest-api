#!/usr/bin/env node
/*global module,process,__filename*/

(function task(module, process, __filename) {
    "use strict";

    var cli = module.require('commander'),
        JSONStream = module.require('JSONStream'),
        fs = module.require('fs'),
        _readPackageStream = JSONStream.parse('version'),
        args = process.argv;

    _readPackageStream.on('data', function(version) {
        args[1] = __filename;

        cli
            .version(version)
            .command('update', 'update and prepare datasets')
            .command('build [format]', 'build datasets to data formats')
            .parse(args);
    });

    fs.createReadStream('./package.json')
        .pipe(_readPackageStream);

})(module, process, __filename);
