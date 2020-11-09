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
        return 'insert into TBOM (TITULO,IDSAP,SOLIC,IDLAYOUT,IDCT,TPOM,CAUSADEF,DEF,DTGERACAO,OBS,PRIORIDADE,ESTADO,LOC_INST_ATRIB,REQUERPARADA,DT_INI_PLAN,DT_INI_PROG,DT_FIM_PLAN,DT_FIM_PROG,SINTOMA) values (\'' + this.req.body.titulo + '\',\'' + this.req.body.idsap + '\',\'' + this.req.body.solicitante + '\',' + this.req.body.layout + ',' + this.req.body.ct + ',' + this.req.body.tipoManut + ',' + this.req.body.causa + ',\'' + this.req.body.def + '\',NOW(), \'' + this.req.body.obs + '\',' + this.req.body.prior + ', 1,' + this.req.body.li + ',\'' + this.req.body.requerParada + '\',\'' + this.req.body.dtIniPlan + '\',\'' + this.req.body.dtIniProg + '\',\'' + this.req.body.dtFimPlan + '\',\'' + this.req.body.dtFimProg + '\',\'' + this.req.body.sintoma + '\');';
    };
    OMAction.prototype.insertEQUIPROTA = function (equip, id) {
        return 'insert into TBEQUIP_WITH_TBOM (IDOM,IDEQUIP, OPER,MAT_UTIL,QTDE_MAT) values (' + id + ',' + equip.id + ',' + equip.oper + ',' + equip.material + ',' + equip.qtde + ');';
    };
    OMAction.prototype.insertEQUIPSQL = function (equip, id) {
        return 'insert into TBEQUIP_OM (IDOM,IDEQUIP) values (' + id + ',' + equip.id + ');';
    };
    OMAction.prototype.insertEQUIPSQLObs = function () {
        return 'update TBEQUIP_OM set Obs = \'' + this.req.body.obs + '\' where IDOM = ' + this.req.body.idOm + ' AND IDEQUIP = ' + this.req.body.idEquip + ';';
    };
    OMAction.prototype.insertOPERSQL = function (oper, id) {
        return 'insert into TBOPER_WITH_OM (IDOM, OPER) values (' + id + ',' + oper.id + ');';
    };
    OMAction.prototype.generateADDSQL = function () {
        return 'select * from TBOM where TBOM.ID = \'' + this.req.body.id + '\' AND STATUS = 1;';
    };
    OMAction.prototype.selectEquipWOMROTA = function () {
        return 'SELECT TBOPERACAO.DESC OPERDESC, u.NOME UNAME, TB_OM_DESC_ROTA.DESC,TBEQUIP.ID IDEQUIP, TBEQUIP.NOME EQUIPNOME,TBEQUIP.LOCAL,TBEQUIP.EQUIP_SUP , TBEQUIP_WITH_TBOM.OPER,TBEQUIP_WITH_TBOM.OPER_REALIZADA, TBMATERIAL.DESC MAT_UTIL, TBMATERIAL.UN_MEDIDA ,TBEQUIP_WITH_TBOM.QTDE_MAT from TBEQUIP_WITH_TBOM INNER JOIN TBEQUIP ON TBEQUIP_WITH_TBOM.IDEQUIP = TBEQUIP.ID INNER JOIN TBMATERIAL ON TBMATERIAL.ID = TBEQUIP_WITH_TBOM.MAT_UTIL LEFT JOIN TB_OM_DESC_ROTA ON TB_OM_DESC_ROTA.IDEQUIP = TBEQUIP.ID LEFT JOIN TBUSUARIO u ON u.ID = TB_OM_DESC_ROTA.IDMANUT INNER JOIN TBOPERACAO ON TBOPERACAO.ID = TBEQUIP_WITH_TBOM.OPER  where TBEQUIP_WITH_TBOM.IDOM = \'' + this.req.body.idom + '\';';
    };
    OMAction.prototype.selectEquipWOM = function () {
        return 'SELECT TBEQUIP.ID IDEQUIP,TBEQUIP.NOME EQUIPNOME,TBEQUIP.LOCAL,TBEQUIP.EQUIP_SUP, TBLOC_INST.NOME LI, TBEQUIP_OM.OPER_REALIZADA, TBEQUIP_OM.Obs OBS from TBEQUIP_OM INNER JOIN TBEQUIP ON TBEQUIP_OM.IDEQUIP = TBEQUIP.ID INNER JOIN TBLOC_INST ON TBLOC_INST.ID = TBEQUIP.LOC_INST_ATRIB where TBEQUIP_OM.IDOM = \'' + this.req.body.idom + '\';';
    };
    OMAction.prototype.selectMATWOM = function () {
        return 'SELECT TBMATERIAL.DESC MATDESC,TBLOC_INST.NOME LI,TBMATERIAL.UN_MEDIDA MATMEDIDA, TBMAT_WITH_OM.QTDE from TBMAT_WITH_OM INNER JOIN TBMATERIAL ON TBMAT_WITH_OM.IDMAT = TBMATERIAL.ID INNER JOIN TBLOC_INST ON TBLOC_INST.ID = TBEQUIP.LOC_INST_ATRIB where TBMAT_WITH_OM.IDOM = \'' + this.req.body.idom + '\';';
    };
    OMAction.prototype.selectOPERWOM = function () {
        return 'SELECT TBOPERACAO.DESC OPERDESC,TBOPERACAO.IDSAP  from TBOPER_WITH_OM INNER JOIN TBOPERACAO ON TBOPER_WITH_OM.OPER = TBOPERACAO.ID where TBOPER_WITH_OM.IDOM = \'' + this.req.body.idom + '\';';
    };
    OMAction.prototype.generateSQL = function () {
        return 'select * from TBOM where TBOM.ID = \'' + this.req.body.id + '\'  AND STATUS = 1;';
    };
    OMAction.prototype.selectSQL = function () {
        if (this.req.body.timein != undefined && this.req.body.timeout != undefined && this.req.body.li != undefined) {
            return 'select TBOM.*, TBSINTOMA.NOME as SINTOMANOME,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME, TBLAYOUTOM.IDESTILO AS ESTILO,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBSINTOMA ON TBOM.SINTOMA = TBSINTOMA.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where TBOM.ESTADO = 1 AND TBOM.STATUS = 1  AND TBOM.DTGERACAO >= ' + this.req.body.timein + ' AND TBOM.DTGERACAO <= ' + this.req.body.timeout + ' AND TBOM.LOC_INST_ATRIB = ' + this.req.body.li + ';';
        }
        else {
            return 'select TBOM.*, TBSINTOMA.NOME as SINTOMANOME,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME, TBLAYOUTOM.IDESTILO AS ESTILO, TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBSINTOMA ON TBOM.SINTOMA = TBSINTOMA.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where TBOM.ESTADO = 1 AND TBOM.STATUS = 1 LIMIT 100;';
        }
    };
    OMAction.prototype.selectOMsBySetor = function () {
        if (this.req.body.timein != undefined && this.req.body.timeout != undefined) {
            return 'select TBOM.*, TBSINTOMA.NOME as SINTOMANOME,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME, TBLAYOUTOM.IDESTILO AS ESTILO, TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBSINTOMA ON TBOM.SINTOMA = TBSINTOMA.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where TBOM.ESTADO = 1 AND TBOM.LOC_INST_ATRIB = (SELECT ID from TBLOC_INST where TBLOC_INST.IDLIDER = ' + this.req.body.idUser + ' ) AND TBOM.DTGERACAO >= ' + this.req.body.timein + ' AND TBOM.DTGERACAO <= ' + this.req.body.timeout + ' AND TBOM.STATUS = 1;';
        }
        else {
            return 'select TBOM.*, TBSINTOMA.NOME as SINTOMANOME,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME, TBLAYOUTOM.IDESTILO AS ESTILO, TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBSINTOMA ON TBOM.SINTOMA = TBSINTOMA.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where TBOM.ESTADO = 1 AND TBOM.LOC_INST_ATRIB = (SELECT ID from TBLOC_INST where TBLOC_INST.IDLIDER = ' + this.req.body.idUser + ' ) AND TBOM.STATUS = 1 LIMIT 100;';
        }
    };
    OMAction.prototype.selectOMsAndamentoLider = function () {
        if (this.req.body.timein != undefined && this.req.body.timeout != undefined) {
            return 'select TBOM.*, TBSINTOMA.NOME as SINTOMANOME,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME, TBLAYOUTOM.IDESTILO AS ESTILO, TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBSINTOMA ON TBOM.SINTOMA = TBSINTOMA.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where (TBOM.ESTADO = 2 OR TBOM.ESTADO = 3) AND TBOM.LOC_INST_ATRIB = (SELECT ID from TBLOC_INST where TBLOC_INST.IDLIDER = ' + this.req.body.idUser + ' ) AND TBOM.DTGERACAO >= ' + this.req.body.timein + ' AND TBOM.DTGERACAO <= ' + this.req.body.timeout + ' AND TBOM.STATUS = 1;';
        }
        else {
            return 'select TBOM.*, TBSINTOMA.NOME as SINTOMANOME,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME, TBLAYOUTOM.IDESTILO AS ESTILO, TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBSINTOMA ON TBOM.SINTOMA = TBSINTOMA.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where (TBOM.ESTADO = 2 OR TBOM.ESTADO = 3) AND TBOM.LOC_INST_ATRIB = (SELECT ID from TBLOC_INST where TBLOC_INST.IDLIDER = ' + this.req.body.idUser + ' ) AND TBOM.STATUS = 1 LIMIT 100;';
        }
    };
    OMAction.prototype.selectOMsFinalizadaLider = function () {
        if (this.req.body.timein != undefined && this.req.body.timeout != undefined) {
            return 'select TBOM.*, TBSINTOMA.NOME as SINTOMANOME,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME, TBLAYOUTOM.IDESTILO AS ESTILO, TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBSINTOMA ON TBOM.SINTOMA = TBSINTOMA.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where TBOM.ESTADO = 4 AND TBOM.LOC_INST_ATRIB = (SELECT ID from TBLOC_INST where TBLOC_INST.IDLIDER = ' + this.req.body.idUser + ' ) AND TBOM.DTGERACAO >= ' + this.req.body.timein + ' AND TBOM.DTGERACAO <= ' + this.req.body.timeout + ' AND TBOM.STATUS = 1;';
        }
        else {
            return 'select TBOM.*, TBSINTOMA.NOME as SINTOMANOME,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME, TBLAYOUTOM.IDESTILO AS ESTILO, TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBSINTOMA ON TBOM.SINTOMA = TBSINTOMA.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where TBOM.ESTADO = 4 AND TBOM.LOC_INST_ATRIB = (SELECT ID from TBLOC_INST where TBLOC_INST.IDLIDER = ' + this.req.body.idUser + ' ) AND TBOM.STATUS = 1 LIMIT 100;';
        }
    };
    OMAction.prototype.selectOMsAndamentoADM = function () {
        if (this.req.body.timein != undefined && this.req.body.timeout != undefined && this.req.body.li != undefined) {
            return 'select TBOM.*, TBSINTOMA.NOME as SINTOMANOME,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME, TBLAYOUTOM.IDESTILO AS ESTILO, TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBSINTOMA ON TBOM.SINTOMA = TBSINTOMA.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where (TBOM.ESTADO = 2 OR TBOM.ESTADO = 3 OR TBOM.ESTADO = 4)  AND TBOM.STATUS = 1  AND TBOM.DTGERACAO >= ' + this.req.body.timein + ' AND TBOM.DTGERACAO <= ' + this.req.body.timeout + ' AND TBOM.LOC_INST_ATRIB = ' + this.req.body.li + ';';
        }
        else {
            return 'select TBOM.*, TBSINTOMA.NOME as SINTOMANOME,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME, TBLAYOUTOM.IDESTILO AS ESTILO, TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBSINTOMA ON TBOM.SINTOMA = TBSINTOMA.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where (TBOM.ESTADO = 2 OR TBOM.ESTADO = 3 OR TBOM.ESTADO = 4)  AND TBOM.STATUS = 1 LIMIT 100;';
        }
    };
    OMAction.prototype.selectOMsFinalizadaADM = function () {
        if (this.req.body.timein != undefined && this.req.body.timeout != undefined && this.req.body.li != undefined) {
            return 'select TBOM.*, TBSINTOMA.NOME as SINTOMANOME,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME, TBLAYOUTOM.IDESTILO AS ESTILO, TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBSINTOMA ON TBOM.SINTOMA = TBSINTOMA.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where TBOM.ESTADO = 5  AND TBOM.STATUS = 1  AND TBOM.DTGERACAO >= ' + this.req.body.timein + ' AND TBOM.DTGERACAO <= ' + this.req.body.timeout + ' AND TBOM.LOC_INST_ATRIB = ' + this.req.body.li + ';';
        }
        else {
            return 'select TBOM.*, TBSINTOMA.NOME as SINTOMANOME,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME, TBLAYOUTOM.IDESTILO AS ESTILO, TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBSINTOMA ON TBOM.SINTOMA = TBSINTOMA.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where TBOM.ESTADO = 5  AND TBOM.STATUS = 1 LIMIT 100;';
        }
    };
    OMAction.prototype.deleteSQL = function () {
        return 'UPDATE TBOM SET STATUS = \'0\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    };
    OMAction.prototype.editSQL = function () {
        return 'UPDATE TBOM SET IDSAP = \'' + this.req.body.idsap + '\',SOLIC = \'' + this.req.body.solicitante + '\',IDLAYOUT = ' + this.req.body.layout + ' ,IDCT = ' + this.req.body.ct + ',TPOM = ' + this.req.body.tipoManut + ',CAUSADEF = ' + this.req.body.causa + ',DEF = \'' + this.req.body.def + '\',OBS = \'' + this.req.body.obs + '\',PRIORIDADE = ' + this.req.body.prior + ',LOC_INST_ATRIB = ' + this.req.body.li + ',REQUERPARADA = \'' + this.req.body.requerParada + '\',REQUERPARADA = \'' + this.req.body.dtIniPlan + '\',SINTOMA = \'' + this.req.body.sintoma + '\' WHERE ID =  ' + this.req.body.id + ' AND STATUS = 1;';
    };
    OMAction.prototype.Post = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            this.validateData();
            new mysql_factory_1.MySQLFactory().getConnection().select(this.insertSQL()).subscribe(function (data) {
                if (_this.req.body.layout == 2) {
                    if (_this.req.body.equips) {
                        _this.req.body.equips.forEach(function (equip) {
                            new mysql_factory_1.MySQLFactory().getConnection().select(_this.insertEQUIPROTA(equip, data.insertId)).subscribe(function (data1) {
                            });
                        });
                    }
                }
                else {
                    if (_this.req.body.equips) {
                        _this.req.body.equips.forEach(function (equip) {
                            new mysql_factory_1.MySQLFactory().getConnection().select(_this.insertEQUIPSQL(equip, data.insertId)).subscribe(function (data1) {
                            });
                        });
                    }
                    if (_this.req.body.opers) {
                        _this.req.body.opers.forEach(function (oper) {
                            new mysql_factory_1.MySQLFactory().getConnection().select(_this.insertOPERSQL(oper, data.insertId)).subscribe(function (data1) {
                            });
                        });
                    }
                }
            });
            this.sendAnswer({
                token: new vputils_1.VPUtils().generateGUID().toUpperCase()
            });
        }
    };
    OMAction.prototype.EquipWOMROTA = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.selectEquipWOMROTA()).subscribe(function (data) {
                _this.sendAnswer(data);
            }, function (error) {
                _this.sendError(error);
            });
        }
    };
    OMAction.prototype.EquipWOM = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.selectEquipWOM()).subscribe(function (data) {
                _this.sendAnswer(data);
            }, function (error) {
                _this.sendError(error);
            });
        }
    };
    OMAction.prototype.MatWOM = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.selectMATWOM()).subscribe(function (data) {
                _this.sendAnswer(data);
            }, function (error) {
                _this.sendError(error);
            });
        }
    };
    OMAction.prototype.OperWOM = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.selectOPERWOM()).subscribe(function (data) {
                _this.sendAnswer(data);
            }, function (error) {
                _this.sendError(error);
            });
        }
    };
    OMAction.prototype.Get = function () {
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
    OMAction.prototype.getOMsFinalizadaADM = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.selectOMsFinalizadaADM()).subscribe(function (data) {
                _this.sendAnswer(data);
            }, function (error) {
                _this.sendError(error);
            });
        }
    };
    OMAction.prototype.getOMsAndamentoLider = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.selectOMsAndamentoLider()).subscribe(function (data) {
                _this.sendAnswer(data);
            }, function (error) {
                _this.sendError(error);
            });
        }
    };
    OMAction.prototype.getOMsAndamentoADM = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.selectOMsAndamentoADM()).subscribe(function (data) {
                _this.sendAnswer(data);
            }, function (error) {
                _this.sendError(error);
            });
        }
    };
    OMAction.prototype.getOMsBySetor = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.selectOMsBySetor()).subscribe(function (data) {
                _this.sendAnswer(data);
            }, function (error) {
                _this.sendError(error);
            });
        }
    };
    OMAction.prototype.getOMsFinalizadaLider = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.selectOMsFinalizadaLider()).subscribe(function (data) {
                _this.sendAnswer(data);
            }, function (error) {
                _this.sendError(error);
            });
        }
    };
    OMAction.prototype.Get1 = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.generateADDSQL()).subscribe(function (data) {
                _this.sendAnswer(data);
            }, function (error) {
                _this.sendError(error);
            });
        }
    };
    OMAction.prototype.Patch = function () {
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
    OMAction.prototype.Edit = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.generateSQL()).subscribe(function (data) {
                if (data.length || data.length > 0) {
                    _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'OM já existe'));
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
    OMAction.prototype.EditObsEquipLista = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.insertEQUIPSQLObs()).subscribe(function (data) {
                _this.sendAnswer({
                    token: new vputils_1.VPUtils().generateGUID().toUpperCase()
                });
            }, function (error) {
                _this.sendError(error);
            });
        }
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
        decorators_1.Post('/GetEquipWOMROTA'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], OMAction.prototype, "EquipWOMROTA", null);
    __decorate([
        decorators_1.Post('/GetEquipWOM'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], OMAction.prototype, "EquipWOM", null);
    __decorate([
        decorators_1.Post('/GetMatWOM'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], OMAction.prototype, "MatWOM", null);
    __decorate([
        decorators_1.Post('/GetOperWOM'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], OMAction.prototype, "OperWOM", null);
    __decorate([
        decorators_1.Get('/GetOM'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], OMAction.prototype, "Get", null);
    __decorate([
        decorators_1.Get('/GetOMsFinalizadaADM'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], OMAction.prototype, "getOMsFinalizadaADM", null);
    __decorate([
        decorators_1.Post('/GetOMsAndamentoLider'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], OMAction.prototype, "getOMsAndamentoLider", null);
    __decorate([
        decorators_1.Get('/GetOMsAndamentoADM'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], OMAction.prototype, "getOMsAndamentoADM", null);
    __decorate([
        decorators_1.Post('/GetOMsBySetor'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], OMAction.prototype, "getOMsBySetor", null);
    __decorate([
        decorators_1.Post('/GetOMsFinalizadaLider'),
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
    __decorate([
        decorators_1.Post('/EditObsEquipLista'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], OMAction.prototype, "EditObsEquipLista", null);
    return OMAction;
}(action_1.Action));
exports.OMAction = OMAction;
