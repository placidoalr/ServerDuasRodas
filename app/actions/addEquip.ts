import {Post} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import { MySQLFactory } from '../mysql/mysql_factory';

export class AddEquipAction extends Action{

    private validateData(){
        new KernelUtils().createExceptionApiError('1001', 'Informe o nome e setor do Equipamento', this.req.body.name == '' || this.req.body.setor == '');
    }

    private generateSQL() : string {
        return 'select * from TBEQUIP where TBEQUIP.NOME = \'' + this.req.body.name + '\' AND TBEQUIP.SETOR_ATRIB = \'' + this.req.body.setor + '\';';
    }
    private insertUserSQL() : string{
        return 'insert into TBEQUIP (TBEQUIP.NOME ,TBEQUIP.SETOR_ATRIB) values (\''+ this.req.body.name+'\',\''+ this.req.body.setor +'\');';
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
                    new MySQLFactory().getConnection().select(this.insertUserSQL()).subscribe(
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