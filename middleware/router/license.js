/*global module,require*/

(function(module) {
    "use strict";

    var _ = require('lodash');

    module.exports = function(req, res, next) {
        var attrib = {
            meta: {
                acknowledgment: {
                    plain: 'The data API uses the EDICT and KANJIDIC dictionary files. These files are the property of the Electronic Dictionary Research and Development Group, and are used in conformance with the Group\'s licence.',
                    html: '<p>The data API uses the <a href="http://www.csse.monash.edu.au/~jwb/edict.html">EDICT</a> and <a href="http://www.csse.monash.edu.au/~jwb/kanjidic.html">KANJIDIC</a> dictionary files. These files are the property of the <a href="http://www.edrdg.org/"> Electronic Dictionary Research and Development Group</a>, and are used in conformance with the Group&quot;s <a href="http://www.edrdg.org/edrdg/licence.html">license</a>.</p>'
                },
                links: {
                    edict: 'http://www.csse.monash.edu.au/~jwb/edict.html',
                    kanjidic: 'http://www.csse.monash.edu.au/~jwb/kanjidic.html',
                    edrdg: 'http://www.edrdg.org/',
                    license: 'http://www.edrdg.org/edrdg/licence.html'
                }
            }
        };

        req.response = _.extend(req.response || {}, attrib);
        next();
    };

})(module, require);
