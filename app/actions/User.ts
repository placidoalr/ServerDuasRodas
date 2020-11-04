import { Get, Patch, Post, Put } from '../decorators';
import { Action } from '../kernel/action';
import { ActionType } from '../kernel/route-types';
import { VPUtils } from '../utils/vputils';
import { KernelUtils } from '../kernel/kernel-utils';
import { MySQLFactory } from '../mysql/mysql_factory';
import { jwts } from '../utils/jwt';

export class UserAction extends Action {

    private validateData() {
        new KernelUtils().createExceptionApiError('1001', 'Informe todos os campos corretamente', this.req.body.idsap == null || this.req.body.name == '' || this.req.body.password == '' || this.req.body.idsap == undefined || this.req.body.name == undefined || this.req.body.password == undefined || this.req.body.cdct == undefined || this.req.body.cdct == null || this.req.body.cargo == undefined || this.req.body.cargo == null || this.req.body.login == undefined || this.req.body.login == '');
    }

    private generateSQL(): string {
        return 'select ID from TBUSUARIO where TBUSUARIO.ID = \'' + this.req.body.id + '\' AND STATUS = 1;';
    }
    private generateADDSQL(): string {
        return 'select * from TBUSUARIO where (TBUSUARIO.NOME = \'' + this.req.body.name + '\' OR TBUSUARIO.IDSAP = \'' + this.req.body.idsap + '\') AND STATUS = 1;';
    }
    private insertSQL(): string {
        return 'insert into TBUSUARIO (TBUSUARIO.IDSAP ,TBUSUARIO.LOGIN, TBUSUARIO.SENHA, TBUSUARIO.CARGO, TBUSUARIO.NOME, TBUSUARIO.CDCT) values (\'' + this.req.body.idsap + '\',\'' + this.req.body.login + '\', \'' + this.req.body.password + '\', \'' + this.req.body.cargo + '\', \'' + this.req.body.name + '\', \'' + this.req.body.cdct + '\');';
    }
    private selectSQL(): string {
        return 'select TBUSUARIO.*, TBCT.NOME AS TBCTNOME, TBCARGO.NOME AS TBCARGONOME from TBUSUARIO INNER JOIN TBCT ON TBUSUARIO.CDCT = TBCT.ID INNER JOIN TBCARGO ON TBUSUARIO.CARGO = TBCARGO.ID where TBUSUARIO.STATUS = 1;';
    }
    private selectLideres(): string {
        return 'select TBUSUARIO.ID, TBUSUARIO.NOME from TBUSUARIO where TBUSUARIO.STATUS = 1 AND TBUSUARIO.CARGO = 2;';
    }
    private deleteSQL(): string {
        return 'UPDATE TBUSUARIO SET STATUS = \'0\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    }

    private editSQL(): string {

        return 'UPDATE TBUSUARIO SET NOME = \'' + this.req.body.name + '\', IDSAP = \'' + this.req.body.idsap + '\', \
        LOGIN = \'' + this.req.body.login + '\', SENHA = \'' + this.req.body.password + '\', CARGO = \'' + this.req.body.cargo + '\' \
        , CDCT = \'' + this.req.body.cdct + '\' \
        WHERE ID =  \'' + this.req.body.id + '\';';
    }


    @Post('/AddUser')
    public Post() {
        var jwtss = new jwts();

        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        } else {
            this.validateData();
            new MySQLFactory().getConnection().select(this.generateADDSQL()).subscribe(
                (data: any) => {
                    if (data.length || data.length > 0) {
                        this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Usuário já existe'));
                        return;
                    } else {
                        new MySQLFactory().getConnection().select(this.insertSQL()).subscribe(
                            (data: any) => {

                            }
                        );
                    }
                    this.sendAnswer({
                        token: new VPUtils().generateGUID().toUpperCase()
                    });
                },
                (error: any) => {
                    this.sendError(error);
                }
            );
        }
    }

    @Get('/GetUser')
    public Get() {
        var jwtss = new jwts();

        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        } else {
            new MySQLFactory().getConnection().select(this.selectSQL()).subscribe(
                (data: any) => {
                    this.sendAnswer(data);
                },
                (error: any) => {
                    this.sendError(error);
                }
            );
        }
    }
    @Get('/GetLeads')
    public GetLeads() {
        var jwtss = new jwts();

        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        } else {
            new MySQLFactory().getConnection().select(this.selectLideres()).subscribe(
                (data: any) => {
                    this.sendAnswer(data);
                },
                (error: any) => {
                    this.sendError(error);
                }
            );
        }
    }
    @Patch('/DelUser')
    public Patch() {
        var jwtss = new jwts();

        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        } else {
            new MySQLFactory().getConnection().select(this.deleteSQL()).subscribe(
                (data: any) => {
                    this.sendAnswer(data);
                },
                (error: any) => {
                    this.sendError(error);
                }
            );
        }
    }
    @Post('/EditUser')
    public Edit() {
        var jwtss = new jwts();

        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        } else {
            new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
                (data: any) => {
                    if (data.length || data.length > 0 && this.req.body.idsap != this.req.body.idsaplast) {
                        this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Usuário já existe'));
                        return;
                    } else {
                        new MySQLFactory().getConnection().select(this.editSQL()).subscribe(
                            (data: any) => {
                            }
                        );
                    }
                    this.sendAnswer({
                        token: new VPUtils().generateGUID().toUpperCase()
                    });
                },
                (error: any) => {
                    this.sendError(error);
                }
            );
        }
    }

    defineVisibility() {
        this.actionEscope = ActionType.atPublic;
    }
}