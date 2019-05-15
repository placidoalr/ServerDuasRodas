import {Post} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import {MySQL} from '../mysql/mysql';
import {MySQLFactory} from '../mysql/mysql_factory';

export class ListaOMAction extends Action{

    

    private generateSQL() : string {
        return 'select O.CDOM, O.DTGERACAO, O.PRIORIDADE, O.OBS from TBOM O ORDER BY O.PRIORIDADE, O.CDOM;';
    }

    @Post('/om')
    public Get(){

        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
            (data : any) => {
                this.sendAnswer(data);
            },
            (error : any) => {
                this.sendError(error);
            }
        );
    }

    defineVisibility() {
        this.actionEscope = ActionType.atPublic;
    }
}