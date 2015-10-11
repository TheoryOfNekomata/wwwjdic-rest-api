#!/usr/bin/env node
/*global module,process,__filename*/

(function task(module, process, __filename) {
    "use strict";

    var cli = module.require('commander'),
        args = process.argv;

    args[1] = __filename;

    cli
        .version('0.0.0')
        .command('update', 'update and prepare datasets')
        .command('build [format]', 'build datasets to data formats')
        .parse(args);

})(module, process, __filename);
