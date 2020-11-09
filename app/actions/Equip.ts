import { Get, Patch, Post, Put } from '../decorators';
import { Action } from '../kernel/action';
import { ActionType } from '../kernel/route-types';
import { VPUtils } from '../utils/vputils';
import { KernelUtils } from '../kernel/kernel-utils';
import { MySQLFactory } from '../mysql/mysql_factory';
import { jwts } from '../utils/jwt';

export class EquipAction extends Action {

    private validateData() {
        new KernelUtils().createExceptionApiError('1001', 'Informe todos os campos corretamente', this.req.body.name == '' || this.req.body.li == '' || this.req.body.li == undefined || this.req.body.name == undefined
            || this.req.body.idsap == '' || this.req.body.idsap == undefined);
    }


    private generateSQL(): string {
        return 'select * from TBEQUIP where (' + this.req.body.idsap + ' != \'' + this.req.body.idsaplast + '\' AND TBEQUIP.IDSAP = \'' + this.req.body.idsap + '\') AND STATUS = 1;';
    }
    private generateADDSQL(): string {
        return 'select * from TBEQUIP where (TBEQUIP.ID = \'' + this.req.body.ID + '\' OR TBEQUIP.IDSAP = \'' + this.req.body.idsap + '\') AND STATUS = 1;';

    }
    private insertSQL(): string {
        return 'insert into TBEQUIP (TBEQUIP.IDSAP ,TBEQUIP.NOME, TBEQUIP.LOC_INST_ATRIB, TBEQUIP.LOCAL, TBEQUIP.EQUIP_SUP) values (\'' + this.req.body.idsap + '\',\'' + this.req.body.name + '\', \'' + this.req.body.li + '\',\'' + this.req.body.local + '\', \'' + this.req.body.equipsup + '\');';
    }
    private selectSQL(): string {
        return 'select TBEQUIP.*,TBLOC_INST.NOME as TBLOC_INSTNOME from TBEQUIP INNER JOIN TBLOC_INST ON TBEQUIP.LOC_INST_ATRIB = TBLOC_INST.ID where TBEQUIP.STATUS = 1;';
    }

    private deleteSQL(): string {
        return 'UPDATE TBEQUIP SET STATUS = \'0\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    }

    private editSQL(): string {

        return 'UPDATE TBEQUIP SET NOME = \'' + this.req.body.name + '\', IDSAP = \'' + this.req.body.idsap + '\', \
        LOC_INST_ATRIB = \'' + this.req.body.li + '\', LOCAL = \'' + this.req.body.local + '\', \
        EQUIP_SUP = \'' + this.req.body.equipsup + '\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    }



    @Post('/AddEquip')
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


                        this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Equipamento já existe'));
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

    @Get('/GetEquip')
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

    @Post('/DelEquip')
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
    @Post('/EditEquip')
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




