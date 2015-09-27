/*global require,__dirname,console,process*/

(function build(require, __dirname, console, process) {
    "use strict";

    var
        // -- Node dependencies --

        _sql = require('sqlite3').verbose(),
        _fs = require('fs'),

        // -- Script locals --

        _engine = {
            type: 'firebase',
            params: {
                auth: {

                }
            }
        },

        _input = [
            //{ name: '4j324_sj.txt', reader: 'yojijukugo' },
            //{ name: 'edict', reader: 'edict' },
            //{ name: 'edict2', reader: 'edict' },
            //{ name: 'enamdict', reader: 'edict' },
            //{ name: 'EssentialVerbs', reader: 'wakanCsv' },
            //{ name: 'examples', reader: 'tanakaCorpus' },
            //{ name: 'JLPT2_vocab', reader: 'wakanCsv' },
            //{ name: 'JLPT3_vocab', reader: 'wakanCsv' },
            //{ name: 'JLPT4_vocab', reader: 'wakanCsv' },
            //{ name: 'kanjd212', reader: 'kanjidic' },
            //{ name: 'kanjd213u', reader: 'kanjidic' },
            //{ name: 'kanjidic', reader: 'kanjidic' },
            { name: 'kradfile', reader: 'krad' },
            //{ name: 'NewJinmeiKanji.csv', reader: 'wakanCsv' },
            //{ name: 'OldJinmeiKanji.csv', reader: 'wakanCsv' },
            //{ name: 'OtherVerbs.csv', reader: 'wakanCsv' },
            //{ name: 'radkfile', reader: 'radk' },
            //{ name: 'SuruVerbs.csv', reader: 'wakanCsv' }
        ],

        _reader = require('./build/reader'),

        // -- Helper functions --

        _dir = function _dir(absPath) {
            return __dirname + '/..' + absPath;
        },

        // -- Script functions --



        // -- Main function --

        _build = function _build() {
            _input.forEach(function _onEnumerateInputFiles(input) {
                try {
                    var _inputPath = _dir('/input/extract/' + input.name),
                        _data = {};

                    _reader(
                        _inputPath,
                        input.reader,
                        function _onReadInputFile(data) {
                            _data[input.name] = data;

                            console.log(data.entries);
                        }
                    );
                } catch(e) {

                }
            });

            // TODO: npm run build [ { json | sqlite | text } ]

            //console.log(process.argv.slice(2));
        };

    _build();

})(require, __dirname, console, process);
