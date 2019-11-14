import {Get, Patch, Post, Put} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import {MySQL} from '../mysql/mysql';
import {MySQLFactory} from '../mysql/mysql_factory';

export class GetCTAction extends Action{

    

    private generateSQL() : string {
        return 'select NOME from TBCT;';
    }
    private deleteSQL() : string {
        console.log("Delete" +this.req.body.name);

        return 'DELETE from TBCT WHERE NOME =  \'' + this.req.body.name + '\';';
    }
    @Get('/GetCT')
    public GetCT(){
        
        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
            (data : any) => {
                this.sendAnswer(data);
            },
            (error : any) => {
                this.sendError(error);
            }
        );
    }

    @Patch('/DelCT')
    public PostCT(){
        console.log("ENTROU"+this.req.body.name)
        new MySQLFactory().getConnection().select(this.deleteSQL()).subscribe(
            (data : any) => {
                console.log(data);
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