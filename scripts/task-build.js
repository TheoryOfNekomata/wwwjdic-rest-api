#!/usr/bin/env node
/*global module,process*/

(function taskBuild(module, process) {
    "use strict";

    var cli = module.require('commander'),
        JSONStream = module.require('JSONStream'),
        fs = module.require('fs'),

        _readPackageStream = JSONStream.parse('version'),
        _readConfigStream = JSONStream.parse('config');

    _readPackageStream.on('data', function(version) {
        cli
            .version(version)
            .usage('[format]')
            //.option('[format]', 'any of: json, xml, csv, sql, db-sqlite, db-nosql', , 'json')
            .option('-p, --pretty', 'pretty prints the output (JSON, XML, and CSV)')
            ['arguments']('[format]')
            .action(function(format) {
                var _acceptedFormats = [
                    "json",
                    "xml",
                    "csv",
                    "sql",
                    "db-sqlite",
                    "db-nosql"
                ];

                if(_acceptedFormats.indexOf(format) === -1) {
                    console.log('');
                    console.log('  Invalid format.');
                    console.log('');

                    cli.help();
                }

                cli.format = format;
            });

        cli
            .parse(process.argv);

        if(!cli.format) {
            cli.format = 'json';
        }

        fs.createReadStream('./config.json')
            .pipe(_readConfigStream);

        _readConfigStream.on('data', function(config) {
            module.require('./task-build/build')(cli, config);
        });
    });

    fs.createReadStream('./package.json')
        .pipe(_readPackageStream);

})(module, process);
