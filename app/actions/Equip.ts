import {Post} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import { MySQLFactory } from '../mysql/mysql_factory';

export class EquipAction extends Action{

    private validateData(){
        new KernelUtils().createExceptionApiError('1001', 'Informe o nome e setor do Equipamento', this.req.body.name == '' || this.req.body.setor == '' || this.req.body.setor == undefined || this.req.body.name == undefined 
        || this.req.body.codEquip == '' || this.req.body.codEquip == undefined );
    }

    private generateSQL() : string {
        return 'select * from TBEQUIP where TBEQUIP.NOME = \'' + this.req.body.name + '\' AND TBEQUIP.SETOR_ATRIB = \'' + this.req.body.setor + '\' AND TBEQUIP.CODEQUIP = \'' + this.req.body.codEquip + '\' ;';
    }
    private insertSQL() : string{
        return 'insert into TBEQUIP (TBEQUIP.NOME ,TBEQUIP.SETOR_ATRIB, TBEQUIP.CODEQUIP) values (\''+ this.req.body.name+'\',\''+ this.req.body.setor +'\',\''+ this.req.body.codEquip +'\');';
    }

    @Post('/AddEquip')
    public Post(){
        this.validateData();

        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
            (data : any) => {
                if (data.length || data.length > 0){
                    console.log(data);
                  this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Equipamento já existe'));
                  return;
                }else{
                    console.log(data);
                    new MySQLFactory().getConnection().select(this.insertSQL()).subscribe(
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