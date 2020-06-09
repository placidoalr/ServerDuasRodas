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
    
    private insertRota() : string{
        return 'insert into TB_OM_DESC_ROTA (TB_OM_DESC_ROTA.IDMANUT, TB_OM_DESC_ROTA.IDOM, TB_OM_DESC_ROTA.DESC, TB_OM_DESC_ROTA.IDEQUIP) values (\''+ this.req.body.idUser+'\',\''+ this.req.body.idOm+'\',\''+ this.req.body.desc+'\',\''+ this.req.body.idequip+'\');';
    }
    private ADMonOM(){
        return 'select * from TBUSUARIO_WITH_TBOM where TBUSUARIO_WITH_TBOM.IDMANUT = \'' + this.req.body.idUser + '\' AND TBUSUARIO_WITH_TBOM.IDOM = \'' + this.req.body.idOm + '\' AND STATUS = 1;';
    }
    private validateADM(){
        return 'select CARGO from TBUSUARIO where TBUSUARIO.ID = \'' + this.req.body.idUser + '\' AND STATUS = 1;';
    }
    private selectDesc(){
        return 'select u.NOME, d.DESC, d.TEMPO_UTIL from TBUSUARIO u inner join TB_OM_DESC d on d.IDMANUT = u.ID where d.IDOM = ' + this.req.body.idOm + ';';
    }
    
    private updateEQUIPSQL( id : any){
        return 'update TBEQUIP_WITH_TBOM set OPER_REALIZADA = 1 where IDEQUIP = '+ id+' and IDOM = '+this.req.body.idOm+';';
    }
    

    @Post('/GetDescOM')
    public GetDescOM(){
        
        new MySQLFactory().getConnection().select(this.selectDesc()).subscribe(
            (data : any) => {
                this.sendAnswer(data);
            },
            (error : any) => {
                this.sendError(error);
            }
        );
    }

    @Post('/DescOM')
    public Post(){
        this.validateData();
        new MySQLFactory().getConnection().select(this.validateADM()).subscribe(
        (adm : any) => {
            if (adm[0].CARGO == 1){
                new MySQLFactory().getConnection().select(this.ADMonOM()).subscribe(
                (admon : any) => {
                    if (admon.length || admon.length > 0){
                        
                                    new MySQLFactory().getConnection().select(this.insertSQL()).subscribe(
                                        (data : any) => {
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
    @Post('/DescOMRota')
    public PostRota(){
        this.validateData();
        new MySQLFactory().getConnection().select(this.validateADM()).subscribe(
        (adm : any) => {
            if (adm[0].CARGO == 1){
                new MySQLFactory().getConnection().select(this.ADMonOM()).subscribe(
                (admon : any) => {
                    if (admon.length || admon.length > 0){
                        
                                    new MySQLFactory().getConnection().select(this.insertRota()).subscribe(
                                        (data : any) => {
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
    @Post('/DescOMLista')
    public PostLista(){
        this.validateData();
        new MySQLFactory().getConnection().select(this.validateADM()).subscribe(
        (adm : any) => {
            if (adm[0].CARGO == 1){
                new MySQLFactory().getConnection().select(this.ADMonOM()).subscribe(
                (admon : any) => {
                    if (admon.length || admon.length > 0){

                        this.req.body.equips.forEach((equip: any) => {
                            new MySQLFactory().getConnection().select(this.updateEQUIPSQL(equip )).subscribe(
                                (data1 : any) => {
                            
                            });
                        });
                               
                        
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
