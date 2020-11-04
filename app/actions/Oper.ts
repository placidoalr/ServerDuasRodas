import { Get, Patch, Post, Put } from '../decorators';
import { Action } from '../kernel/action';
import { ActionType } from '../kernel/route-types';
import { VPUtils } from '../utils/vputils';
import { KernelUtils } from '../kernel/kernel-utils';
import { MySQL } from '../mysql/mysql';
import { MySQLFactory } from '../mysql/mysql_factory';
import { jwts } from '../utils/jwt';

export class OperAction extends Action {
    private validateData() {
        new KernelUtils().createExceptionApiError('1001', 'Informe o nome da Operação', this.req.body.desc == '' || this.req.body.desc == undefined);
    }

    private generateSQL() {
        return 'select * from TBOPERACAO where TBOPERACAO.DESC = \'' + this.req.body.desc + '\' AND STATUS = 1;';
    }
    private selectSQL(): string {
        return 'select TBOPERACAO.ID,TBOPERACAO.DESC,TBOPERACAO.IDSAP from TBOPERACAO where STATUS = 1;';
    }

    private deleteSQL(): string {
        return 'UPDATE TBOPERACAO SET STATUS = \'0\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    }

    private insertSQL(): string {
        return 'insert into TBOPERACAO (TBOPERACAO.DESC,TBOPERACAO.IDSAP) values (\'' + this.req.body.desc + '\',\'' + this.req.body.idsap + '\');';
    }

    @Post('/AddOPER')
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
                        //console.log("Operação já existe "+data);
                        this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Operação já existe'));
                        return;
                    } else {
                        //console.log(data);
                        new MySQLFactory().getConnection().select(this.insertSQL()).subscribe(
                            (data: any) => {
                                //console.log("DEU CERTO ADD "+data);
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

    @Get('/GetOPER')
    public GetOPER() {
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

    @Patch('/DelOPER')
    public PatchOPER() {
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


    defineVisibility() {
        this.actionEscope = ActionType.atPublic;
    }
}