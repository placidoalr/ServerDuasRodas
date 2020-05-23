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
var OMEPIAction = /** @class */ (function (_super) {
    __extends(OMEPIAction, _super);
    function OMEPIAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OMEPIAction.prototype.validateData = function () {
        new kernel_utils_1.KernelUtils().createExceptionApiError('1001', 'Informe o ID do Manutentor e ID da Ordem de manutenção', this.req.body.idEpi == '' || this.req.body.idEpi == undefined || this.req.body.idOm == '' || this.req.body.idOm == undefined);
    };
    OMEPIAction.prototype.insertSQL = function () {
        return 'insert into TBEPI_WITH_TBOM (TBEPI_WITH_TBOM.IDEPI, TBUSUARIO_WITH_TBOM.IDOM) values (\'' + this.req.body.idEpi + '\',\'' + this.req.body.idOm + '\');';
    };
    OMEPIAction.prototype.generateSQL = function () {
        return 'select * from TBEPI_WITH_TBOM where TBEPI_WITH_TBOM.IDEPI = \'' + this.req.body.idEpi + '\' AND TBEPI_WITH_TBOM.IDOM = \'' + this.req.body.idOm + '\' AND STATUS = 1;';
    };
    OMEPIAction.prototype.selectSQL = function () {
        return 'select TBEPI.ID,TBEPI.NOME from TBEPI INNER JOIN TBEPI_WITH_TBOM on TBEPI_WITH_TBOM.IDEPI = TBEPI.ID where TBEPI_WITH_TBOM.IDOM = \'' + this.req.body.idOm + '\';';
    };
    OMEPIAction.prototype.Post = function () {
        var _this = this;
        this.validateData();
        new mysql_factory_1.MySQLFactory().getConnection().select(this.generateSQL()).subscribe(function (data) {
            if (data.length || data.length > 0) {
                _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'Vínculo já existe'));
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
    OMEPIAction.prototype.Getone = function () {
        var _this = this;
        new mysql_factory_1.MySQLFactory().getConnection().select(this.selectSQL()).subscribe(function (data) {
            _this.sendAnswer(data);
        }, function (error) {
            _this.sendError(error);
        });
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
    return OMEPIAction;
}(action_1.Action));
exports.OMEPIAction = OMEPIAction;