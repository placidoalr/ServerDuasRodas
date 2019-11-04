import {Post} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import { MySQLFactory } from '../mysql/mysql_factory';

export class AddUserAction extends Action{

    private validateData(){
        new KernelUtils().createExceptionApiError('1001', 'Informe o número do cracha, usuário e senha', this.req.body.userId == '' || this.req.body.userName == '' || this.req.body.password == '');
    }

    private generateSQL() : string {
        return 'select * from TBUSUARIO where TBUSUARIO.LOGIN = \'' + this.req.body.userName + '\' OR TBUSUARIO.userId = \'' + this.req.body.userId + '\';';
    }
    private insertUserSQL() : string{
        return 'insert into TBUSUARIO (TBUSUARIO.IDSAP ,TBUSUARIO.LOGIN, TBUSUARIO.SENHA, TBUSUARIO.CDPERM, TBUSUARIO.NOME) values (\''+ this.req.body.userId+'\',\''+ this.req.body.userName +'\', \''+ this.req.body.password+'\', \''+ this.req.body.permissao+'\', \''+ this.req.body.nome+'\');';
    }

    @Post('/AddUser')
    public Post(){
        this.validateData();

        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
            (data : any) => {
                if (data.length || data.length > 0){
                    console.log(data);
                  this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Usuário já existe'));
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