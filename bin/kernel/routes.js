"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var route_types_1 = require("./route-types");
var route_execute_1 = require("./route-execute");
var ApplyRoutes = /** @class */ (function () {
    function ApplyRoutes(app, routes) {
        this.app = app;
        this.routes = routes;
        this.makeRoutes();
    }
    ApplyRoutes.prototype.executeAction = function (route, req, resp) {
        new route_execute_1.RouteExecute(route, req, resp);
    };
    ApplyRoutes.prototype.makeRoutes = function () {
        var _this = this;
        this.routes.forEach(function (route) {
            switch (route.httpMethod) {
                case route_types_1.HttpMethod.get:
                    _this.app.get(route.routeName, function (req, resp) {
                        _this.executeAction(route, req, resp);
                    });
                    break;
                case route_types_1.HttpMethod.post:
                    _this.app.post(route.routeName, function (req, resp) {
                        _this.executeAction(route, req, resp);
                    });
                    break;
                case route_types_1.HttpMethod.put:
                    _this.app.put(route.routeName, function (req, resp) {
                        _this.executeAction(route, req, resp);
                    });
                    break;
                case route_types_1.HttpMethod.patch:
                    _this.app.patch(route.routeName, function (req, resp) {
                        _this.executeAction(route, req, resp);
                    });
                    break;
            }
            ;
        });
    };
    return ApplyRoutes;
}());
exports.ApplyRoutes = ApplyRoutes;
