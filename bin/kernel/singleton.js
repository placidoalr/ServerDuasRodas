"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Singleton = /** @class */ (function () {
    function Singleton() {
        this.actions = [];
    }
    Singleton.prototype.getExpressApp = function () {
        return this.app;
    };
    Singleton.prototype.setExpressApp = function (value) {
        this.app = value;
    };
    Singleton.prototype.addAction = function (action) {
        this.actions.push(action);
    };
    return Singleton;
}());
module.exports = new Singleton();
