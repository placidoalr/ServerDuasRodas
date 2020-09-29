import { Get, Patch, Post, Put } from '../decorators';
import { Action } from '../kernel/action';
import { ActionType } from '../kernel/route-types';
import { VPUtils } from '../utils/vputils';
import { KernelUtils } from '../kernel/kernel-utils';
import { MySQL } from '../mysql/mysql';
import { MySQLFactory } from '../mysql/mysql_factory';

export class assinaturasAction extends Action {
    private selectSQL(): string {
        return 'select a.*, u.CARGO, u.NOME from TBASSINATURAS a INNER JOIN TBUSUARIO u on u.ID = a.IDUSER where a.IDOM = '+this.req.body.idOm+';';
    }

    @Post('/GetAssinaturas')
    public GetCT() {

        new MySQLFactory().getConnection().select(this.selectSQL()).subscribe(
            (data: any) => {
                this.sendAnswer(data);
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