"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Log(target, methodName, descriptor) {
    var originalMethod = descriptor.value;
    descriptor.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log('antes');
        var result = originalMethod.apply(this, args);
        console.log('Depois');
    };
    return descriptor;
}
exports.default = Log;
;
