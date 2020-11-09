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
var decorators_1 = require("../decorators");
var action_1 = require("../kernel/action");
var route_types_1 = require("../kernel/route-types");
var kernel_utils_1 = require("../kernel/kernel-utils");
var mysql_factory_1 = require("../mysql/mysql_factory");
require("dotenv-safe").config();
var jwt = require('jsonwebtoken');
var LogonAction = /** @class */ (function (_super) {
    __extends(LogonAction, _super);
    function LogonAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LogonAction.prototype.validateData = function () {
        new kernel_utils_1.KernelUtils().createExceptionApiError('1001', 'Usuário e senha inválidos', this.req.body.userName == '' || this.req.body.password == '' || this.req.body.userName == undefined || this.req.body.password == undefined);
    };
    LogonAction.prototype.generateSQL = function () {
        return 'select TBUSUARIO.ID, TBUSUARIO.CARGO, TBCARGO.NOME as CARGONOME from TBUSUARIO INNER JOIN TBCARGO ON TBUSUARIO.CARGO = TBCARGO.ID  where TBUSUARIO.LOGIN = \'' + this.req.body.userName + '\' and TBUSUARIO.SENHA = \'' + this.req.body.password + '\';';
    };
    LogonAction.prototype.Post = function () {
        var _this = this;
        this.validateData();
        new mysql_factory_1.MySQLFactory().getConnection().select(this.generateSQL()).subscribe(function (data) {
            if (!data.length || data.length != 1) {
                _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'Usuário e senha inválidos'));
                return;
            }
            var id = data[0].ID;
            var token = jwt.sign({ id: id }, process.env.SECRET, {
                expiresIn: 18000 // expires in 5min
            });
            _this.sendAnswer({
                token: token,
                auth: true,
                userName: _this.req.body.userName,
                id: id,
                cargoId: data[0].CARGO,
                cargoNome: data[0].CARGONOME
            });
        }, function (error) {
            _this.sendError(error);
        });
    };
    LogonAction.prototype.Logout = function () {
        this.sendAnswer({
            auth: false, token: null
        });
    };
    LogonAction.prototype.defineVisibility = function () {
        this.actionEscope = route_types_1.ActionType.atPublic;
    };
    __decorate([
        decorators_1.Post('/logon'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], LogonAction.prototype, "Post", null);
    __decorate([
        decorators_1.Post('/logout'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], LogonAction.prototype, "Logout", null);
    return LogonAction;
}(action_1.Action));
exports.LogonAction = LogonAction;
