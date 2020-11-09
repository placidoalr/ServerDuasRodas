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
var LayoutAction = /** @class */ (function (_super) {
    __extends(LayoutAction, _super);
    function LayoutAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LayoutAction.prototype.validateData = function () {
        new kernel_utils_1.KernelUtils().createExceptionApiError('1001', 'Informe o Layout', this.req.body.name == '' || this.req.body.name == undefined || this.req.body.layout == '' || this.req.body.layout == undefined);
    };
    LayoutAction.prototype.generateSQL = function () {
        return 'select ID from TBLAYOUTOM where (TBLAYOUTOM.NOME = \'' + this.req.body.name + '\') \
         AND STATUS = 1;';
    };
    LayoutAction.prototype.generateADDSQL = function () {
        return 'select * from TBLAYOUTOM where TBLAYOUTOM.ID = \'' + this.req.body.id + '\'  AND STATUS = 1;';
    };
    LayoutAction.prototype.insertSQL = function () {
        return 'insert into TBLAYOUTOM (TBLAYOUTOM.NOME, TBLAYOUTOM.IDESTILO ) values (\'' + this.req.body.name + '\',' + this.req.body.layout + ');';
    };
    LayoutAction.prototype.selectSQL = function () {
        return 'select TBLAYOUTOM.*,TBESTILOLAYOUT.NOME as ESTILONOME from TBLAYOUTOM INNER JOIN TBESTILOLAYOUT ON TBLAYOUTOM.IDESTILO = TBESTILOLAYOUT.ID  where status = 1';
    };
    LayoutAction.prototype.selectSQLEstilo = function () {
        return 'select ID,NOME from TBESTILOLAYOUT';
    };
    LayoutAction.prototype.deleteSQL = function () {
        return 'UPDATE TBLAYOUTOM SET STATUS = \'0\' WHERE ID =  \'' + this.req.body.id + '\';';
    };
    LayoutAction.prototype.editSQL = function () {
        return 'UPDATE TBLAYOUTOM SET NOME  = \'' + this.req.body.name + '\', IDESTILO  = \'' + this.req.body.layout + '\' WHERE ID = \'' + this.req.body.id + '\' AND STATUS = 1 ;';
    };
    LayoutAction.prototype.Post = function () {
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
                    _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'Layout já existe'));
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
    LayoutAction.prototype.Get = function () {
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
    LayoutAction.prototype.GetEstilo = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.selectSQLEstilo()).subscribe(function (data) {
                _this.sendAnswer(data);
            }, function (error) {
                _this.sendError(error);
            });
        }
    };
    LayoutAction.prototype.Patch = function () {
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
    LayoutAction.prototype.Edit = function () {
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.editSQL()).subscribe(function (data) {
            });
            this.sendAnswer({
                token: new vputils_1.VPUtils().generateGUID().toUpperCase()
            });
        }
    };
    LayoutAction.prototype.defineVisibility = function () {
        this.actionEscope = route_types_1.ActionType.atPublic;
    };
    __decorate([
        decorators_1.Post('/AddLAYOUTOM'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], LayoutAction.prototype, "Post", null);
    __decorate([
        decorators_1.Get('/GetLAYOUTOM'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], LayoutAction.prototype, "Get", null);
    __decorate([
        decorators_1.Get('/GetESTILO'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], LayoutAction.prototype, "GetEstilo", null);
    __decorate([
        decorators_1.Post('/DelLAYOUTOM'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], LayoutAction.prototype, "Patch", null);
    __decorate([
        decorators_1.Post('/EditLAYOUTOM'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], LayoutAction.prototype, "Edit", null);
    return LayoutAction;
}(action_1.Action));
exports.LayoutAction = LayoutAction;
