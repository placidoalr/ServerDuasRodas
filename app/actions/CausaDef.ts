import { Get, Patch, Post, Put } from '../decorators';
import { Action } from '../kernel/action';
import { ActionType } from '../kernel/route-types';
import { VPUtils } from '../utils/vputils';
import { KernelUtils } from '../kernel/kernel-utils';
import { MySQLFactory } from '../mysql/mysql_factory';
import { jwts } from '../utils/jwt';

export class CausaDefAction extends Action {

    private validateData() {
        new KernelUtils().createExceptionApiError('1001', 'Informe a causa do defeito', this.req.body.name == '' || this.req.body.name == undefined);
    }


    private insertSQL(): string {
        return 'insert into TBCAUSADEF (TBCAUSADEF.DSCAUSA ) values (\'' + this.req.body.name + '\');';
    }

    private generateSQL() {
        return 'select * from TBCAUSADEF where TBCAUSADEF.DSCAUSA = \'' + this.req.body.name + '\' AND STATUS = 1;';
    }
    private selectSQL(): string {
        return 'select ID,DSCAUSA from TBCAUSADEF where STATUS = 1;';
    }

    private deleteSQL(): string {
        return 'UPDATE TBCAUSADEF SET STATUS = \'0\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    }

    private editSQL(): string {

        return 'UPDATE TBCAUSADEF SET DSCAUSA = \'' + this.req.body.name + '\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    }

    @Post('/AddCAUSADEF')
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


                        this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Causa já existe'));
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

    @Get('/GetCAUSADEF')
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

    @Post('/DelCAUSADEF')
    public Del() {
        var jwtss = new jwts();

        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        } else {
            new MySQLFactory().getConnection().select(this.deleteSQL()).subscribe(
                (data: any) => {
                },
                (error: any) => {
                    this.sendError(error);
                }
            );
        }
    }
    @Post('/EditCAUSADEF')
    public Edit() {
        var jwtss = new jwts();

        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        } else {
            new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
                (data: any) => {
                    if (data.length || data.length > 0) {
                        this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Causa já existe'));
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






