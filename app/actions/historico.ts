import {Get, Patch, Post, Put} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import {MySQL} from '../mysql/mysql';
import {MySQLFactory} from '../mysql/mysql_factory';

export class HistoricoAction extends Action{


    private selectAll() : string {
        return 'select * from TBHISTORICO;';
    }
    private selectSQL() : string {
        return 'select * from TBHISTORICO where TBHISTORICO.ID = \'' + this.req.body.ID + '\';';
    }
    @Get('/GetHistoricos')
    public Get(){
        
        new MySQLFactory().getConnection().select(this.selectAll()).subscribe(
            (data : any) => {
                this.sendAnswer(data);
            },
            (error : any) => {
                this.sendError(error);
            }
        );
    }
    @Get('/GetOneHistorico')
    public Getone(){
        
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






