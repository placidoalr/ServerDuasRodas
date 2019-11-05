import {Post} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import { MySQLFactory } from '../mysql/mysql_factory';

export class AddSetorAction extends Action{

    private validateData(){
        new KernelUtils().createExceptionApiError('1001', 'Informe o Setor', this.req.body.name == '');
    }

    private generateSQL() : string {
        return 'select * from TBSETOR where TBSETOR.NOME = \'' + this.req.body.name + '\';';
    }
    private insertUserSQL() : string{
        return 'insert into TBSETOR (TBSETOR.NOME ) values (\''+ this.req.body.name+'\');';
    }

    @Post('/AddSetor')
    public Post(){
        this.validateData();

        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
            (data : any) => {
                if (data.length || data.length > 0){
                    console.log(data);
                  this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Setor já existe'));
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