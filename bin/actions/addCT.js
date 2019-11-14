"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var action_1 = require("../kernel/action");
var route_types_1 = require("../kernel/route-types");
var AddCTAction = /** @class */ (function (_super) {
    __extends(AddCTAction, _super);
    function AddCTAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AddCTAction.prototype.generateSQL = function () {
        return 'select * from TBCT where TBCT.NOME = \'' + this.req.body.name + '\';';
    };
    AddCTAction.prototype.defineVisibility = function () {
        this.actionEscope = route_types_1.ActionType.atPublic;
    };
    return AddCTAction;
}(action_1.Action));
exports.AddCTAction = AddCTAction;
