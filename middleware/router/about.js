/*global module,require*/

(function(module) {
    "use strict";

    var _ = require('lodash');

    module.exports = function(req, res, next) {
        var about = {
            about: {
                name: 'wwwjdic-rest-api',
                author: 'Temoto-kun',
                version: '1.0.0'
            }
        };

        req.response = _.extend(req.response || {}, about);
        next();
    };

})(module, require);
