import {Get, Patch, Post, Put} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import { MySQLFactory } from '../mysql/mysql_factory';

export class SintomaAction extends Action{

    private validateData(){
        new KernelUtils().createExceptionApiError('1001', 'Informe o Sintoma', this.req.body.name == '' || this.req.body.name == undefined);
    }

       
private insertSQL() : string{
    return 'insert into TBSINTOMA (TBSINTOMA.NOME ) values (\''+ this.req.body.name+'\');';
}

private generateSQL(){
    return 'select * from TBSINTOMA where TBSINTOMA.ID = \'' + this.req.body.ID + '\' AND STATUS = 1;';
}
private selectSQL() : string {
    return 'select ID,NOME from TBSINTOMA where STATUS = 1;';
}

private deleteSQL() : string {
    return 'UPDATE TBSINTOMA SET STATUS = \'0\' WHERE NOME =  \'' + this.req.body.name + '\' AND STATUS = 1;';
}

private editSQL() : string {
    
    return 'UPDATE TBSINTOMA SET NOME = \'' + this.req.body.name + '\' WHERE NOME =  \'' + this.req.body.namelast + '\' AND STATUS = 1;';
}

    @Post('/AddSINTOMA')
public Post(){
    this.validateData();

    new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
        (data : any) => {
            if (data.length || data.length > 0){
                
                
              this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Sintoma já existe'));
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

@Get('/GetSINTOMA')
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

@Patch('/DelSINTOMA')
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
@Post('/EditSINTOMA')
public Edit(){

    new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
        (data : any) => {
            if (data.length || data.length > 0){
                //console.log(data);
              this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Sintoma já existe'));
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




