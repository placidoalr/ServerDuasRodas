"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var routes_1 = require("../kernel/routes");
var route_types_1 = require("../kernel/route-types");
var singleton = require('../kernel/singleton');
var RegisterMethods = /** @class */ (function () {
    function RegisterMethods(target, key, descriptor, httpMethod, url) {
        if (key === void 0) { key = null; }
        if (descriptor === void 0) { descriptor = null; }
        this.target = target;
        this.key = key;
        this.descriptor = descriptor;
        this.httpMethod = httpMethod;
        this.url = url;
        this.make();
    }
    RegisterMethods.prototype.make = function () {
        if (this.key === null || this.descriptor === null) {
            return this.descriptor;
        }
        if (this.url.length > 0 && this.url[0] !== '/') {
            this.url = '/' + this.url;
        }
        var methods = [];
        switch (this.httpMethod) {
            case route_types_1.HttpMethod.get:
                console.log('Registrando ' + 'GET: ' + this.url);
                break;
            case route_types_1.HttpMethod.post:
                console.log('Registrando ' + 'POST: ' + this.url);
                break;
            case route_types_1.HttpMethod.put:
                console.log('Registrando ' + 'PUT: ' + this.url);
                break;
            case route_types_1.HttpMethod.patch:
                console.log('Registrando ' + 'PATCH: ' + this.url);
                break;
        }
        methods.push({
            httpMethod: this.httpMethod,
            methodName: this.key,
            routeName: this.url,
            classType: this.target
        });
        new routes_1.ApplyRoutes(singleton.getExpressApp(), methods);
    };
    return RegisterMethods;
}());
exports.RegisterMethods = RegisterMethods;
