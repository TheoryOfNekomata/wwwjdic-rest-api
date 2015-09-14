/*global module,require,__dirname*/

(function(module, require, __dirname) {
    "use strict";

    var express = require('express');
    var router = express.Router();
    var _ = require('lodash');

    var middleware = {
        '': ['license'],
        '/': ['about']
    };

    var dir = function(absPath) {
        return __dirname + '/..' + absPath;
    };

    var routeDir = dir('/middleware/router/');

    for(var route in middleware) {
        if(middleware.hasOwnProperty(route)) {
            if(route.trim().length < 1) {
                router.use(require(routeDir + middleware[route]));
            } else {
                router.use(route, require(routeDir + middleware[route]));
            }
        }
    }

    //var reader = require(srcDir + '/io/reader');

    //middleware.forEach(function(def) {
    //    if(typeof def === 'string') {
    //        router.use(require('./router/' + def));
    //    }
    //});

    var jsonResponse = function(req, res, realRes) {
        res.json(_.extend(req.response, realRes || {}));
    };

    router.get('/', function(req, res, next) {
        require(dir('/middleware/download'));
        jsonResponse(req, res);
    });

    router.get('/kanji', function(req, res, next) {
        jsonResponse(req, res, { kanji: 'yes' });
    });

    //
    //
    //var paramTypes = {
    //    'string': function(param) {
    //        return typeof param === 'string';
    //    }
    //};
    //
    //var routes = {
    //    '': {
    //        params: {},
    //        children: {
    //            'kanji': {
    //                params: {
    //                    'dataset': ''
    //                }
    //            }
    //        }
    //    }
    //};
    //
    //var getRouteMethod = function getRouteMethod() {
    //
    //};
    //
    //var doRoute = function doRoute(parentRoute, routes) {
    //    parentRoute = parentRoute || "";
    //
    //    if(parentRoute.length > 0) {
    //        router.get(parentRoute, getRouteMethod(parentRoute));
    //    }
    //
    //    for(var route in routes) {
    //        if(routes.hasOwnProperty(route)) {
    //            doRoute(parentRoute + "/" + route, routes[route]);
    //        }
    //    }
    //};
    //
    //doRoute(routes);

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
})(module, require, __dirname);
