import {Get} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import {MySQL} from '../mysql/mysql';
import {MySQLFactory} from '../mysql/mysql_factory';

export class ListaOMAction extends Action{

    

    private generateSQL(idom:any) : string {
        return 'select * from TBOM O WHERE O.IDOM ='+idom+';';
    }

    @Get('/om')
    public GetOM(){
        
        new MySQLFactory().getConnection().select(this.generateSQL(this.req.query.idom)).subscribe(
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