import {Get, Patch, Post, Put} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import {MySQL} from '../mysql/mysql';
import {MySQLFactory} from '../mysql/mysql_factory';

export class GetCTAction extends Action{

    private validateData(){
        
        return 'select * from TBCT where TBCT.NOME = \'' + this.req.body.name + '\';';
    }

    private generateSQL() : string {
        return 'select NOME from TBCT where STATUS = 1;';
    }
    private deleteSQL() : string {
        
        return 'UPDATE TBCT SET STATUS = \'0\' WHERE NOME =  \'' + this.req.body.name + '\';';
    }
    private editSQL() : string {
        
        return 'UPDATE TBCT SET NOME = \'' + this.req.body.name + '\' WHERE NOME =  \'' + this.req.body.namelast + '\';';
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
    public PatchCT(){
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
@Post('/EditCT')
    public EditCT(){

        new MySQLFactory().getConnection().select(this.validateData()).subscribe(
            (data : any) => {
                if (data.length || data.length > 0){
                    console.log(data);
                  this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Novo centro de trabalho já existe'));
                  return;
                }else{
                    console.log(data);
                    new MySQLFactory().getConnection().select(this.editSQL()).subscribe(
                        (data : any) => {
                            console.log(data);
                        }
                    );
                }
                this.sendAnswer({
                    token    : new VPUtils().generateGUID().toUpperCase()
                });
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