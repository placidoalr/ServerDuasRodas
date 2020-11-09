import { Get, Patch, Post, Put } from '../decorators';
import { Action } from '../kernel/action';
import { ActionType } from '../kernel/route-types';
import { VPUtils } from '../utils/vputils';
import { KernelUtils } from '../kernel/kernel-utils';
import { MySQLFactory } from '../mysql/mysql_factory';
import { jwts } from '../utils/jwt';

export class SintomaAction extends Action {

    private validateData() {
        new KernelUtils().createExceptionApiError('1001', 'Informe o Sintoma', this.req.body.name == '' || this.req.body.name == undefined);
    }


    private insertSQL(): string {
        return 'insert into TBSINTOMA (TBSINTOMA.NOME) values (\'' + this.req.body.name + '\');';
    }

    private generateSQL() {
        return 'select * from TBSINTOMA where TBSINTOMA.ID = \'' + this.req.body.name + '\' AND STATUS = 1;';
    }
    private selectSQL(): string {
        return 'select ID,NOME from TBSINTOMA where STATUS = 1;';
    }

    private deleteSQL(): string {
        return 'UPDATE TBSINTOMA SET STATUS = \'0\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    }

    private editSQL(): string {

        return 'UPDATE TBSINTOMA SET NOME = \'' + this.req.body.name + '\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    }

    @Post('/AddSINTOMA')
    public Post() {
        var jwtss = new jwts();

        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        } else {
            this.validateData();

            new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
                (data: any) => {
                    if (data.length || data.length > 0) {


                        this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Sintoma já existe'));
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

    @Get('/GetSINTOMA')
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

    @Patch('/DelSINTOMA')
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
    @Post('/EditSINTOMA')
    public Edit() {
        var jwtss = new jwts();

        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        } else {
            new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
                (data: any) => {
                    if (data.length || data.length > 0) {
                        this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Sintoma já existe'));
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




