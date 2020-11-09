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
var CausaDefAction = /** @class */ (function (_super) {
    __extends(CausaDefAction, _super);
    function CausaDefAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CausaDefAction.prototype.validateData = function () {
        new kernel_utils_1.KernelUtils().createExceptionApiError('1001', 'Informe a causa do defeito', this.req.body.name == '' || this.req.body.name == undefined);
    };
    CausaDefAction.prototype.insertSQL = function () {
        return 'insert into TBCAUSADEF (TBCAUSADEF.DSCAUSA ) values (\'' + this.req.body.name + '\');';
    };
    CausaDefAction.prototype.generateSQL = function () {
        return 'select * from TBCAUSADEF where TBCAUSADEF.DSCAUSA = \'' + this.req.body.name + '\' AND STATUS = 1;';
    };
    CausaDefAction.prototype.selectSQL = function () {
        return 'select ID,DSCAUSA from TBCAUSADEF where STATUS = 1;';
    };
    CausaDefAction.prototype.deleteSQL = function () {
        return 'UPDATE TBCAUSADEF SET STATUS = \'0\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    };
    CausaDefAction.prototype.editSQL = function () {
        return 'UPDATE TBCAUSADEF SET DSCAUSA = \'' + this.req.body.name + '\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    };
    CausaDefAction.prototype.Post = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            this.validateData();
            new mysql_factory_1.MySQLFactory().getConnection().select(this.generateSQL()).subscribe(function (data) {
                if (data.length || data.length > 0) {
                    _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'Causa já existe'));
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
    CausaDefAction.prototype.Get = function () {
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
    CausaDefAction.prototype.Del = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.deleteSQL()).subscribe(function (data) {
            }, function (error) {
                _this.sendError(error);
            });
        }
    };
    CausaDefAction.prototype.Edit = function () {
        var _this = this;
        var jwtss = new jwt_1.jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        }
        else {
            new mysql_factory_1.MySQLFactory().getConnection().select(this.generateSQL()).subscribe(function (data) {
                if (data.length || data.length > 0) {
                    _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'Causa já existe'));
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
    CausaDefAction.prototype.defineVisibility = function () {
        this.actionEscope = route_types_1.ActionType.atPublic;
    };
    __decorate([
        decorators_1.Post('/AddCAUSADEF'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], CausaDefAction.prototype, "Post", null);
    __decorate([
        decorators_1.Get('/GetCAUSADEF'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], CausaDefAction.prototype, "Get", null);
    __decorate([
        decorators_1.Post('/DelCAUSADEF'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], CausaDefAction.prototype, "Del", null);
    __decorate([
        decorators_1.Post('/EditCAUSADEF'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], CausaDefAction.prototype, "Edit", null);
    return CausaDefAction;
}(action_1.Action));
exports.CausaDefAction = CausaDefAction;
