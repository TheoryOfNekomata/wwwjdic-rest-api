#!/usr/bin/env node
/*global module,process,__filename*/

(function task(module, process, __filename) {
    "use strict";

    // Load dependencies

    var
        cli = module.require('commander'),

        JSONStream = module.require('JSONStream'),

        fs = module.require('fs'),

        // Read package.json for correct version information

        args = process.argv,

        _readPackageStream = JSONStream.parse('version');

    console.log('');
    console.log('  Welcome to wwwjdic-rest-api console!');
    console.log('  ------------------------------------');
    console.log('');

    _readPackageStream.on('data', function(version) {

        // Override current working directory so that `npm run` works as
        // intended
        args[1] = __filename;

        cli
            .version(version)
            .command('update',         'update and prepare datasets'   )
            .command('build [format]', 'build datasets to data formats')
            .parse(args);
    });

    fs.createReadStream('./package.json')
        .pipe(_readPackageStream);

})(module, process, __filename);
