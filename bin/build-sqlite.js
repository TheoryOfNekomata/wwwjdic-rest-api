/*global require,__dirname,console*/

(function build(require, __dirname, console) {
    "use strict";

    var
        // -- Node dependencies --

        _sql = require('sqlite3').verbose(),
        _fs = require('fs'),

        // -- Script locals --

        _db = null,

        // -- Helper functions --

        _dir = function _dir(absPath) {
            return __dirname + '/..' + absPath;
        },

        // -- Script functions --
        _initDatabase = function() {
            _db = new _sql.Database(_dir('/database/main.sqlite'));

            _db.serialize(function _initDatabaseElems() {
                _db.run([
                    'CREATE TABLE kanji (',
                    [
                        'id INTEGER NOT NULL',
                        'kanji CHARACTER NOT NULL',
                        'jlptLevel INTEGER',
                        'jouyouGrade INTEGER',
                        'strokes INTEGER NOT NULL',
                        'bushuRadical INTEGER NOT NULL',
                        'classicalRadical INTEGER',
                        'frequency INTEGER',
                        'shiftJis VARCHAR(6)',
                        'indexDA VARCHAR(15)',
                        'indexDB VARCHAR(15)',
                        'indexDC VARCHAR(15)',
                        'indexDF VARCHAR(15)',
                        'indexDG VARCHAR(15)',
                        'indexDH VARCHAR(15)',
                        'indexDJ VARCHAR(15)',
                        'indexDK VARCHAR(15)',
                        'indexDL VARCHAR(15)',
                        'indexDM VARCHAR(15)',
                        'indexDN VARCHAR(15)',
                        'indexDO VARCHAR(15)',
                        'indexDP VARCHAR(15)',
                        'indexDR VARCHAR(15)',
                        'indexDS VARCHAR(15)',
                        'indexDT VARCHAR(15)',
                        'indexIN VARCHAR(15)',
                        'indexMN VARCHAR(15)',
                        'indexMP VARCHAR(15)',
                        'PRIMARY KEY (id)'
                    ].join(', '),
                    ')'
                ].join(' '));
            });

            _db.close();
        },

        // -- Main function --

        _build = function _build() {
            var _databaseDir = _dir('/database');

            var _databaseFile = _databaseDir + '/main.sqlite';

            _fs.stat(_databaseFile, function _onCheckDbExists(err) {
                if (!!err) {
                    if(err.code !== 'ENOENT') {
                        throw err;
                    }
                    _fs.mkdir(_databaseDir, function _onCreateDir(err2) {
                        if(!!err2) {
                            throw err2;
                        }

                        _initDatabase();
                    });
                    return;
                }

                _initDatabase();
            });
        };

    _build();

})(require, __dirname, console);
