import {Post} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import { MySQLFactory } from '../mysql/mysql_factory';

export class AddCausaDefAction extends Action{

    private validateData(){
        new KernelUtils().createExceptionApiError('1001', 'Informe a causa do defeito', this.req.body.name == '' || this.req.body.name == undefined);
    }

    private generateSQL() : string {
        return 'select * from TBCAUSADEF where TBCAUSADEF.DSCAUSA = \'' + this.req.body.name + '\';';
    }
    private insertSQL() : string{
        return 'insert into TBCAUSADEF (TBCAUSADEF.DSCAUSA ) values (\''+ this.req.body.name+'\');';
    }

    @Post('/AddCausaDef')
    public Post(){
        this.validateData();

        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
            (data : any) => {
                if (data.length || data.length > 0){
                    console.log(data);
                  this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Causa de defeito já existe'));
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