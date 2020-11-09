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
var vputils_1 = require("../utils/vputils");
var kernel_utils_1 = require("../kernel/kernel-utils");
var mysql_factory_1 = require("../mysql/mysql_factory");
var jwt_1 = require("../utils/jwt");
var UserAction = /** @class */ (function (_super) {
    __extends(UserAction, _super);
    function UserAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserAction.prototype.validateData = function () {
        new kernel_utils_1.KernelUtils().createExceptionApiError('1001', 'Informe todos os campos corretamente', this.req.body.idsap == null || this.req.body.name == '' || this.req.body.password == '' || this.req.body.idsap == undefined || this.req.body.name == undefined || this.req.body.password == undefined || this.req.body.cdct == undefined || this.req.body.cdct == null || this.req.body.cargo == undefined || this.req.body.cargo == null || this.req.body.login == undefined || this.req.body.login == '');
    };
    UserAction.prototype.generateSQL = function () {
        return 'select ID from TBUSUARIO where TBUSUARIO.ID = \'' + this.req.body.id + '\' AND STATUS = 1;';
    };
    UserAction.prototype.generateADDSQL = function () {
        return 'select * from TBUSUARIO where (TBUSUARIO.NOME = \'' + this.req.body.name + '\' OR TBUSUARIO.IDSAP = \'' + this.req.body.idsap + '\') AND STATUS = 1;';
    };
    UserAction.prototype.insertSQL = function () {
        return 'insert into TBUSUARIO (TBUSUARIO.IDSAP ,TBUSUARIO.LOGIN, TBUSUARIO.SENHA, TBUSUARIO.CARGO, TBUSUARIO.NOME, TBUSUARIO.CDCT) values (\'' + this.req.body.idsap + '\',\'' + this.req.body.login + '\', \'' + this.req.body.password + '\', \'' + this.req.body.cargo + '\', \'' + this.req.body.name + '\', \'' + this.req.body.cdct + '\');';
    };
    UserAction.prototype.selectSQL = function () {
        return 'select TBUSUARIO.*, TBCT.NOME AS TBCTNOME, TBCARGO.NOME AS TBCARGONOME from TBUSUARIO INNER JOIN TBCT ON TBUSUARIO.CDCT = TBCT.ID INNER JOIN TBCARGO ON TBUSUARIO.CARGO = TBCARGO.ID where TBUSUARIO.STATUS = 1;';
    };
    UserAction.prototype.selectLideres = function () {
        return 'select TBUSUARIO.ID, TBUSUARIO.NOME from TBUSUARIO where TBUSUARIO.STATUS = 1 AND TBUSUARIO.CARGO = 2;';
    };
    UserAction.prototype.deleteSQL = function () {
        return 'UPDATE TBUSUARIO SET STATUS = \'0\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    };
    UserAction.prototype.editSQL = function () {
        return 'UPDATE TBUSUARIO SET NOME = \'' + this.req.body.name + '\', IDSAP = \'' + this.req.body.idsap + '\', \
        LOGIN = \'' + this.req.body.login + '\', SENHA = \'' + this.req.body.password + '\', CARGO = \'' + this.req.body.cargo + '\' \
        , CDCT = \'' + this.req.body.cdct + '\' \
        WHERE ID =  \'' + this.req.body.id + '\';';
    };
    UserAction.prototype.Post = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            this.validateData();
            new mysql_factory_1.MySQLFactory().getConnection().select(this.generateADDSQL()).subscribe(function (data) {
                if (data.length || data.length > 0) {
                    _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'Usuário já existe'));
                    return;
                }
                else {
                    new mysql_factory_1.MySQLFactory().getConnection().select(_this.insertSQL()).subscribe(function (data) {
                    });
                }
                _this.sendAnswer({
                    token: new vputils_1.VPUtils().generateGUID().toUpperCase()
                });
            }, function (error) {
                _this.sendError(error);
            });
        }
    };
    UserAction.prototype.Get = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.selectSQL()).subscribe(function (data) {
                _this.sendAnswer(data);
            }, function (error) {
                _this.sendError(error);
            });
        }
    };
    UserAction.prototype.GetLeads = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.selectLideres()).subscribe(function (data) {
                _this.sendAnswer(data);
            }, function (error) {
                _this.sendError(error);
            });
        }
    };
    UserAction.prototype.Patch = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.deleteSQL()).subscribe(function (data) {
                _this.sendAnswer(data);
            }, function (error) {
                _this.sendError(error);
            });
        }
    };
    UserAction.prototype.Edit = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.generateSQL()).subscribe(function (data) {
                if (data.length || data.length > 0 && _this.req.body.idsap != _this.req.body.idsaplast) {
                    _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'Usuário já existe'));
                    return;
                }
                else {
                    new mysql_factory_1.MySQLFactory().getConnection().select(_this.editSQL()).subscribe(function (data) {
                    });
                }
                _this.sendAnswer({
                    token: new vputils_1.VPUtils().generateGUID().toUpperCase()
                });
            }, function (error) {
                _this.sendError(error);
            });
        }
    };
    UserAction.prototype.defineVisibility = function () {
        this.actionEscope = route_types_1.ActionType.atPublic;
    };
    __decorate([
        decorators_1.Post('/AddUser'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], UserAction.prototype, "Post", null);
    __decorate([
        decorators_1.Get('/GetUser'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], UserAction.prototype, "Get", null);
    __decorate([
        decorators_1.Get('/GetLeads'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], UserAction.prototype, "GetLeads", null);
    __decorate([
        decorators_1.Patch('/DelUser'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], UserAction.prototype, "Patch", null);
    __decorate([
        decorators_1.Post('/EditUser'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], UserAction.prototype, "Edit", null);
    return UserAction;
}(action_1.Action));
exports.UserAction = UserAction;
