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
+2;
var EndOMAction = /** @class */ (function (_super) {
    __extends(EndOMAction, _super);
    function EndOMAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EndOMAction.prototype.validateData = function () {
        new kernel_utils_1.KernelUtils().createExceptionApiError('1001', 'Informe o ID do Manutentor do Convidado e ID  da Ordem de manutenção', this.req.body.idUser == '' || this.req.body.idUser == undefined || this.req.body.idOm == '' || this.req.body.idOm == undefined);
    };
    EndOMAction.prototype.insertSQL = function (estado) {
        if (estado == 3) {
            return 'update TBOM SET TBOM.ESTADO = \'' + estado + '\' WHERE TBOM.ID = \'' + this.req.body.idOm + '\';';
        }
        else if (estado == 4) {
            return 'update TBOM SET TBOM.ESTADO = \'' + estado + '\' WHERE TBOM.ID = \'' + this.req.body.idOm + '\';';
        }
        else {
            return 'update TBOM SET TBOM.ESTADO = \'' + estado + '\' WHERE TBOM.ID = \'' + this.req.body.idOm + '\';';
        }
    };
    EndOMAction.prototype.historico = function (nome, estado) {
        var desc = 'Manutentor ' + nome + ' assinou a OM';
        if (estado == 4) {
            desc = 'Líder ' + nome + ' assinou a OM';
        }
        else if (estado == 5) {
            desc = 'Administrador ' + nome + ' assinou a OM';
        }
        return 'insert into TBHISTORICO (TBHISTORICO.IDUSER, TBHISTORICO.IDOM, TBHISTORICO.DESC, TBHISTORICO.DTALTER) values (\'' + this.req.body.idUser + '\',\'' + this.req.body.idOm + '\',\'' + desc + '\', now());';
    };
    EndOMAction.prototype.assinar = function () {
        return 'insert into TBASSINATURAS (TBASSINATURAS.IDUSER, TBASSINATURAS.IDOM, TBASSINATURAS.DTBAIXA) values (\'' + this.req.body.idUser + '\',\'' + this.req.body.idOm + '\', now());';
    };
    EndOMAction.prototype.generateSQL = function () {
        return 'select ESTADO from TBOM where TBOM.ID = \'' + this.req.body.idOm + '\' AND STATUS = 1;';
    };
    EndOMAction.prototype.ADMonOM = function () {
        return 'select * from TBUSUARIO_WITH_TBOM where TBUSUARIO_WITH_TBOM.IDMANUT = \'' + this.req.body.idUser + '\' AND TBUSUARIO_WITH_TBOM.IDOM = \'' + this.req.body.idOm + '\'';
    };
    EndOMAction.prototype.validateADM = function () {
        return 'select CARGO,NOME from TBUSUARIO where TBUSUARIO.ID = \'' + this.req.body.idUser + '\' AND STATUS = 1;';
    };
    EndOMAction.prototype.Post = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            this.validateData();
            new mysql_factory_1.MySQLFactory().getConnection().select(this.validateADM()).subscribe(function (adm) {
                var estado = adm[0].CARGO + 2;
                new mysql_factory_1.MySQLFactory().getConnection().select(_this.ADMonOM()).subscribe(function (admon) {
                    if (admon.length || admon.length > 0 || adm[0].CARGO > 1) {
                        new mysql_factory_1.MySQLFactory().getConnection().select(_this.generateSQL()).subscribe(function (data) {
                            if (data[0].ESTADO > estado) {
                                _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'Estado setado é menor que o atual.'));
                                return;
                            }
                            else {
                                new mysql_factory_1.MySQLFactory().getConnection().select(_this.insertSQL(estado)).subscribe(function (data) {
                                    new mysql_factory_1.MySQLFactory().getConnection().select(_this.historico(adm[0].NOME, estado)).subscribe(function (data) {
                                        new mysql_factory_1.MySQLFactory().getConnection().select(_this.assinar()).subscribe(function (data) {
                                        });
                                    });
                                });
                            }
                            _this.sendAnswer({
                                token: new vputils_1.VPUtils().generateGUID().toUpperCase()
                            });
                        }, function (error) {
                            _this.sendError(error);
                        });
                    }
                    else {
                        _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'Manutentor ADM não está na OM '));
                    }
                });
            });
        }
    };
    EndOMAction.prototype.defineVisibility = function () {
        this.actionEscope = route_types_1.ActionType.atPublic;
    };
    __decorate([
        decorators_1.Post('/EndOM'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], EndOMAction.prototype, "Post", null);
    return EndOMAction;
}(action_1.Action));
exports.EndOMAction = EndOMAction;
