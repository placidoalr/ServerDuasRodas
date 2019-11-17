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
var EquipAction = /** @class */ (function (_super) {
    __extends(EquipAction, _super);
    function EquipAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EquipAction.prototype.validateData = function () {
        new kernel_utils_1.KernelUtils().createExceptionApiError('1001', 'Informe o nome e setor do Equipamento', this.req.body.name == '' || this.req.body.setor == '' || this.req.body.setor == undefined || this.req.body.name == undefined
            || this.req.body.codEquip == '' || this.req.body.codEquip == undefined);
    };
    EquipAction.prototype.generateSQL = function () {
        return 'select * from TBEQUIP where (TBEQUIP.NOME = \'' + this.req.body.name + '\' ) \
        OR (' + this.req.body.codigo + ' != ' + this.req.body.codigolast + ' AND TBEQUIP.CODEQUIP = ' + this.req.body.codigo + ') AND STATUS = 1;';
    };
    EquipAction.prototype.generateADDSQL = function () {
        return 'select * from TBEQUIP where TBEQUIP.CODEQUIP = \'' + this.req.body.codigo + '\' OR TBEQUIP.NOME = ' + this.req.body.name + ' AND STATUS = 1;';
    };
    EquipAction.prototype.insertSQL = function () {
        return 'insert into TBEQUIP (TBEQUIP.CODEQUIP ,TBEQUIP.NOME, TBEQUIP.SETOR_ATRIB) values (\'' + this.req.body.codigo + '\',\'' + this.req.body.name + '\', \'' + this.req.body.setor + '\');';
    };
    EquipAction.prototype.selectSQL = function () {
        return 'select * from TBEQUIP where STATUS = 1;';
    };
    EquipAction.prototype.deleteSQL = function () {
        return 'UPDATE TBEQUIP SET STATUS = \'0\' WHERE IDSAP =  \'' + this.req.body.idsap + '\';';
    };
    EquipAction.prototype.editSQL = function () {
        return 'UPDATE TBEQUIP SET NOME = \'' + this.req.body.name + '\', CODEQUIP = \'' + this.req.body.codigo + '\', \
        SETOR_ATRIB = \'' + this.req.body.setor + '\' WHERE CODEQUIP =  \'' + this.req.body.codigolast + '\';';
    };
    EquipAction.prototype.Post = function () {
        var _this = this;
        this.validateData();
        new mysql_factory_1.MySQLFactory().getConnection().select(this.generateADDSQL()).subscribe(function (data) {
            if (data.length || data.length > 0) {
                _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'Equipamento já existe'));
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
    };
    EquipAction.prototype.Get = function () {
        var _this = this;
        new mysql_factory_1.MySQLFactory().getConnection().select(this.selectSQL()).subscribe(function (data) {
            _this.sendAnswer(data);
        }, function (error) {
            _this.sendError(error);
        });
    };
    EquipAction.prototype.Patch = function () {
        var _this = this;
        //console.log("ENTROU"+this.req.body.name)
        new mysql_factory_1.MySQLFactory().getConnection().select(this.deleteSQL()).subscribe(function (data) {
            //console.log(data);
            _this.sendAnswer(data);
        }, function (error) {
            _this.sendError(error);
        });
    };
    EquipAction.prototype.Edit = function () {
        var _this = this;
        new mysql_factory_1.MySQLFactory().getConnection().select(this.generateSQL()).subscribe(function (data) {
            if (data.length || data.length > 0) {
                //console.log(data);
                _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'Equipamento já existe'));
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
    EquipAction.prototype.defineVisibility = function () {
        this.actionEscope = route_types_1.ActionType.atPublic;
    };
    __decorate([
        decorators_1.Post('/AddEquip'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], EquipAction.prototype, "Post", null);
    __decorate([
        decorators_1.Get('/GetEquip'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], EquipAction.prototype, "Get", null);
    __decorate([
        decorators_1.Patch('/DelEquip'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], EquipAction.prototype, "Patch", null);
    __decorate([
        decorators_1.Post('/EditEquip'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], EquipAction.prototype, "Edit", null);
    return EquipAction;
}(action_1.Action));
exports.EquipAction = EquipAction;
