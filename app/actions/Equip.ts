import {Get, Patch, Post, Put} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import { MySQLFactory } from '../mysql/mysql_factory';

export class EquipAction extends Action{

    private validateData(){
        new KernelUtils().createExceptionApiError('1001', 'Informe todos os campos corretamente', this.req.body.name == '' || this.req.body.setor == '' || this.req.body.setor == undefined || this.req.body.name == undefined 
        || this.req.body.idsap == '' || this.req.body.idsap == undefined );
    }


    private generateSQL() : string {
        return 'select * from TBEQUIP where (' + this.req.body.idsap + ' != \'' + this.req.body.idsaplast + '\' AND TBEQUIP.IDSAP = \'' + this.req.body.idsap + '\') AND STATUS = 1;';
    }
    private generateADDSQL() : string {
        return 'select * from TBEQUIP where (TBEQUIP.ID = \'' + this.req.body.ID + '\' OR TBEQUIP.IDSAP = \'' + this.req.body.idsap + '\') AND STATUS = 1;';
    
    }
    private insertSQL() : string{
        return 'insert into TBEQUIP (TBEQUIP.IDSAP ,TBEQUIP.NOME, TBEQUIP.SETOR_ATRIB) values (\''+ this.req.body.idsap+'\',\''+ this.req.body.name +'\', \''+ this.req.body.setor+'\');';
    }
    private selectSQL() : string {
        return 'select TBEQUIP.*,TBSETOR.NOME as TBSETORNOME from TBEQUIP INNER JOIN TBSETOR ON TBEQUIP.SETOR_ATRIB = TBSETOR.ID where TBEQUIP.STATUS = 1;';
    }
    
    private deleteSQL() : string {
        return 'UPDATE TBEQUIP SET STATUS = \'0\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    }
    
    private editSQL() : string {
        
        return 'UPDATE TBEQUIP SET NOME = \'' + this.req.body.name + '\', IDSAP = \'' + this.req.body.idsap + '\', \
        SETOR_ATRIB = \'' + this.req.body.setor + '\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    }
    
    

    @Post('/AddEquip')
public Post(){
    this.validateData();

    new MySQLFactory().getConnection().select(this.generateADDSQL()).subscribe(
        (data : any) => {
            if (data.length || data.length > 0){
                
                
              this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Equipamento já existe'));
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

@Get('/GetEquip')
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

@Patch('/DelEquip')
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
@Post('/EditEquip')
public Edit(){

    new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
        (data : any) => {
            if (data.length || data.length > 0 ){
                //console.log(data);
              this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Equipamento já existe'));
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




