import { Get, Patch, Post, Put } from '../decorators';
import { Action } from '../kernel/action';
import { ActionType } from '../kernel/route-types';
import { VPUtils } from '../utils/vputils';
import { KernelUtils } from '../kernel/kernel-utils';
import { MySQLFactory } from '../mysql/mysql_factory';
import { jwts } from '../utils/jwt';

export class EPIAction extends Action {
    private validateData() {
        new KernelUtils().createExceptionApiError('1001', 'Informe o nome do EPI de Trabalho', this.req.body.name == '' || this.req.body.name == undefined);
    }

    private generateSQL() {
        return 'select * from TBEPI where TBEPI.NOME = \'' + this.req.body.name + '\' AND STATUS = 1;';
    }
    private selectS(): string {
        return 'select ID,NOME,IDPADRAO from TBEPI where STATUS = 1 and UPPER(IDPADRAO) = \'S\';';
    }
    private select(): string {
        return 'select ID,NOME,IDPADRAO from TBEPI where STATUS = 1 and UPPER(IDPADRAO) != \'S\';';
    }
    private selectALL(): string {
        return 'select ID,NOME,IDPADRAO from TBEPI where STATUS = 1';
    }

    private deleteSQL(): string {
        return 'UPDATE TBEPI SET STATUS = \'0\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    }


    private insertSQL(): string {
        return 'insert into TBEPI (TBEPI.NOME,TBEPI.IDPADRAO) values (\'' + this.req.body.name + '\',\'' + this.req.body.idpadrao + '\');';
    }

    @Post('/AddEPI')
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
                        this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'EPI já existe'));
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
    @Get('/GetEPIall')
    public GetepiAll() {
        var jwtss = new jwts();

        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        } else {
            new MySQLFactory().getConnection().select(this.selectALL()).subscribe(
                (data: any) => {
                    this.sendAnswer(data);
                },
                (error: any) => {
                    this.sendError(error);
                }
            );
        }
    }
    
    @Get('/GetEPIs')
    public GetCT() {
        var jwtss = new jwts();
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        } else {

            new MySQLFactory().getConnection().select(this.selectS()).subscribe(
                (data: any) => {
                    this.sendAnswer(data);
                },
                (error: any) => {
                    this.sendError(error);
                }
            );
        }
    }
    @Get('/GetEPI')
    public Get() {
        var jwtss = new jwts();

        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        } else {
            new MySQLFactory().getConnection().select(this.select()).subscribe(
                (data: any) => {
                    this.sendAnswer(data);
                },
                (error: any) => {
                    this.sendError(error);
                }
            );
        }
    }

    @Post('/DelEPI')
    public PatchCT() {
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