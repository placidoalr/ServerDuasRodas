import { Get, Patch, Post, Put } from '../decorators';
import { Action } from '../kernel/action';
import { ActionType } from '../kernel/route-types';
import { VPUtils } from '../utils/vputils';
import { KernelUtils } from '../kernel/kernel-utils';
import { MySQL } from '../mysql/mysql';
import { MySQLFactory } from '../mysql/mysql_factory';
import { jwts } from '../utils/jwt';

export class LOC_INSTAction extends Action {

    private validateData() {
        new KernelUtils().createExceptionApiError('1001', 'Informe o Local de instalação', this.req.body.name == '' || this.req.body.name == undefined || this.req.body.idsap == '' || this.req.body.idsap == undefined);
    }

    private generateSQL() {
        return 'select * from TBLOC_INST where (TBLOC_INST.NOME = \'' + this.req.body.name + '\' AND \'' + this.req.body.name + '\' != \'' + this.req.body.namelast + '\' ) \
        OR (TBLOC_INST.IDSAP = \'' + this.req.body.idsap + '\' AND \'' + this.req.body.idsap + '\' != \'' + this.req.body.idsaplast + '\' ) AND STATUS = 1;';
    }
    private generateADDSQL() {
        return 'select * from TBLOC_INST where (TBLOC_INST.ID = \'' + this.req.body.ID + '\') AND STATUS = 1;';
    }

    private selectSQL(): string {
        return 'select S.ID,S.IDSAP,S.NOME, U.NOME as LIDER from TBLOC_INST as S inner join TBUSUARIO as U on U.ID = S.IDLIDER where S.STATUS = 1;';
    }

    private deleteSQL(): string {
        return 'UPDATE TBLOC_INST SET STATUS = \'0\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    }

    private editSQL(): string {
        return 'UPDATE TBLOC_INST SET NOME = \'' + this.req.body.name + '\', IDSAP = \'' + this.req.body.idsap + '\', IDLIDER = \'' + this.req.body.idlider + '\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    }


    private insertSQL(): string {
        return 'insert into TBLOC_INST (TBLOC_INST.NOME,TBLOC_INST.IDSAP, TBLOC_INST.IDLIDER) values (\'' + this.req.body.name + '\',\'' + this.req.body.idsap + '\',\'' + this.req.body.idlider + '\');';
    }



    @Post('/AddLOC_INST')
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
                        this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Local de instalação já existe'));
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

    @Get('/GetLOC_INST')
    public GetLOC_INST() {
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

    @Post('/DelLOC_INST')
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
    @Post('/EditLOC_INST')
    public EditLOC_INST() {
        var jwtss = new jwts();

        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        } else {
            new MySQLFactory().getConnection().select(this.editSQL()).subscribe(
                (data: any) => {
                }
            );
            this.sendAnswer({
                token: new VPUtils().generateGUID().toUpperCase()
            });
        }
    }


    defineVisibility() {
        this.actionEscope = ActionType.atPublic;
    }
}



