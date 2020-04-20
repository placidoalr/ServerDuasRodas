import {Get, Patch, Post, Put} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import { MySQLFactory } from '../mysql/mysql_factory';

export class CausaDefAction extends Action{

    private validateData(){
        new KernelUtils().createExceptionApiError('1001', 'Informe a causa do defeito', this.req.body.name == '' || this.req.body.name == undefined);
    }

    
    private insertSQL() : string{
        return 'insert into TBCAUSADEF (TBCAUSADEF.DSCAUSA ) values (\''+ this.req.body.name+'\');';
    }

    private generateSQL(){
        return 'select * from TBCAUSADEF where TBCAUSADEF.ID = \'' + this.req.body.ID + '\' AND STATUS = 1;';
    }
    private selectSQL() : string {
        return 'select ID,DSCAUSA from TBCAUSADEF where STATUS = 1;';
    }

    private deleteSQL() : string {
        return 'UPDATE TBCAUSADEF SET STATUS = \'0\' WHERE DSCAUSA =  \'' + this.req.body.name + '\' AND STATUS = 1;';
    }

    private editSQL() : string {
        
        return 'UPDATE TBCAUSADEF SET DSCAUSA = \'' + this.req.body.name + '\' WHERE DSCAUSA =  \'' + this.req.body.namelast + '\' AND STATUS = 1;';
    }

    @Post('/AddCAUSADEF')
    public Post(){
        this.validateData();
    
        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
            (data : any) => {
                if (data.length || data.length > 0){
                    
                    
                  this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Causa já existe'));
                  return;
                }else{
                    
                    new MySQLFactory().getConnection().select(this.insertSQL()).subscribe(
                        (data : any) => {
                            
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
    
    @Get('/GetCAUSADEF')
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
    
    @Patch('/DelCAUSADEF')
    public Patch(){
        //console.log("ENTROU"+this.req.body.name)
        new MySQLFactory().getConnection().select(this.deleteSQL()).subscribe(
            (data : any) => {
                //console.log(data);
                this.sendAnswer(data);
            },
            (error : any) => {
                this.sendError(error);
            }
        );
    }
    @Post('/EditCAUSADEF')
    public Edit(){
    
        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
            (data : any) => {
                if (data.length || data.length > 0){
                    //console.log(data);
                  this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Causa já existe'));
                  return;
                }else{
                    //console.log(data);
                    new MySQLFactory().getConnection().select(this.editSQL()).subscribe(
                        (data : any) => {
                          //  console.log(data);
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






