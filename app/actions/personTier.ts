import {Get, Patch, Post, Put} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import {MySQL} from '../mysql/mysql';
import {MySQLFactory} from '../mysql/mysql_factory';

export class PersonTierAction extends Action{


    private selectSQL() : string {
        return 'select CARGO from TBUSUARIO where TBUSUARIO.ID = \'' + this.req.body.ID + '\';';
    }
    
    @Get('/GetPersonTier')
    public Get(){
        
        new MySQLFactory().getConnection().select(this.selectSQL()).subscribe(
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






