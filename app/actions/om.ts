import {Get, Patch, Post, Put} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import { MySQLFactory } from '../mysql/mysql_factory';

export class OMAction extends Action{
    private validateData(){
        new KernelUtils().createExceptionApiError('1001', 'Informe a OM', this.req.body.idsap == '' || this.req.body.idsap == undefined);
    }
    private validateDataEquipToOM(){
        new KernelUtils().createExceptionApiError('1001', 'Informe a OM', this.req.body.idequip == '' || this.req.body.idequip == undefined);
    }

        
    private insertSQL() : string{
        let horaatual = Date.now();

return 'insert into TBOM (IDSAP,SOLIC,IDLAYOUT,IDCT,TPOM,SINTOMA,CAUSADEF,DEF,DTGERACAO,OBS,PRIORIDADE,ESTADO,SETOR_ATRIB,REQUERPARADA ) values (\''+ this.req.body.idsap+'\',\''+ this.req.body.solicitante+'\','+ this.req.body.layout+','+ this.req.body.ct+','+ this.req.body.tipoManut+','+ this.req.body.sintoma+','+ this.req.body.causa+',\''+ this.req.body.def+'\',\''+horaatual+'\', \''+ this.req.body.obs+'\','+this.req.body.prior+', 1,'+this.req.body.li+',\''+this.req.body.requerParada+'\');';
    }

    private generateSQL(){
        return 'select * from TBOM where TBOM.IDSAP = \'' + this.req.body.idsap + '\' AND STATUS = 1;';
    }
    private selectSQL() : string {
        return 'select TBOM.*,TBSETOR.NOME as TBSETORNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME,TBSINTOMA.NOME as TBSINTOMANOME,TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBSETOR ON TBOM.SETOR_ATRIB = TBSETOR.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBSINTOMA ON TBOM.SINTOMA = TBSINTOMA.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where TBOM.STATUS = 1;';
    }

    private deleteSQL() : string {
        return 'UPDATE TBOM SET STATUS = \'0\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    }

    private editSQL() : string {
        
        return 'UPDATE TBOM SET IDSAP = \'' + this.req.body.idsap + '\',SOLIC = \'' + this.req.body.solicitante + '\',IDLAYOUT = ' + this.req.body.layout + ' ,IDCT = ' + this.req.body.ct + ',TPOM = ' + this.req.body.tipoManut + ',SINTOMA = ' + this.req.body.sintoma + ',CAUSADEF = ' + this.req.body.causa + ',DEF = \'' + this.req.body.def + '\',,OBS = \'' + this.req.body.obs + '\',PRIORIDADE = ' + this.req.body.prior + ',SETOR_ATRIB = ' + this.req.body.li + ',REQUERPARADA = \'' + this.req.body.requerParada + '\' WHERE ID =  ' + this.req.body.id + ' AND STATUS = 1;';
    }
    @Post('/AddOM')
    public Post(){
        this.validateData();

        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
            (data : any) => {
                if (data.length || data.length > 0){
                    
                    
                this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'OM já existe'));
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
    }
    @Post('/AddEquipToOM')
    public EquipToOM(){
        this.validateDataEquipToOM();

        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
            (data : any) => {
                if (data.length || data.length > 0){
                    
                    
                this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'OM já existe'));
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
    }

    @Get('/GetOM')
    public Get(){
        
        new MySQLFactory().getConnection().select(this.selectSQL()).subscribe(
            (data : any) => {
                this.sendAnswer(data);
            },
            (error : any) => {
                this.sendError(error);
            }
        );
    }

    @Patch('/DelOM')
    public Patch(){
        //console.log("ENTROU"+this.req.body.name)
        new MySQLFactory().getConnection().select(this.deleteSQL()).subscribe(
            (data : any) => {
                //console.log(data);
                this.sendAnswer(data);
            },
            (error : any) => {
                this.sendError(error);
            }
        );
    }
    @Post('/EditOM')
    public Edit(){

        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
            (data : any) => {
                if (data.length || data.length > 0){
                    //console.log(data);
                this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'OM já existe'));
                return;
                }else{
                    //console.log(data);
                    new MySQLFactory().getConnection().select(this.editSQL()).subscribe(
                        (data : any) => {
                        //  console.log(data);
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

