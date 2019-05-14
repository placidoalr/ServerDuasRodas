"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var route_types_1 = require("./route-types");
var Action = /** @class */ (function () {
    function Action(req, resp) {
        this.observer = null;
        this.actionEscope = route_types_1.ActionType.atPrivate;
        this.statusCode = 200;
        this.req = req;
        this.resp = resp;
    }
    Action.prototype.sendAnswer = function (data) {
        this.observer.next(data);
        this.observer.complete();
    };
    Action.prototype.sendError = function (error) {
        this.observer.error(error);
    };
    return Action;
}());
exports.Action = Action;
