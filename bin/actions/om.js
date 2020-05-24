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
var OMAction = /** @class */ (function (_super) {
    __extends(OMAction, _super);
    function OMAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OMAction.prototype.validateData = function () {
        new kernel_utils_1.KernelUtils().createExceptionApiError('1001', 'Informe a OM', this.req.body.idsap == '' || this.req.body.idsap == undefined);
    };
    OMAction.prototype.validateDataEquipToOM = function () {
        new kernel_utils_1.KernelUtils().createExceptionApiError('1001', 'Informe a OM', this.req.body.idequip == '' || this.req.body.idequip == undefined);
    };
    OMAction.prototype.insertSQL = function () {
        var horaatual = Date.now();
        return 'insert into TBOM (IDSAP,SOLIC,IDLAYOUT,IDCT,TPOM,CAUSADEF,DEF,DTGERACAO,OBS,PRIORIDADE,ESTADO,SETOR_ATRIB,REQUERPARADA,DT_INI_PLAN,DT_INI_PROG,DT_FIM_PLAN,DT_FIM_PROG ) values (\'' + this.req.body.idsap + '\',\'' + this.req.body.solicitante + '\',' + this.req.body.layout + ',' + this.req.body.ct + ',' + this.req.body.tipoManut + ',' + this.req.body.causa + ',\'' + this.req.body.def + '\',\'' + horaatual + '\', \'' + this.req.body.obs + '\',' + this.req.body.prior + ', 1,' + this.req.body.setor + ',\'' + this.req.body.requerParada + '\',\'' + this.req.body.dtIniPlan + '\',\'' + this.req.body.dtIniProg + '\',\'' + this.req.body.dtFimPlan + '\',\'' + this.req.body.dtFimProg + '\');';
    };
    OMAction.prototype.insertEQUIPSQL = function (equip, id) {
        return 'insert into TBEQUIP_WITH_TBOM (IDOM,IDEQUIP, OPER) values (' + id + ',' + equip.id + ',\'' + equip.oper + '\');';
    };
    OMAction.prototype.setLastID = function () {
        return 'select LAST_INSERT_ID() as id;';
    };
    OMAction.prototype.generateADDSQL = function () {
        return 'select * from TBOM where TBOM.ID = \'' + this.req.body.id + '\' AND STATUS = 1;';
    };
    OMAction.prototype.selectEquipWOM = function () {
        return 'SELECT TBEQUIP.NOME EQUIPNOME, TBEQUIP_WITH_TBOM.OPER from TBEQUIP_WITH_TBOM INNER JOIN TBEQUIP ON TBEQUIP_WITH_TBOM.IDEQUIP = TBEQUIP.ID where TBEQUIP_WITH_TBOM.IDOM = \'' + this.req.body.idom + '\';';
    };
    OMAction.prototype.generateSQL = function () {
        return 'select * from TBOM where TBOM.ID = \'' + this.req.body.id + '\'  AND STATUS = 1;';
    };
    OMAction.prototype.selectSQL = function () {
        return 'select TBOM.*,TBSETOR.NOME as TBSETORNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBSETOR ON TBOM.SETOR_ATRIB = TBSETOR.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where TBOM.ESTADO = 1 AND TBOM.STATUS = 1;';
    };
    OMAction.prototype.selectOMsBySetor = function () {
        return 'select TBOM.*,TBSETOR.NOME as TBSETORNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBSETOR ON TBOM.SETOR_ATRIB = TBSETOR.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where TBOM.ESTADO = 1 AND TBOM.SETOR_ATRIB = (SELECT ID from TBSETOR where TBSETOR.IDLIDER = ' + this.req.body.idUser + ' ) AND TBOM.STATUS = 1;';
    };
    OMAction.prototype.selectOMsAndamentoLider = function () {
        return 'select TBOM.*,TBSETOR.NOME as TBSETORNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBSETOR ON TBOM.SETOR_ATRIB = TBSETOR.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where (TBOM.ESTADO = 2 OR TBOM.ESTADO = 3) AND TBOM.SETOR_ATRIB = (SELECT ID from TBSETOR where TBSETOR.IDLIDER = ' + this.req.body.idUser + ' ) AND TBOM.STATUS = 1;';
    };
    OMAction.prototype.selectOMsFinalizadaLider = function () {
        return 'select TBOM.*,TBSETOR.NOME as TBSETORNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBSETOR ON TBOM.SETOR_ATRIB = TBSETOR.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where TBOM.ESTADO = 4 AND TBOM.SETOR_ATRIB = (SELECT ID from TBSETOR where TBSETOR.IDLIDER = ' + this.req.body.idUser + ' ) AND TBOM.STATUS = 1;';
    };
    OMAction.prototype.deleteSQL = function () {
        return 'UPDATE TBOM SET STATUS = \'0\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    };
    OMAction.prototype.editSQL = function () {
        return 'UPDATE TBOM SET IDSAP = \'' + this.req.body.idsap + '\',SOLIC = \'' + this.req.body.solicitante + '\',IDLAYOUT = ' + this.req.body.layout + ' ,IDCT = ' + this.req.body.ct + ',TPOM = ' + this.req.body.tipoManut + ',CAUSADEF = ' + this.req.body.causa + ',DEF = \'' + this.req.body.def + '\',OBS = \'' + this.req.body.obs + '\',PRIORIDADE = ' + this.req.body.prior + ',SETOR_ATRIB = ' + this.req.body.setor + ',REQUERPARADA = \'' + this.req.body.requerParada + '\',REQUERPARADA = \'' + this.req.body.dtIniPlan + '\' WHERE ID =  ' + this.req.body.id + ' AND STATUS = 1;';
    };
    OMAction.prototype.Post = function () {
        var _this = this;
        this.validateData();
        console.log(this.req.body);
        // new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
        //     (data : any) => {
        //         if (data.length || data.length > 0){
        //         this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'OM já existe'));
        //         return;
        //         }else{
        new mysql_factory_1.MySQLFactory().getConnection().select(this.insertSQL()).subscribe(function (data) {
            console.log(data.insertId);
            _this.req.body.equips.forEach(function (equip) {
                new mysql_factory_1.MySQLFactory().getConnection().select(_this.insertEQUIPSQL(equip, data.insertId)).subscribe(function (data1) {
                });
            });
        });
        // }
        this.sendAnswer({
            token: new vputils_1.VPUtils().generateGUID().toUpperCase()
        });
        //     },
        //     (error : any) => {
        //         this.sendError(error);
        //     }
        // );
    };
    OMAction.prototype.EquipWOM = function () {
        var _this = this;
        new mysql_factory_1.MySQLFactory().getConnection().select(this.selectEquipWOM()).subscribe(function (data) {
            _this.sendAnswer(data);
        }, function (error) {
            _this.sendError(error);
        });
    };
    OMAction.prototype.Get = function () {
        var _this = this;
        new mysql_factory_1.MySQLFactory().getConnection().select(this.selectSQL()).subscribe(function (data) {
            _this.sendAnswer(data);
        }, function (error) {
            _this.sendError(error);
        });
    };
    OMAction.prototype.getOMsAndamentoLider = function () {
        var _this = this;
        new mysql_factory_1.MySQLFactory().getConnection().select(this.selectOMsAndamentoLider()).subscribe(function (data) {
            _this.sendAnswer(data);
        }, function (error) {
            _this.sendError(error);
        });
    };
    OMAction.prototype.getOMsBySetor = function () {
        var _this = this;
        new mysql_factory_1.MySQLFactory().getConnection().select(this.selectOMsBySetor()).subscribe(function (data) {
            _this.sendAnswer(data);
        }, function (error) {
            _this.sendError(error);
        });
    };
    OMAction.prototype.getOMsFinalizadaLider = function () {
        var _this = this;
        new mysql_factory_1.MySQLFactory().getConnection().select(this.selectOMsFinalizadaLider()).subscribe(function (data) {
            _this.sendAnswer(data);
        }, function (error) {
            _this.sendError(error);
        });
    };
    OMAction.prototype.Get1 = function () {
        var _this = this;
        console.log(this.req.body);
        new mysql_factory_1.MySQLFactory().getConnection().select(this.generateADDSQL()).subscribe(function (data) {
            _this.sendAnswer(data);
        }, function (error) {
            _this.sendError(error);
        });
    };
    OMAction.prototype.Patch = function () {
        var _this = this;
        //console.log("ENTROU"+this.req.body.name)
        new mysql_factory_1.MySQLFactory().getConnection().select(this.deleteSQL()).subscribe(function (data) {
            //console.log(data);
            _this.sendAnswer(data);
        }, function (error) {
            _this.sendError(error);
        });
    };
    OMAction.prototype.Edit = function () {
        var _this = this;
        new mysql_factory_1.MySQLFactory().getConnection().select(this.generateSQL()).subscribe(function (data) {
            if (data.length || data.length > 0) {
                //console.log(data);
                _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'OM já existe'));
                return;
            }
            else {
                //console.log(data);
                new mysql_factory_1.MySQLFactory().getConnection().select(_this.editSQL()).subscribe(function (data) {
                    //  console.log(data);
                });
            }
            _this.sendAnswer({
                token: new vputils_1.VPUtils().generateGUID().toUpperCase()
            });
        }, function (error) {
            _this.sendError(error);
        });
    };
    OMAction.prototype.defineVisibility = function () {
        this.actionEscope = route_types_1.ActionType.atPublic;
    };
    __decorate([
        decorators_1.Post('/AddOM'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], OMAction.prototype, "Post", null);
    __decorate([
        decorators_1.Post('/GetEquipWOM'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], OMAction.prototype, "EquipWOM", null);
    __decorate([
        decorators_1.Get('/GetOM'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], OMAction.prototype, "Get", null);
    __decorate([
        decorators_1.Get('/GetOMsAndamentoLider'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], OMAction.prototype, "getOMsAndamentoLider", null);
    __decorate([
        decorators_1.Get('/GetOMsBySetor'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], OMAction.prototype, "getOMsBySetor", null);
    __decorate([
        decorators_1.Get('/GetOMsFinalizadaLider'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], OMAction.prototype, "getOMsFinalizadaLider", null);
    __decorate([
        decorators_1.Post('/GetOMUnica'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], OMAction.prototype, "Get1", null);
    __decorate([
        decorators_1.Patch('/DelOM'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], OMAction.prototype, "Patch", null);
    __decorate([
        decorators_1.Post('/EditOM'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], OMAction.prototype, "Edit", null);
    return OMAction;
}(action_1.Action));
exports.OMAction = OMAction;
