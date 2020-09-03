import { Get, Patch, Post, Put } from '../decorators';
import { Action } from '../kernel/action';
import { ActionType } from '../kernel/route-types';
import { VPUtils } from '../utils/vputils';
import { KernelUtils } from '../kernel/kernel-utils';
import { MySQLFactory } from '../mysql/mysql_factory';

export class OmOperAction extends Action {

    private validateData() {
        new KernelUtils().createExceptionApiError('1001', 'Informe a causa do defeito', this.req.body.name == '' || this.req.body.name == undefined);
    }

    private generateSQL() {
        if (this.req.body.tipoOm == "rota") {
            return 'select ID from TBEQUIP_WITH_TBOM where IDEQUIP = \'' + this.req.body.idEquip + '\' AND IDOM = \'' + this.req.body.idOm + '\';';
        } else if (this.req.body.tipoOm == "lista") {
            return 'select ID from TBEQUIP_OM where IDEQUIP = \'' + this.req.body.idEquip + '\' AND IDOM = \'' + this.req.body.idOm + '\';';
        }
    }

    private editSQL(id:any) {
        if (this.req.body.tipoOm == "rota") {
            return 'UPDATE TBEQUIP_WITH_TBOM SET OPER_REALIZADA = 1 WHERE ID =  \'' + id + '\';';
        } else if (this.req.body.tipoOm == "lista") {
            return 'UPDATE TBEQUIP_OM SET OPER_REALIZADA = 1 WHERE ID =  \'' + id + '\';';
        }
    }

    @Post('/ExecutaOper')
    public Edit() {
        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
            (data: any) => {
                if (data.length || data.length > 0) {
                    new MySQLFactory().getConnection().select(this.editSQL(data[0].ID)).subscribe(
                        (data: any) => {
                            //  console.log(data);
                        }
                    );
                } else {
                    //console.log(data);
                    this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Causa já existe'));
                    return;
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
    defineVisibility() {
        this.actionEscope = ActionType.atPublic;
    }
}






