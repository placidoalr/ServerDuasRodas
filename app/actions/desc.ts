import {Get, Patch, Post, Put} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import {MySQL} from '../mysql/mysql';
import {MySQLFactory} from '../mysql/mysql_factory';

export class DescOMAction extends Action{
    private validateData(){
        new KernelUtils().createExceptionApiError('1001', 'Informe o ID do Manutentor do Convidado e ID  da Ordem de manutenção', this.req.body.idUser == '' || this.req.body.idUser == undefined || this.req.body.idOm == '' || this.req.body.idOm == undefined || this.req.body.desc == '' || this.req.body.desc == undefined || this.req.body.time == '' || this.req.body.time == undefined );
    }
    private insertSQL() : string{
        return 'insert into TB_OM_DESC (TB_OM_DESC.IDMANUT, TB_OM_DESC.IDOM, TB_OM_DESC.DESC, TB_OM_DESC.TEMPO_UTIL) values (\''+ this.req.body.idUser+'\',\''+ this.req.body.idOm+'\',\''+ this.req.body.desc+'\',\''+ this.req.body.time+'\');';
    }
    private historico() : string{
        var desc = 'Usuário com id = '+this.req.body.idUser+' adicionou um comentário para a OM com id = '+this.req.body.idOm;
        return 'insert into TBHISTORICO (TBHISTORICO.IDUSER, TBHISTORICO.IDOM, TBHISTORICO.DESC, TBHISTORICO.DTALTER) values (\''+ this.req.body.idUser+'\',\''+ this.req.body.idOm+'\',\''+ desc+'\',\''+ new Date().getDate().toString()+'\');';
    }
    private ADMonOM(){
        return 'select * from TBUSUARIO_WITH_TBOM where TBUSUARIO_WITH_TBOM.IDMANUT = \'' + this.req.body.idUser + '\' AND TBUSUARIO_WITH_TBOM.IDOM = \'' + this.req.body.idOm + '\' AND STATUS = 1;';
    }
    private validateADM(){
        return 'select CARGO from TBUSUARIO where TBUSUARIO.ID = \'' + this.req.body.idUser + '\' AND STATUS = 1;';
    }
    
    @Post('/DescOM')
    public Post(){
        this.validateData();
        new MySQLFactory().getConnection().select(this.validateADM()).subscribe(
        (adm : any) => {
            if (adm.CARGO == 1){
                new MySQLFactory().getConnection().select(this.ADMonOM()).subscribe(
                (admon : any) => {
                    if (admon.length || admon.length > 0){
                        
                                    new MySQLFactory().getConnection().select(this.insertSQL()).subscribe(
                                        (data : any) => {
                                            new MySQLFactory().getConnection().select(this.historico()).subscribe(
                                                (data : any) => {
                                                    
                                                }
                                            );
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
