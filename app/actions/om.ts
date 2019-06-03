import {Get} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import {MySQL} from '../mysql/mysql';
import {MySQLFactory} from '../mysql/mysql_factory';

export class OMAction extends Action{

    

    private generateSQL(idom:any) : string {
        return 'select * from TBOM O WHERE O.IDOM ='+idom+';';
    }

    @Get('/om')
    public GetOM(){
        
        new MySQLFactory().getConnection().select(this.generateSQL(this.req.query.idom)).subscribe(
            (data : any) => {
                if (data.length == 0){
                    this.sendAnswer({});
                } else {
                    this.sendAnswer(data[0]);
                }                
            },
            (error : any) => {
                console.log(error)
                this.sendError(error);
            }
        )
    }

    defineVisibility() {
        this.actionEscope = ActionType.atPublic;
    }
}