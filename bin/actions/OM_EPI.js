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
var OMEPIAction = /** @class */ (function (_super) {
    __extends(OMEPIAction, _super);
    function OMEPIAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OMEPIAction.prototype.validateData = function () {
        new kernel_utils_1.KernelUtils().createExceptionApiError('1001', 'Informe os EPIS e ID da Ordem de manutenção', this.req.body.epis == '' || this.req.body.epis == undefined || this.req.body.idOm == '' || this.req.body.idOm == undefined);
    };
    OMEPIAction.prototype.insertSQL = function (epi) {
        return 'insert into TBEPI_WITH_TBOM (TBEPI_WITH_TBOM.IDEPI, TBEPI_WITH_TBOM.IDOM, TBEPI_WITH_TBOM.IDMANUT) values (\'' + epi + '\',\'' + this.req.body.idOm + '\',\'' + this.req.body.idUser + '\');';
    };
    OMEPIAction.prototype.historico = function (manutNome, epiNome) {
        var desc = 'EPI - Manuntentor ' + manutNome + ' sinalizou que está utilizando o EPI ' + epiNome;
        return 'insert into TBHISTORICO (TBHISTORICO.IDUSER, TBHISTORICO.IDOM, TBHISTORICO.DESC, TBHISTORICO.DTALTER) values (\'' + this.req.body.idUser + '\',\'' + this.req.body.idOm + '\',\'' + desc + '\', now());';
    };
    OMEPIAction.prototype.generateSQL = function (epi) {
        return 'select * from TBEPI_WITH_TBOM where TBEPI_WITH_TBOM.IDEPI = \'' + epi + '\' AND TBEPI_WITH_TBOM.IDOM = \'' + this.req.body.idOm + '\' AND TBEPI_WITH_TBOM.IDMANUT = \'' + this.req.body.idUser + '\';';
    };
    OMEPIAction.prototype.getNomes = function (epi) {
        return 'select NOME,(select NOME from TBEPI where TBEPI.ID = \'' + epi + '\' LIMIT 1) as EPINOME from TBUSUARIO where TBUSUARIO.ID = \'' + this.req.body.idUser + '\';';
    };
    OMEPIAction.prototype.selectSQL = function () {
        return 'select TBEPI.ID,TBEPI.NOME as EPINOME, TBUSUARIO.NOME as USERNAME, TBEPI_WITH_TBOM.IDOM from TBEPI INNER JOIN TBEPI_WITH_TBOM on TBEPI_WITH_TBOM.IDEPI = TBEPI.ID INNER JOIN TBUSUARIO on  TBEPI_WITH_TBOM.IDMANUT = TBUSUARIO.ID where TBEPI_WITH_TBOM.IDOM = \'' + this.req.body.idOm + '\';';
    };
    OMEPIAction.prototype.selectEPISNotUsed = function () {
        return 'select ID,NOME,IDPADRAO from TBEPI WHERE ID not in (select ewo.IDEPI from TBEPI_WITH_TBOM ewo where ewo.IDOM = \'' + this.req.body.idOm + '\' and ewo.IDMANUT = \'' + this.req.body.idUser + '\');';
    };
    OMEPIAction.prototype.selectEPISUsed = function () {
        return 'select ID,NOME,IDPADRAO from TBEPI WHERE ID in (select ewo.IDEPI from TBEPI_WITH_TBOM ewo where ewo.IDOM = \'' + this.req.body.idOm + '\' and ewo.IDMANUT = \'' + this.req.body.idUser + '\');';
    };
    OMEPIAction.prototype.deleteEpi = function () {
        return 'delete from TBEPI_WITH_TBOM WHERE IDEPI = \'' + this.req.body.idEpi + '\' AND IDOM = \'' + this.req.body.idOm + '\' AND IDMANUT = \'' + this.req.body.idUser + '\';';
    };
    OMEPIAction.prototype.Post = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            this.validateData();
            if (this.req.body.epis) {
                this.req.body.epis.forEach(function (epi) {
                    new mysql_factory_1.MySQLFactory().getConnection().select(_this.insertSQL(epi)).subscribe(new mysql_factory_1.MySQLFactory().getConnection().select(_this.generateSQL(epi)).subscribe(function (data) {
                        new mysql_factory_1.MySQLFactory().getConnection().select(_this.insertSQL(epi)).subscribe(function (data) {
                            new mysql_factory_1.MySQLFactory().getConnection().select(_this.getNomes(epi)).subscribe(function (dados) {
                                new mysql_factory_1.MySQLFactory().getConnection().select(_this.historico(dados[0].NOME, dados[0].EPINOME)).subscribe(function (dados) {
                                });
                            });
                        });
                    }, function (error) {
                        _this.sendError(error);
                    }));
                });
                this.sendAnswer({
                    token: new vputils_1.VPUtils().generateGUID().toUpperCase()
                });
            }
        }
    };
    OMEPIAction.prototype.Getone = function () {
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
    OMEPIAction.prototype.GetEpisNot = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.selectEPISNotUsed()).subscribe(function (data) {
                _this.sendAnswer(data);
            }, function (error) {
                _this.sendError(error);
            });
        }
    };
    OMEPIAction.prototype.GetEpisIn = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.selectEPISUsed()).subscribe(function (data) {
                _this.sendAnswer(data);
            }, function (error) {
                _this.sendError(error);
            });
        }
    };
    OMEPIAction.prototype.Patch = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.deleteEpi()).subscribe(function (data) {
                _this.sendAnswer({
                    token: new vputils_1.VPUtils().generateGUID().toUpperCase()
                });
            }, function (error) {
                _this.sendError(error);
            });
        }
    };
    OMEPIAction.prototype.defineVisibility = function () {
        this.actionEscope = route_types_1.ActionType.atPublic;
    };
    __decorate([
        decorators_1.Post('/AddOMEPI'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], OMEPIAction.prototype, "Post", null);
    __decorate([
        decorators_1.Post('/GetOMEPI'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], OMEPIAction.prototype, "Getone", null);
    __decorate([
        decorators_1.Post('/GetOMEPINotUsed'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], OMEPIAction.prototype, "GetEpisNot", null);
    __decorate([
        decorators_1.Post('/GetOMEPIUsed'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], OMEPIAction.prototype, "GetEpisIn", null);
    __decorate([
        decorators_1.Patch('/DelOMEPI'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], OMEPIAction.prototype, "Patch", null);
    return OMEPIAction;
}(action_1.Action));
exports.OMEPIAction = OMEPIAction;
