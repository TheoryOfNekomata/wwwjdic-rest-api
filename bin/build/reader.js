/*global module,require*/

(function (module, require) {
    'use strict';

    var fs = require('fs');
    var baseDir = './';
    var inputDir = baseDir + '/input';

    var encoding = 'utf8';

    var readKanjidic = function(path) {
        var readRow = function(rawFileRows) {
            var appendData,
                attr,
                chunks,
                classification,
                dataChunk,
                getClassification,
                hasOkurigana,
                i,
                j,
                kunData,
                nanori,
                parsedData,
                periodIndex,
                prefix,
                ref;

            chunks = rawFileRows.split(' ');
            parsedData = {};

            getClassification = function(rawData) {
                var attr, prefix, prefixes;
                if (rawData.indexOf('-') === 0) {
                    rawData = rawData.substr(1);
                }
                if (rawData.charCodeAt(0) >= 0x3041 && rawData.charCodeAt(0) <= 0x309F) {
                    return ['', 'kun'];
                }
                if (rawData.charCodeAt(0) >= 0x30A1 && rawData.charCodeAt(0) <= 0x30FF) {
                    return ['', 'on'];
                }
                if (rawData.charCodeAt(0) >= 0x4E00 && rawData.charCodeAt(0) <= 0x9FFF) {
                    return ['', 'kanji'];
                }
                if (rawData.charCodeAt(0) >= 0x30 && rawData.charCodeAt(0) <= 0x39) {
                    return ['', 'shiftJis'];
                }

                var indexHelp = {
                    'V': 'the index number in The New Nelson Japanese-English Character Dictionary, edited by John Haig.',
                    'H': 'the index number in the New Japanese-English Character Dictionary (1990), edited by Jack Halpern. At most one allowed per line. If not preset, the character is not in Halpern.',
                    'N': 'the index number in the "Modern Reader\'s Japanese-English Character Dictionary", edited by Andrew Nelson.',
                    'DA': 'the index numbers used in the 2011 edition of the Kanji & Kana book, by Spahn & Hadamitzky.',
                    'DB': 'the index numbers used in "Japanese For Busy People" vols I-III, published by the AJLT.', // DB<vol>.<chapter>
                    'DC': 'the index numbers used in "The Kanji Way to Japanese Language Power" by Dale Crowley.',
                    'DF': 'the index numbers used in the "Japanese Kanji Flashcards", by Max Hodges and Tomoko Okazaki (White Rabbit Press).',
                    'DG': 'the index numbers used in the "Kodansha Compact Kanji Guide".',
                    'DH': 'the index numbers used in the 3rd edition of "A Guide To Reading and Writing Japanese" edited by Ken Hensall et al.',
                    'DJ': 'the index numbers used in the "Kanji in Context" by Nishiguchi and Kono.',
                    'DK': 'the index numbers used by Jack Halpern in his Kanji Learners Dictionary, published by Kodansha in 1999.',
                    'DL': 'the index numbers used by Jack Halpern in his Kanji Learners Dictionary, 2013 second edition.',
                    'DM': 'the numbers in Yves Maniette\'s French adapatation of Heisig\'s "Remembering The Kanji".',
                    'DN': 'the index number used in "Remembering The Kanji, 6th Edition" by James Heisig.',
                    'DO': 'the index numbers used in P.G. O\'Neill\'s Essential Kanji',
                    'DP': 'the index numbers used by Jack Halpern in his Kodansha Kanji Dictionary (2013), which is the revised version of the "New Japanese-English Kanji Dictionary" of 1990.',
                    'DR': 'these are the codes developed by Father Joseph De Roo, and published in his book "2001 Kanji" (Bonjinsha).',
                    'DS': 'the index numbers used in the early editions of "A Guide To Reading and Writing Japanese" edited by Florence Sakade.',
                    'DT': 'the index numbers used in the Tuttle Kanji Cards, compiled by Alexander Kask.',
                    'I': 'the index codes in the reference books by Spahn & Hadamitzky for The Kanji Dictionary (Tuttle 1996).',
                    'IN': 'the index codes in the reference books by Spahn & Hadamitzky for the Kanji & Kana book (Tuttle) (2nd edition).',
                    'E': 'the index number used in "A Guide To Remembering Japanese Characters" by Kenneth G. Henshall.',
                    'K': 'the index number in the Gakken Kanji Dictionary ("A New Dictionary of Kanji Usage").',
                    'L': 'the index number used in "Remembering The Kanji" by James Heisig.',
                    'O': 'the index number in "Japanese Names", by P.G. O\'Neill. (Weatherhill, 1972)',
                    'Q': 'the "Four Corner" code for that kanji.',
                    'MN': 'the index number of the kanji in the 13-volume Morohashi Daikanwajiten.',
                    'MP': 'the volume.page of the kanji in the 13-volume Morohashi Daikanwajiten.'
                };

                prefixes = {
                    'B': 'bushu',
                    'C': 'classical',
                    'F': 'frequency',
                    'G': 'jouyou',
                    'J': 'jlpt',
                    'U': 'unicode',
                    'DA': 'indexDA',
                    'DB': 'indexDB',
                    'DC': 'indexDC',
                    'DF': 'indexDF',
                    'DG': 'indexDG',
                    'DH': 'indexDH',
                    'DJ': 'indexDJ',
                    'DK': 'indexDK',
                    'DL': 'indexDL',
                    'DM': 'indexDM',
                    'DN': 'indexDN',
                    'DO': 'indexDO',
                    'DP': 'indexDP',
                    'DR': 'indexDR',
                    'DS': 'indexDS',
                    'DT': 'indexDT',
                    'IN': 'indexIN',
                    'MN': 'indexMN',
                    'MP': 'indexMP',
                    'I': 'indexI',
                    'O': 'indexO',
                    'Q': 'indexQ',
                    'H': 'indexH',
                    'K': 'indexK',
                    'L': 'indexL',
                    'E': 'indexE',
                    'N': 'indexN',
                    'V': 'indexV',
                    'P': 'skipCode',
                    'S': 'strokes',
                    'Y': 'pinyin',
                    'T': 'nanori',
                    '{': 'meaning',
                    'W': 'korean',
                    'X': 'crossRef',
                    'ZPP': 'misclassificationPosition',
                    'ZSP': 'misclassificationStrokes',
                    'ZRP': 'misclassificationStrokes2',
                    'ZBP': 'misclassificationBoth'
                };
                for (prefix in prefixes) {
                    if(prefixes.hasOwnProperty(prefix)) {
                        attr = prefixes[prefix];
                        if (rawData.indexOf(prefix) === 0) {
                            return [prefix, attr];
                        }
                    }
                }
                return ['', 'unknown'];
            };
            appendData = function (attr, value) {
                var multipleAttrs = [
                    'on', 'kun', 'nanori', 'meaning', 'korean', 'pinyin', 'crossRef'
                ];

                var attrClasses = {
                    'radicals': ['bushu', 'classical'],
                    'readings': ['on', 'kun', 'nanori', 'korean', 'pinyin'],
                    'grades': ['jlpt', 'jouyou']
                };

                var theClass;

                for(var attrClass in attrClasses) {
                    if(attrClasses.hasOwnProperty(attrClass)) {
                        if(attrClasses[attrClass].indexOf(attr) !== -1) {
                            theClass = attrClass;
                        }
                    }
                }

                if(attr.indexOf('index') === 0) {
                    theClass = 'indices';
                }

                if (attr !== 'kanji') {
                    if(!parsedData.data) {
                        parsedData.data = {};
                    }

                    if (!!theClass) {
                        if (!parsedData.data[theClass]) {
                            parsedData.data[theClass] = {};
                        }

                        if (multipleAttrs.indexOf(attr) === -1) {
                            parsedData.data[theClass][attr] = value;
                        } else {
                            if (!parsedData.data[theClass][attr]) {
                                parsedData.data[theClass][attr] = [value];
                            } else {
                                parsedData.data[theClass][attr].push(value);
                            }
                        }
                    } else {
                        if (multipleAttrs.indexOf(attr) === -1) {
                            parsedData.data[attr] = value;
                        } else {
                            if (!parsedData.data[attr]) {
                                parsedData.data[attr] = [value];
                            } else {
                                parsedData.data[attr].push(value);
                            }
                        }
                    }
                } else {
                    parsedData[attr] = value;
                }
            };
            while (chunks.length > 0) {
                dataChunk = chunks.shift();
                if(dataChunk.trim().length < 1) {
                    continue;
                }
                classification = getClassification(dataChunk);
                attr = classification[1];
                prefix = classification[0];
                dataChunk = dataChunk.substr(prefix.length);
                switch (attr) {
                    case "nanori":
                        for (i = j = 1, ref = dataChunk; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
                            nanori = chunks.shift();
                            appendData(attr, nanori);
                        }
                        break;
                    case "meaning":
                        while (dataChunk.indexOf("}") !== dataChunk.length - 1) {
                            dataChunk += " " + chunks.shift();
                        }
                        dataChunk = dataChunk.substr(0, dataChunk.length - 1);
                        appendData(attr, dataChunk);
                        break;
                    case "kun":
                        periodIndex = dataChunk.indexOf(".");
                        hasOkurigana = periodIndex !== -1;
                        if (hasOkurigana) {
                            kunData = {
                                base: dataChunk.substr(0, dataChunk.indexOf(".")),
                                okurigana: dataChunk.substr(dataChunk.indexOf(".") + 1)
                            };
                        } else {
                            kunData = {
                                base: dataChunk
                            };
                        }
                        appendData(attr, kunData);
                        break;
                    default:
                        appendData(attr, dataChunk);
                }
            }
            return parsedData;
        };

        var readFileEntries = function(rawFileRows) {
            var parsedRows = [];

            while(rawFileRows.length > 0) {
                var row = rawFileRows.shift();

                if(row.trim().length < 1) {
                    continue;
                }

                parsedRows.push(readRow(row));
            }

            return parsedRows;
        };

        var readFileInfo = function (rawInfoRow) {
            var rowComponents = rawInfoRow.split('/');

            return {
                main: rowComponents[0].substr(rowComponents[0].indexOf(' ') + 1),
                copyright: rowComponents[2],
                date: rowComponents[3]
            };
        };

        var readEntries = function (rawFileData) {
            var rawFileRows = rawFileData.split('\n');

            var info = readFileInfo(rawFileRows.shift());
            var entries = readFileEntries(rawFileRows);

            return {
                info: info,
                entries: entries
            };
        };

        return readEntries(
            fs.readFileSync(inputDir + path, {encoding: encoding, flag: 'r'})
        );
    };

    var readData = function(options) {
        var dataset = options.dataset;

        switch(dataset) {
            case 'kanjidic': return readKanjidic('/kanjidic');
        }
        return null;
    };

    module.exports = {
        read: readData
    };

}) (module, require);
