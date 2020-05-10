import {Get, Patch, Post, Put} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import {MySQL} from '../mysql/mysql';
import {MySQLFactory} from '../mysql/mysql_factory';

export class InviteOMAction extends Action{

    private validateData(){
        new KernelUtils().createExceptionApiError('1001', 'Informe o ID do Manutentor do Convidado e ID  da Ordem de manutenção', this.req.body.idUser == '' || this.req.body.idUser == undefined || this.req.body.idOm == '' || this.req.body.idOm == undefined || this.req.body.idAdm == '' || this.req.body.idAdm == undefined );
    }
    private insertSQL() : string{
        return 'insert into TBUSUARIO_WITH_TBOM (TBUSUARIO_WITH_TBOM.IDMANUT, TBUSUARIO_WITH_TBOM.IDOM) values (\''+ this.req.body.idUser+'\',\''+ this.req.body.idOm+'\');';
    }
    private generateSQL(){
        return 'select * from TBUSUARIO_WITH_TBOM where TBUSUARIO_WITH_TBOM.IDMANUT = \'' + this.req.body.idUser + '\' AND TBUSUARIO_WITH_TBOM.IDOM = \'' + this.req.body.idOm + '\' AND STATUS = 1;';
    }
    private ADMonOM(){
        return 'select * from TBUSUARIO_WITH_TBOM where TBUSUARIO_WITH_TBOM.IDMANUT = \'' + this.req.body.idAdm + '\' AND TBUSUARIO_WITH_TBOM.IDOM = \'' + this.req.body.idOm + '\' AND STATUS = 1;';
    }
    private validateADM(){
        return 'select CARGO from TBUSUARIO where TBUSUARIO.ID = \'' + this.req.body.idAdm + '\' AND STATUS = 1;';
    }
    
    @Post('/InviteOMUser')
    public Post(){
        this.validateData();
        new MySQLFactory().getConnection().select(this.validateADM()).subscribe(
        (adm : any) => {
            if (adm.CARGO == 1){
                new MySQLFactory().getConnection().select(this.ADMonOM()).subscribe(
                (admon : any) => {
                    if (admon.length || admon.length > 0){
                        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
                            (data : any) => {
                                if (data.length || data.length > 0){
                                        this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Vínculo já existe'));
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
                        
                    }else{ 
                        this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Manutentor ADM não está na OM '));
                    }
                });
            }else{
                            
                this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Usuário sem permissão para delegar'));
            }
        });
    }
    
    defineVisibility() {
        this.actionEscope = ActionType.atPublic;
    }
}
