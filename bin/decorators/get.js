"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var register_method_1 = require("./register-method");
var route_types_1 = require("../kernel/route-types");
function Get(url) {
    return function (target, key, descriptor) {
        if (key === void 0) { key = null; }
        if (descriptor === void 0) { descriptor = null; }
        new register_method_1.RegisterMethods(target, key, descriptor, route_types_1.HttpMethod.get, url);
        return descriptor;
    };
}
exports.default = Get;
