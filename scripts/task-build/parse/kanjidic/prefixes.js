#!/usr/bin/env node
/*global module*/

(function prefixes(module) {
    "use strict";

    module.exports = {
        "B": {
            "attr": "radical.bushu",
            "help": ""
        },
        "C": {
            "attr": "radical.kangxi",
            "help": ""
        },
        "F": {
            "attr": "frequency",
            "help": ""
        },
        "G": {
            "attr": "level.jouyou",
            "help": ""
        },
        "J": {
            "attr": "level.jlpt",
            "help": ""
        },
        "U": { // UNUSED
            "attr": "unicode",
            "help": ""
        },
        "DA": {
            "attr": "index.da",
            "help": "the index numbers used in the 2011 edition of the Kanji & Kana book, by Spahn & Hadamitzky."
        },
        "DB": {
            "attr": "index.db",
            "help": "the index numbers used in \"Japanese For Busy People\" vols I-III, published by the AJLT."
        },
        "DC": {
            "attr": "index.dc",
            "help": "the index numbers used in \"The Kanji Way to Japanese Language Power\" by Dale Crowley."
        },
        "DF": {
            "attr": "index.df",
            "help": "the index numbers used in the \"Japanese Kanji Flashcards\", by Max Hodges and Tomoko Okazaki (White Rabbit Press)."
        },
        "DG": {
            "attr": "index.dg",
            "help": "the index numbers used in the \"Kodansha Compact Kanji Guide\"."},
        "DH": {
            "attr": "index.dh",
            "help": "the index numbers used in the 3rd edition of \"A Guide To Reading and Writing Japanese\" edited by Ken Hensall et al."
        },
        "DJ": {
            "attr": "index.dj",
            "help": "the index numbers used in the \"Kanji in Context\" by Nishiguchi and Kono."
        },
        "DK": {
            "attr": "index.dk",
            "help": "the index numbers used by Jack Halpern in his Kanji Learners Dictionary, published by Kodansha in 1999."
        },
        "DL": {
            "attr": "index.dl",
            "help": "the index numbers used by Jack Halpern in his Kanji Learners Dictionary, 2013 second edition."
        },
        "DM": {
            "attr": "index.dm",
            "help": "the numbers in Yves Maniette\'s French adapatation of Heisig\'s \"Remembering The Kanji\"."
        },
        "DN": {
            "attr": "index.dn",
            "help": "the index number used in \"Remembering The Kanji, 6th Edition\" by James Heisig."
        },
        "DO": {
            "attr": "index.do",
            "help": "the index numbers used in P.G. O\'Neill\'s Essential Kanji"
        },
        "DP": {
            "attr": "index.dp",
            "help": "the index numbers used by Jack Halpern in his Kodansha Kanji Dictionary (2013), which is the revised version of the \"New Japanese-English Kanji Dictionary\" of 1990."
        },
        "DR": {
            "attr": "index.dr",
            "help": "these are the codes developed by Father Joseph De Roo, and published in his book \"2001 Kanji\" (Bonjinsha)."
        },
        "DS": {
            "attr": "index.ds",
            "help": "the index numbers used in the early editions of \"A Guide To Reading and Writing Japanese\" edited by Florence Sakade."
        },
        "DT": {
            "attr": "index.dt",
            "help": "the index numbers used in the Tuttle Kanji Cards, compiled by Alexander Kask."
        },
        "IN": {
            "attr": "index.in",
            "help": "the index codes in the reference books by Spahn & Hadamitzky for the Kanji & Kana book (Tuttle) (2nd edition)."
        },
        "MN": {
            "attr": "index.mn",
            "help": "the index number of the kanji in the 13-volume Morohashi Daikanwajiten."
        },
        "MP": {
            "attr": "index.mp",
            "help": "the volume.page of the kanji in the 13-volume Morohashi Daikanwajiten."
        },
        "I": {
            "attr": "index.i",
            "help": "the index codes in the reference books by Spahn & Hadamitzky for The Kanji Dictionary (Tuttle 1996)."
        },
        "O": {
            "attr": "index.o",
            "help": "the index number in \"Japanese Names\", by P.G. O\'Neill. (Weatherhill, 1972)"
        },
        "Q": {
            "attr": "four_corner_code",
            "help": "the \"Four Corner\" code for that kanji."
        },
        "H": {
            "attr": "index.h",
            "help": "the index number in the New Japanese-English Character Dictionary (1990), edited by Jack Halpern. At most one allowed per line. If not preset, the character is not in Halpern."
        },
        "K": {
            "attr": "index.k",
            "help": "the index number in the Gakken Kanji Dictionary (\"A New Dictionary of Kanji Usage\")."
        },
        "L": {
            "attr": "index.l",
            "help": "the index number used in \"Remembering The Kanji\" by James Heisig."},
        "E": {
            "attr": "index.e",
            "help": "the index number used in \"A Guide To Remembering Japanese Characters\" by Kenneth G. Henshall."
        },
        "N": {
            "attr": "index.n",
            "help": "the index number in the \"Modern Reader\'s Japanese-English Character Dictionary\", edited by Andrew Nelson."
        },
        "V": {
            "attr": "index.v",
            "help": "the index number in The New Nelson Japanese-English Character Dictionary, edited by John Haig."
        },
        "P": {
            "attr": "skip_code",
            "help": ""
        },
        "S": {
            "attr": "strokes",
            "help": ""
        },
        "Y": {
            "attr": "reading.pinyin",
            "help": ""
        },
        "T": {
            "attr": "reading.special",
            "help": ""
        },
        "{": {
            "attr": "meaning",
            "help": ""
        },
        "W": {
            "attr": "reading.korean",
            "help": ""
        },
        "X": {
            "attr": "cross_reference",
            "help": ""
        },
        "ZPP": {
            "attr": "misclassification.position",
            "help": ""
        },
        "ZSP": {
            "attr": "misclassification.strokes",
            "help": ""
        },
        "ZRP": {
            "attr": "misclassification.strokes2",
            "help": ""
        },
        "ZBP": {
            "attr": "misclassification.both",
            "help": ""
        }
    };

})(module);
