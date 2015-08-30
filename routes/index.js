/*global module,require*/

(function(module, require) {
    "use strict";

    var express = require('express');
    var router = express.Router();

    var srcDir = './../src';

    var reader = require(srcDir + '/io/reader');


    var paramTypes = {
        'string': function(param) {
            return typeof param === 'string';
        }
    };

    var routes = {
        '': {
            params: {},
            children: {
                'kanji': {
                    params: {
                        'dataset': ''
                    }
                }
            }
        }
    };

    var getRouteMethod = function getRouteMethod() {

    };

    var doRoute = function doRoute(parentRoute, routes) {
        parentRoute = parentRoute || "";

        if(parentRoute.length > 0) {
            router.get(parentRoute, getRouteMethod(parentRoute));
        }

        for(var route in routes) {
            if(routes.hasOwnProperty(route)) {
                doRoute(parentRoute + "/" + route, routes[route]);
            }
        }
    };

    doRoute(routes);

    /* GET home page. */
    //router.get('/', function (req, res, next) {
    //    res.json({
    //        routes: [
    //            'kanji'
    //        ]
    //    });
        //res.render('index', { title: 'Express' });
    //});

    //router.get('/kanji', function(req, res, next) {
    //
    //    try {
    //        var data = {};
    //
    //        var datasets = ['kanjidic'];
    //
    //        if (!!req.query.dataset) {
    //            if (!(req.query.dataset instanceof Array)) {
    //                req.query.dataset = [req.query.dataset];
    //            }
    //
    //            for (var i = 0; i < req.query.dataset.length; i++) {
    //                var dataset = req.query.dataset[i];
    //
    //                if (datasets.indexOf(dataset) === -1) {
    //                    throw ({
    //                        status: 404,
    //                        details: {
    //                            error: 'ERR_NO_DATABASE_TITLE',
    //                            message: 'ERR_NO_DATABASE_MSG'
    //                        }
    //                    });
    //                }
    //
    //                readDatasets.push(dataset);
    //
    //                data[dataset] = reader.read({
    //                    dataset: dataset
    //                });
    //            }
    //        } else {
    //            data = {
    //                datasets: datasets
    //            };
    //        }
    //
    //        res.json(data);
    //    } catch(e) {
    //        res.status(e.stats).json(e.details);
    //    }
    //});

    module.exports = router;
})(module, require);
