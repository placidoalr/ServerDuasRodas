import { Get, Patch, Post, Put } from '../decorators';
import { Action } from '../kernel/action';
import { ActionType } from '../kernel/route-types';
import { VPUtils } from '../utils/vputils';
import { KernelUtils } from '../kernel/kernel-utils';
import { MySQLFactory } from '../mysql/mysql_factory';
import { jwts } from '../utils/jwt';

export class MaterialAction extends Action {
    private validateData() {
        new KernelUtils().createExceptionApiError('1001', 'Informe o nome do Material', this.req.body.desc == '' || this.req.body.desc == undefined);
    }

    private generateSQL() {
        return 'select * from TBMATERIAL where TBMATERIAL.DESC = \'' + this.req.body.desc + '\' AND STATUS = 1;';
    }
    private selectSQL(): string {
        return 'select TBMATERIAL.ID,TBMATERIAL.DESC,TBMATERIAL.IDSAP,TBMATERIAL.UN_MEDIDA from TBMATERIAL where STATUS = 1;';
    }

    private deleteSQL(): string {
        return 'UPDATE TBMATERIAL SET STATUS = \'0\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    }

    private insertSQL(): string {
        return 'insert into TBMATERIAL (TBMATERIAL.DESC,TBMATERIAL.IDSAP,TBMATERIAL.UN_MEDIDA) values (\'' + this.req.body.desc + '\',\'' + this.req.body.idsap + '\',\'' + this.req.body.medida + '\');';
    }

    @Post('/AddMATERIAL')
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
                        this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Material já existe'));
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

    @Get('/GetMATERIAL')
    public GetMATERIAL() {
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

    @Patch('/DelMATERIAL')
    public PatchMATERIAL() {
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