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

    private historico() : string{
        var desc = 'Usuário com id = '+this.req.body.idUser+' assumiu a OM com id = '+this.req.body.idOm;
        return 'insert into TBHISTORICO (TBHISTORICO.IDUSER, TBHISTORICO.IDOM, TBHISTORICO.DESC, TBHISTORICO.DTALTER) values (\''+ this.req.body.idUser+'\',\''+ this.req.body.idOm+'\',\''+ desc+'\',\''+ new Date().getDate().toString()+'\');';
     }

    private generateSQL(){
        return 'select * from TBUSUARIO_WITH_TBOM where TBUSUARIO_WITH_TBOM.IDMANUT = \'' + this.req.body.idUser + '\' AND TBUSUARIO_WITH_TBOM.IDOM = \'' + this.req.body.idOm + '\' ;';
    }
    
    private selectAtribuida() : string {
        return 'select TBOM.*,TBSETOR.NOME as TBSETORNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBSETOR ON TBOM.SETOR_ATRIB = TBSETOR.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID INNER JOIN TBUSUARIO_WITH_TBOM ON TBOM.ID = TBUSUARIO_WITH_TBOM.IDOM where TBUSUARIO_WITH_TBOM.IDMANUT = \'' + this.req.body.idUser + '\' AND TBOM.ESTADO = 2 AND  TBOM.STATUS = 1;';
    }
    private selectFinalizada() : string {
        return 'select TBOM.*,TBSETOR.NOME as TBSETORNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBSETOR ON TBOM.SETOR_ATRIB = TBSETOR.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID INNER JOIN TBUSUARIO_WITH_TBOM ON TBOM.ID = TBUSUARIO_WITH_TBOM.IDOM where TBUSUARIO_WITH_TBOM.IDMANUT = \'' + this.req.body.idUser + '\' AND TBOM.ESTADO = 3 AND  TBOM.STATUS = 1;';
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

                            new MySQLFactory().getConnection().select(this.historico()).subscribe(
                                (data : any) => {
                                    
                                }
                            ));
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

    @Post('/GetOMByUserIDAtribuida')
    public Get(){
        
        new MySQLFactory().getConnection().select(this.selectAtribuida()).subscribe(
            (data : any) => {
                this.sendAnswer(data);
            },
            (error : any) => {
                this.sendError(error);
            }
        );
    }
    
    @Post('/GetOMByUserIDFinalizada')
    public Get1(){
        
        new MySQLFactory().getConnection().select(this.selectFinalizada()).subscribe(
            (data : any) => {
                this.sendAnswer(data);
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