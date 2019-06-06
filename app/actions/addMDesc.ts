import {Post} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import { MySQLFactory } from '../mysql/mysql_factory';

export class AddMDescAction extends Action{

    private validateData(){
        new KernelUtils().createExceptionApiError('1001', 'Informe o tempo levado', this.req.body.time == '' ||  this.req.body.desc == '');
    }

    private insertUserSQL() : string{
        return 'insert into TB_OM_DESC (TB_OM_DESC.IDOM ,TB_OM_DESC.DESC, TB_OM_DESC.TEMPO_UTIL) values (\''+ this.req.body.idom+'\',\''+ this.req.body.desc +'\', \''+ this.req.body.time+'\');';
    }

    @Post('/addMDesc')
    public Post(){
        console.log(this.req.body.idom)
        this.validateData();

        
        new MySQLFactory().getConnection().select(this.insertUserSQL()).subscribe(
        (data : any) => {
        console.log(data);
        }
        );

        this.sendAnswer({
        token    : new VPUtils().generateGUID().toUpperCase()
        });

    }

    defineVisibility() {
        this.actionEscope = ActionType.atPublic;
    }
}