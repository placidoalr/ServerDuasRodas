import { Get } from '../decorators';
import { Action } from '../kernel/action';
import { ActionType } from '../kernel/route-types';
import { VPUtils } from '../utils/vputils';
import { KernelUtils } from '../kernel/kernel-utils';
import { MySQL } from '../mysql/mysql';
import { MySQLFactory } from '../mysql/mysql_factory';
import { jwts } from '../utils/jwt';

export class ListaOMAction extends Action {



    private generateSQL(userid: any, setorid: any): string {
        return 'select O.IDOM, O.CDOM, O.DTGERACAO,O.TPOM, O.PRIORIDADE, O.DSOM from TBOM O WHERE O.MANU_ATRIB = ' + userid + ' or O.MANU_ATRIB is null and O.SETOR_ATRIB = ' + setorid + ' ORDER BY O.PRIORIDADE;';
    }

    @Get('/listaom')
    public GetListaOM() {
        var jwtss = new jwts();

        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        } else {
            new MySQLFactory().getConnection().select(this.generateSQL(this.req.query.userid, this.req.query.setorid)).subscribe(
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