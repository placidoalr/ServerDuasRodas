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
var UserAction = /** @class */ (function (_super) {
    __extends(UserAction, _super);
    function UserAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserAction.prototype.validateData = function () {
        new kernel_utils_1.KernelUtils().createExceptionApiError('1001', 'Informe todos os campos corretamente', this.req.body.idsap == null || this.req.body.name == '' || this.req.body.password == '' || this.req.body.idsap == undefined || this.req.body.name == undefined || this.req.body.password == undefined || this.req.body.cdct == undefined || this.req.body.cdct == null || this.req.body.cargo == undefined || this.req.body.cargo == null || this.req.body.login == undefined || this.req.body.login == '');
    };
    UserAction.prototype.generateSQL = function () {
        return 'select ID from TBUSUARIO where (TBUSUARIO.LOGIN = \'' + this.req.body.login + '\' OR TBUSUARIO.IDSAP = ' + this.req.body.idsap + ') AND TBUSUARIO.IDSAP != ' + this.req.body.idsaplast + ';';
    };
    UserAction.prototype.insertSQL = function () {
        return 'insert into TBUSUARIO (TBUSUARIO.IDSAP ,TBUSUARIO.LOGIN, TBUSUARIO.SENHA, TBUSUARIO.CARGO, TBUSUARIO.NOME, TBUSUARIO.CDCT) values (\'' + this.req.body.idsap + '\',\'' + this.req.body.login + '\', \'' + this.req.body.password + '\', \'' + this.req.body.cargo + '\', \'' + this.req.body.name + '\', \'' + this.req.body.cdct + '\');';
    };
    UserAction.prototype.selectSQL = function () {
        return 'select IDSAP,NOME,LOGIN,SENHA,CARGO,CDCT from TBUSUARIO where STATUS = 1;';
    };
    UserAction.prototype.deleteSQL = function () {
        return 'UPDATE TBUSUARIO SET STATUS = \'0\' WHERE IDSAP =  \'' + this.req.body.idsap + '\';';
    };
    UserAction.prototype.editSQL = function () {
        return 'UPDATE TBUSUARIO SET NOME = \'' + this.req.body.name + '\', IDSAP = \'' + this.req.body.idsap + '\', \
        LOGIN = \'' + this.req.body.login + '\', SENHA = \'' + this.req.body.password + '\', CARGO = \'' + this.req.body.cargo + '\' \
        , CDCT = \'' + this.req.body.cdct + '\' \
        WHERE IDSAP =  \'' + this.req.body.idsaplast + '\';';
    };
    UserAction.prototype.Post = function () {
        var _this = this;
        this.validateData();
        new mysql_factory_1.MySQLFactory().getConnection().select(this.generateSQL()).subscribe(function (data) {
            if (data.length || data.length > 0) {
                console.log(data);
                _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'Usuário já existe'));
                return;
            }
            else {
                console.log(data);
                new mysql_factory_1.MySQLFactory().getConnection().select(_this.insertSQL()).subscribe(function (data) {
                    console.log(data);
                });
            }
            _this.sendAnswer({
                token: new vputils_1.VPUtils().generateGUID().toUpperCase()
            });
        }, function (error) {
            _this.sendError(error);
        });
    };
    UserAction.prototype.Get = function () {
        var _this = this;
        new mysql_factory_1.MySQLFactory().getConnection().select(this.selectSQL()).subscribe(function (data) {
            _this.sendAnswer(data);
        }, function (error) {
            _this.sendError(error);
        });
    };
    UserAction.prototype.Patch = function () {
        var _this = this;
        //console.log("ENTROU"+this.req.body.name)
        new mysql_factory_1.MySQLFactory().getConnection().select(this.deleteSQL()).subscribe(function (data) {
            //console.log(data);
            _this.sendAnswer(data);
        }, function (error) {
            _this.sendError(error);
        });
    };
    UserAction.prototype.Edit = function () {
        var _this = this;
        new mysql_factory_1.MySQLFactory().getConnection().select(this.generateSQL()).subscribe(function (data) {
            if (data.length || data.length > 0 && _this.req.body.idsap != _this.req.body.idsaplast) {
                //console.log(data);
                _this.sendError(new kernel_utils_1.KernelUtils().createErrorApiObject(401, '1001', 'Usuário de trabalho já existe'));
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
    UserAction.prototype.defineVisibility = function () {
        this.actionEscope = route_types_1.ActionType.atPublic;
    };
    __decorate([
        decorators_1.Post('/AddUSER'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], UserAction.prototype, "Post", null);
    __decorate([
        decorators_1.Get('/GetUSER'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], UserAction.prototype, "Get", null);
    __decorate([
        decorators_1.Patch('/DelUSER'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], UserAction.prototype, "Patch", null);
    __decorate([
        decorators_1.Post('/EditUSER'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], UserAction.prototype, "Edit", null);
    return UserAction;
}(action_1.Action));
exports.UserAction = UserAction;
/*

export class CTAction extends Action{
    private validateData(){
        new KernelUtils().createExceptionApiError('1001', 'Informe o nome do Centro de Trabalho', this.req.body.name == '' || this.req.body.name == undefined);
    }

    private selectSQL() : string {
        return 'select NOME from TBCT where STATUS = 1;';
    }

    private deleteSQL() : string {
        return 'UPDATE TBCT SET STATUS = \'0\' WHERE NOME =  \'' + this.req.body.name + '\';';
    }

    private editSQL() : string {
        
        return 'UPDATE TBCT SET NOME = \'' + this.req.body.name + '\' WHERE NOME =  \'' + this.req.body.namelast + '\';';
    }


    private insertSQL() : string{
        return 'insert into TBCT (TBCT.NOME ) values (\''+ this.req.body.name+'\');';
    }

    @Post('/AddCT')
    public Post(){
        this.validateData();

        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
            (data : any) => {
                if (data.length || data.length > 0){
                    //console.log("Centro de trabalho já existe "+data);
                  this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Centro de trabalho já existe'));
                  return;
                }else{
                    //console.log(data);
                    new MySQLFactory().getConnection().select(this.insertSQL()).subscribe(
                        (data : any) => {
                            //console.log("DEU CERTO ADD "+data);
                        }
                    );
                }
                this.sendAnswer({
                    token    : new VPUtils().generateGUID().toUpperCase()
                });
            },
            (error : any) => {
                this.sendError(error);
            }
        );
    }

    @Get('/GetCT')
    public GetCT(){
        
        new MySQLFactory().getConnection().select(this.selectSQL()).subscribe(
            (data : any) => {
                this.sendAnswer(data);
            },
            (error : any) => {
                this.sendError(error);
            }
        );
    }

    @Patch('/DelCT')
    public PatchCT(){
        //console.log("ENTROU"+this.req.body.name)
        new MySQLFactory().getConnection().select(this.deleteSQL()).subscribe(
            (data : any) => {
                //console.log(data);
                this.sendAnswer(data);
            },
            (error : any) => {
                this.sendError(error);
            }
        );
}
@Post('/EditCT')
    public EditCT(){

        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
            (data : any) => {
                if (data.length || data.length > 0){
                    //console.log(data);
                  this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Novo centro de trabalho já existe'));
                  return;
                }else{
                    //console.log(data);
                    new MySQLFactory().getConnection().select(this.editSQL()).subscribe(
                        (data : any) => {
                          //  console.log(data);
                        }
                    );
                }
                this.sendAnswer({
                    token    : new VPUtils().generateGUID().toUpperCase()
                });
            },
            (error : any) => {
                this.sendError(error);
            }
        );
    
}

    defineVisibility() {
        this.actionEscope = ActionType.atPublic;
    }
}
*/ 
