"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VPUtils = /** @class */ (function () {
    function VPUtils() {
    }
    VPUtils.prototype.generateGUID = function () {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
    };
    return VPUtils;
}());
exports.VPUtils = VPUtils;
