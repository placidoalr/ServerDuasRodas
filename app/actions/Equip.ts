import {Get, Patch, Post, Put} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import { MySQLFactory } from '../mysql/mysql_factory';

export class EquipAction extends Action{

    private validateData(){
        new KernelUtils().createExceptionApiError('1001', 'Informe todos os campos corretamente', this.req.body.name == '' || this.req.body.setor == '' || this.req.body.setor == undefined || this.req.body.name == undefined 
        || this.req.body.codigo == '' || this.req.body.codigo == undefined );
    }


    private generateSQL() : string {
        return 'select * from TBEQUIP where (' + this.req.body.codigo + ' != \'' + this.req.body.codigolast + '\' AND TBEQUIP.CODEQUIP = \'' + this.req.body.codigo + '\') AND STATUS = 1;';
    }
    private generateADDSQL() : string {
        return 'select * from TBEQUIP where (TBEQUIP.NOME = \'' + this.req.body.name + '\' OR TBEQUIP.CODEQUIP = \'' + this.req.body.codigo + '\') AND STATUS = 1;';
    
    }
    private insertSQL() : string{
        return 'insert into TBEQUIP (TBEQUIP.CODEQUIP ,TBEQUIP.NOME, TBEQUIP.SETOR_ATRIB) values (\''+ this.req.body.codigo+'\',\''+ this.req.body.name +'\', \''+ this.req.body.setor+'\');';
    }
    private selectSQL() : string {
        return 'select CODEQUIP,NOME,SETOR_ATRIB from TBEQUIP where STATUS = 1;';
    }
    
    private deleteSQL() : string {
        return 'UPDATE TBEQUIP SET STATUS = \'0\' WHERE IDSAP =  \'' + this.req.body.idsap + '\' AND STATUS = 1;';
    }
    
    private editSQL() : string {
        
        return 'UPDATE TBEQUIP SET NOME = \'' + this.req.body.name + '\', CODEQUIP = \'' + this.req.body.codigo + '\', \
        SETOR_ATRIB = \'' + this.req.body.setor + '\' WHERE CODEQUIP =  \'' + this.req.body.codigolast + '\' AND STATUS = 1;';
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




