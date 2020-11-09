import { Post, Patch, Get, Put } from '../decorators';
import { Action } from '../kernel/action';
import { ActionType } from '../kernel/route-types';
import { VPUtils } from '../utils/vputils';
import { KernelUtils } from '../kernel/kernel-utils';
import { MySQLFactory } from '../mysql/mysql_factory';
import { jwts } from '../utils/jwt';

export class LayoutAction extends Action {

    private validateData() {
        new KernelUtils().createExceptionApiError('1001', 'Informe o Layout', this.req.body.name == '' || this.req.body.name == undefined || this.req.body.layout == '' || this.req.body.layout == undefined);
    }

    private generateSQL(): string {
        return 'select ID from TBLAYOUTOM where (TBLAYOUTOM.NOME = \'' + this.req.body.name + '\') \
         AND STATUS = 1;';
    }
    private generateADDSQL(): string {
        return 'select * from TBLAYOUTOM where TBLAYOUTOM.ID = \'' + this.req.body.id + '\'  AND STATUS = 1;';
    }
    private insertSQL(): string {
        return 'insert into TBLAYOUTOM (TBLAYOUTOM.NOME, TBLAYOUTOM.IDESTILO ) values (\'' + this.req.body.name + '\',' + this.req.body.layout + ');';
    }
    private selectSQL(): string {
        return 'select TBLAYOUTOM.*,TBESTILOLAYOUT.NOME as ESTILONOME from TBLAYOUTOM INNER JOIN TBESTILOLAYOUT ON TBLAYOUTOM.IDESTILO = TBESTILOLAYOUT.ID  where status = 1';
    }
    private selectSQLEstilo(): string {
        return 'select ID,NOME from TBESTILOLAYOUT';
    }
    private deleteSQL(): string {
        return 'UPDATE TBLAYOUTOM SET STATUS = \'0\' WHERE ID =  \'' + this.req.body.id + '\';';
    }
    private editSQL(): string {

        return 'UPDATE TBLAYOUTOM SET NOME  = \'' + this.req.body.name + '\', IDESTILO  = \'' + this.req.body.layout + '\' WHERE ID = \'' + this.req.body.id + '\' AND STATUS = 1 ;';
    }

    @Post('/AddLAYOUTOM')
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
                        this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Layout já existe'));
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
    @Get('/GetLAYOUTOM')
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
    @Get('/GetESTILO')
    public GetEstilo() {
        var jwtss = new jwts();

        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        } else {
            new MySQLFactory().getConnection().select(this.selectSQLEstilo()).subscribe(
                (data: any) => {
                    this.sendAnswer(data);
                },
                (error: any) => {
                    this.sendError(error);
                }
            );
        }
    }
    @Post('/DelLAYOUTOM')
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
    @Post('/EditLAYOUTOM')
    public Edit() {
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