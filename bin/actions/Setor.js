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
var SetorAction = /** @class */ (function (_super) {
    __extends(SetorAction, _super);
    function SetorAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SetorAction.prototype.validateData = function () {
        new kernel_utils_1.KernelUtils().createExceptionApiError('1001', 'Informe o Setor', this.req.body.name == '' || this.req.body.name == undefined || this.req.body.idsap == '' || this.req.body.idsap == undefined);
    };
    SetorAction.prototype.generateSQL = function () {
        return 'select * from TBSETOR where (TBSETOR.NOME = \'' + this.req.body.name + '\' AND \'' + this.req.body.name + '\' != \'' + this.req.body.namelast + '\' ) \
        OR (TBSETOR.IDSAP = \'' + this.req.body.idsap + '\' AND \'' + this.req.body.idsap + '\' != \'' + this.req.body.idsaplast + '\' ) AND STATUS = 1;';
    };
    SetorAction.prototype.generateADDSQL = function () {
        return 'select * from TBSETOR where (TBSETOR.ID = \'' + this.req.body.ID + '\') AND STATUS = 1;';
    };
    SetorAction.prototype.selectSQL = function () {
        return 'select S.ID,S.IDSAP,S.NOME, U.NOME as LIDER from TBSETOR as S inner join TBUSUARIO as U on U.ID = S.IDLIDER where S.STATUS = 1;';
    };
    SetorAction.prototype.deleteSQL = function () {
        return 'UPDATE TBSETOR SET STATUS = \'0\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    };
    SetorAction.prototype.editSQL = function () {
        return 'UPDATE TBSETOR SET NOME = \'' + this.req.body.name + '\', IDSAP = \'' + this.req.body.idsap + '\', IDLIDER = \'' + this.req.body.idlider + '\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    };
    SetorAction.prototype.insertSQL = function () {
        return 'insert into TBSETOR (TBSETOR.NOME,TBSETOR.IDSAP, TBSETOR.IDLIDER) values (\'' + this.req.body.name + '\',\'' + this.req.body.idsap + '\',\'' + this.req.body.idlider + '\');';
    };
    SetorAction.prototype.Post = function () {
        var _this = this;
        this.validateData();
        new mysql_factory_1.MySQLFactory().getConnection().select(this.generateADDSQL()).subscribe(function (data) {
            console.log(data);
            if (data.length || data.length > 0) {
                //console.log("Centro de trabalho já existe "+data);
                _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'Setor já existe'));
                return;
            }
            else {
                console.log(data);
                new mysql_factory_1.MySQLFactory().getConnection().select(_this.insertSQL()).subscribe(function (data) {
                    console.log("DEU CERTO ADD " + data);
                });
            }
            _this.sendAnswer({
                token: new vputils_1.VPUtils().generateGUID().toUpperCase()
            });
        }, function (error) {
            _this.sendError(error);
        });
    };
    SetorAction.prototype.GetSetor = function () {
        var _this = this;
        new mysql_factory_1.MySQLFactory().getConnection().select(this.selectSQL()).subscribe(function (data) {
            _this.sendAnswer(data);
        }, function (error) {
            _this.sendError(error);
        });
    };
    SetorAction.prototype.PatchCT = function () {
        var _this = this;
        //console.log("ENTROU"+this.req.body.name)
        new mysql_factory_1.MySQLFactory().getConnection().select(this.deleteSQL()).subscribe(function (data) {
            //console.log(data);
            _this.sendAnswer(data);
        }, function (error) {
            _this.sendError(error);
        });
    };
    SetorAction.prototype.EditSetor = function () {
        // new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
        //     (data : any) => {
        //         if (data.length || data.length > 0){
        //             //console.log(data);
        //           this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Novo Setor já existe'));
        //           return;
        //         }else{
        //console.log(data);
        new mysql_factory_1.MySQLFactory().getConnection().select(this.editSQL()).subscribe(function (data) {
            //  console.log(data);
        });
        //}
        this.sendAnswer({
            token: new vputils_1.VPUtils().generateGUID().toUpperCase()
        });
        //     },
        //     (error : any) => {
        //         this.sendError(error);
        //     }
        // );
    };
    SetorAction.prototype.defineVisibility = function () {
        this.actionEscope = route_types_1.ActionType.atPublic;
    };
    __decorate([
        decorators_1.Post('/AddSETOR'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], SetorAction.prototype, "Post", null);
    __decorate([
        decorators_1.Get('/GetSETOR'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], SetorAction.prototype, "GetSetor", null);
    __decorate([
        decorators_1.Post('/DelSETOR'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], SetorAction.prototype, "PatchCT", null);
    __decorate([
        decorators_1.Post('/EditSETOR'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], SetorAction.prototype, "EditSetor", null);
    return SetorAction;
}(action_1.Action));
exports.SetorAction = SetorAction;
