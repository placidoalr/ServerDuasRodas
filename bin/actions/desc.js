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
var DescOMAction = /** @class */ (function (_super) {
    __extends(DescOMAction, _super);
    function DescOMAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DescOMAction.prototype.validateData = function () {
        new kernel_utils_1.KernelUtils().createExceptionApiError('1001', 'Informe o ID do Manutentor do Convidado e ID  da Ordem de manutenção', this.req.body.idUser == '' || this.req.body.idUser == undefined || this.req.body.idOm == '' || this.req.body.idOm == undefined || this.req.body.desc == '' || this.req.body.desc == undefined || this.req.body.time == '' || this.req.body.time == undefined);
    };
    DescOMAction.prototype.insertSQL = function () {
        return 'insert into TB_OM_DESC (TB_OM_DESC.IDMANUT, TB_OM_DESC.IDOM, TB_OM_DESC.DESC, TB_OM_DESC.TEMPO_UTIL) values (\'' + this.req.body.idUser + '\',\'' + this.req.body.idOm + '\',\'' + this.req.body.desc + '\',\'' + this.req.body.time + '\');';
    };
    DescOMAction.prototype.insertRota = function () {
        return 'insert into TB_OM_DESC_ROTA (TB_OM_DESC_ROTA.IDMANUT, TB_OM_DESC_ROTA.IDOM, TB_OM_DESC_ROTA.DESC, TB_OM_DESC_ROTA.IDEQUIP) values (\'' + this.req.body.idUser + '\',\'' + this.req.body.idOm + '\',\'' + this.req.body.desc + '\',\'' + this.req.body.idequip + '\');';
    };
    DescOMAction.prototype.updateSQL = function () {
        return 'update TB_OM_DESC set TB_OM_DESC.DESC = \'' + this.req.body.desc + '\', TB_OM_DESC.TEMPO_UTIL = \'' + this.req.body.time + '\' where TB_OM_DESC.ID = \'' + this.req.body.id + '\';';
    };
    DescOMAction.prototype.updateRotaSQL = function () {
        return 'update TB_OM_DESC_ROTA set TB_OM_DESC_ROTA.DESC = \'' + this.req.body.desc + '\' where TB_OM_DESC_ROTA.ID = \'' + this.req.body.id + '\';';
    };
    DescOMAction.prototype.ADMonOM = function () {
        return 'select * from TBUSUARIO_WITH_TBOM where TBUSUARIO_WITH_TBOM.IDMANUT = \'' + this.req.body.idUser + '\' AND TBUSUARIO_WITH_TBOM.IDOM = \'' + this.req.body.idOm + '\';';
    };
    DescOMAction.prototype.validateADM = function () {
        return 'select CARGO from TBUSUARIO where TBUSUARIO.ID = \'' + this.req.body.idUser + '\' AND TBUSUARIO.STATUS = 1;';
    };
    DescOMAction.prototype.selectDesc = function () {
        return 'select u.NOME, d.DESC, d.TEMPO_UTIL, d.ID from TBUSUARIO u inner join TB_OM_DESC d on d.IDMANUT = u.ID where d.IDOM = ' + this.req.body.idOm + ';';
    };
    DescOMAction.prototype.selectDescROTA = function () {
        return 'select u.NOME, d.DESC, d.ID from TBUSUARIO u inner join TB_OM_DESC_ROTA d on d.IDMANUT = u.ID where d.IDOM = ' + this.req.body.idOm + ';';
    };
    DescOMAction.prototype.selectTempo = function () {
        return 'select SEC_TO_TIME(SUM(TIME_TO_SEC(TEMPO_UTIL))) as TEMPO from TB_OM_DESC where IDOM = ' + this.req.body.idOm + ';';
    };
    DescOMAction.prototype.updateEQUIPSQL = function (id) {
        return 'update TBEQUIP_WITH_TBOM set OPER_REALIZADA = 1 where IDEQUIP = ' + id + ' and IDOM = ' + this.req.body.idOm + ';';
    };
    DescOMAction.prototype.deleteDescOMRota = function () {
        return 'delete from TB_OM_DESC_ROTA WHERE ID =  \'' + this.req.body.id + '\';';
    };
    DescOMAction.prototype.GetDescOM = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.selectDesc()).subscribe(function (data) {
                _this.sendAnswer(data);
            }, function (error) {
                _this.sendError(error);
            });
        }
    };
    DescOMAction.prototype.GetTempoOM = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.selectTempo()).subscribe(function (data) {
                _this.sendAnswer(data);
            }, function (error) {
                _this.sendError(error);
            });
        }
    };
    DescOMAction.prototype.GetDescOMROTA = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.selectDescROTA()).subscribe(function (data) {
                _this.sendAnswer(data);
            }, function (error) {
                _this.sendError(error);
            });
        }
    };
    DescOMAction.prototype.Post = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            this.validateData();
            new mysql_factory_1.MySQLFactory().getConnection().select(this.validateADM()).subscribe(function (adm) {
                if (adm[0].CARGO == 1) {
                    new mysql_factory_1.MySQLFactory().getConnection().select(_this.ADMonOM()).subscribe(function (admon) {
                        if (admon.length || admon.length > 0) {
                            new mysql_factory_1.MySQLFactory().getConnection().select(_this.insertSQL()).subscribe(function (data) {
                            });
                        }
                        else {
                            _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'Manutentor ADM não está na OM '));
                        }
                    });
                }
                else {
                    _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'Usuário sem permissão para descrever'));
                }
            });
            this.sendAnswer({
                token: new vputils_1.VPUtils().generateGUID().toUpperCase()
            });
        }
    };
    DescOMAction.prototype.PostRota = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.validateADM()).subscribe(function (adm) {
                if (adm[0]) {
                    if (adm[0].CARGO == 1) {
                        new mysql_factory_1.MySQLFactory().getConnection().select(_this.ADMonOM()).subscribe(function (admon) {
                            if (admon.length || admon.length > 0) {
                                new mysql_factory_1.MySQLFactory().getConnection().select(_this.insertRota()).subscribe(function (data) {
                                    _this.sendAnswer({
                                        token: new vputils_1.VPUtils().generateGUID().toUpperCase()
                                    });
                                });
                            }
                            else {
                                _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'Manutentor ADM não está na OM '));
                            }
                        });
                    }
                    else {
                        _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'Usuário sem permissão para descrever'));
                    }
                }
                else {
                    _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'Usuário não encontrado'));
                }
            });
        }
    };
    DescOMAction.prototype.Update = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.validateADM()).subscribe(function (adm) {
                if (adm[0].CARGO == 1) {
                    new mysql_factory_1.MySQLFactory().getConnection().select(_this.ADMonOM()).subscribe(function (admon) {
                        if (admon.length || admon.length > 0) {
                            new mysql_factory_1.MySQLFactory().getConnection().select(_this.updateSQL()).subscribe(function (data) {
                            });
                        }
                        else {
                            _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'Manutentor ADM não está na OM '));
                        }
                    });
                }
                else {
                    _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'Usuário sem permissão para descrever'));
                }
            });
            this.sendAnswer({
                token: new vputils_1.VPUtils().generateGUID().toUpperCase()
            });
        }
    };
    DescOMAction.prototype.UpdateRota = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.validateADM()).subscribe(function (adm) {
                if (adm[0].CARGO == 1) {
                    new mysql_factory_1.MySQLFactory().getConnection().select(_this.ADMonOM()).subscribe(function (admon) {
                        if (admon.length || admon.length > 0) {
                            new mysql_factory_1.MySQLFactory().getConnection().select(_this.updateRotaSQL()).subscribe(function (data) {
                            });
                        }
                        else {
                            _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'Manutentor ADM não está na OM '));
                        }
                    });
                }
                else {
                    _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'Usuário sem permissão para descrever'));
                }
            });
            this.sendAnswer({
                token: new vputils_1.VPUtils().generateGUID().toUpperCase()
            });
        }
    };
    DescOMAction.prototype.PostLista = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            this.validateData();
            new mysql_factory_1.MySQLFactory().getConnection().select(this.validateADM()).subscribe(function (adm) {
                if (adm[0].CARGO == 1) {
                    new mysql_factory_1.MySQLFactory().getConnection().select(_this.ADMonOM()).subscribe(function (admon) {
                        if (admon.length || admon.length > 0) {
                            _this.req.body.equips.forEach(function (equip) {
                                new mysql_factory_1.MySQLFactory().getConnection().select(_this.updateEQUIPSQL(equip)).subscribe(function (data1) {
                                });
                            });
                        }
                        else {
                            _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'Manutentor ADM não está na OM '));
                        }
                    });
                }
                else {
                    _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'Usuário sem permissão para descrever'));
                }
            });
            this.sendAnswer({
                token: new vputils_1.VPUtils().generateGUID().toUpperCase()
            });
        }
    };
    DescOMAction.prototype.Patch = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.deleteDescOMRota()).subscribe(function (data) {
                _this.sendAnswer({
                    token: new vputils_1.VPUtils().generateGUID().toUpperCase()
                });
            }, function (error) {
                _this.sendError(error);
            });
        }
    };
    DescOMAction.prototype.defineVisibility = function () {
        this.actionEscope = route_types_1.ActionType.atPublic;
    };
    __decorate([
        decorators_1.Post('/GetDescOM'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], DescOMAction.prototype, "GetDescOM", null);
    __decorate([
        decorators_1.Post('/GetTempo'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], DescOMAction.prototype, "GetTempoOM", null);
    __decorate([
        decorators_1.Post('/GetDescOMROTA'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], DescOMAction.prototype, "GetDescOMROTA", null);
    __decorate([
        decorators_1.Post('/DescOM'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], DescOMAction.prototype, "Post", null);
    __decorate([
        decorators_1.Post('/DescOMRota'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], DescOMAction.prototype, "PostRota", null);
    __decorate([
        decorators_1.Post('/UpdateDescOM'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], DescOMAction.prototype, "Update", null);
    __decorate([
        decorators_1.Post('/UpdateDescOMRota'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], DescOMAction.prototype, "UpdateRota", null);
    __decorate([
        decorators_1.Post('/DescOMLista'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], DescOMAction.prototype, "PostLista", null);
    __decorate([
        decorators_1.Patch('/DelDescOMRota'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], DescOMAction.prototype, "Patch", null);
    return DescOMAction;
}(action_1.Action));
exports.DescOMAction = DescOMAction;
