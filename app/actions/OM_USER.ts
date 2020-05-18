import {Get, Patch, Post, Put} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import {MySQL} from '../mysql/mysql';
import {MySQLFactory} from '../mysql/mysql_factory';

export class OMUserAction extends Action{

    private validateData(){
        new KernelUtils().createExceptionApiError('1001', 'Informe o ID do Manutentor e ID da Ordem de manutenção', this.req.body.idUser == '' || this.req.body.idUser == undefined || this.req.body.idOm == '' || this.req.body.idOm == undefined);
    }
    private insertSQL() : string{
        return 'insert into TBUSUARIO_WITH_TBOM (TBUSUARIO_WITH_TBOM.IDMANUT, TBUSUARIO_WITH_TBOM.IDOM) values (\''+ this.req.body.idUser+'\',\''+ this.req.body.idOm+'\');';
    }
    private updateOM() : string{
        return 'update TBOM set ESTADO = 2 where TBOM.ID = \''+ this.req.body.idOm+'\';';
    }
    private generateSQL(){
        return 'select * from TBUSUARIO_WITH_TBOM where TBUSUARIO_WITH_TBOM.IDMANUT = \'' + this.req.body.idUser + '\' AND TBUSUARIO_WITH_TBOM.IDOM = \'' + this.req.body.idOm + '\' ;';
    }
    
    @Post('/AddOMUser')
    public Post(){
        this.validateData();

        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
            (data : any) => {
                if (data.length || data.length > 0){
                  this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Vínculo já existe'));
                  return;
                }else{
                    new MySQLFactory().getConnection().select(this.insertSQL()).subscribe(
                        (data : any) => {
                            new MySQLFactory().getConnection().select(this.updateOM()).subscribe(
                                (data : any) => {
                                    
                                }
                            );
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