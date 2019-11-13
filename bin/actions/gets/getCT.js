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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var decorators_1 = require("../../decorators");
var action_1 = require("../../kernel/action");
var route_types_1 = require("../../kernel/route-types");
var kernel_utils_1 = require("../../kernel/kernel-utils");
var mysql_factory_1 = require("../../mysql/mysql_factory");
var GetCTAction = /** @class */ (function (_super) {
    __extends(GetCTAction, _super);
    function GetCTAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GetCTAction.prototype.generateSQL = function () {
        return 'select NOME from TBCT;';
    };
    GetCTAction.prototype.Post = function () {
        var _this = this;
        new mysql_factory_1.MySQLFactory().getConnection().select(this.generateSQL()).subscribe(function (data) {
            if (data.length || data.length > 0) {
                console.log(data);
                return data;
            }
            else {
                console.log(data);
                _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'Centro de trabalho já existe'));
            }
            _this.sendAnswer({
                list: data
            });
        }, function (error) {
            _this.sendError(error);
        });
    };
    GetCTAction.prototype.defineVisibility = function () {
        this.actionEscope = route_types_1.ActionType.atPublic;
    };
    __decorate([
        decorators_1.Post('/GetCT'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], GetCTAction.prototype, "Post", null);
    return GetCTAction;
}(action_1.Action));
exports.GetCTAction = GetCTAction;
