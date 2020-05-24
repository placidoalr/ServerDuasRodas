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

        return 'insert into TBOM (IDSAP,SOLIC,IDLAYOUT,IDCT,TPOM,CAUSADEF,DEF,DTGERACAO,OBS,PRIORIDADE,ESTADO,SETOR_ATRIB,REQUERPARADA,DT_INI_PLAN,DT_INI_PROG,DT_FIM_PLAN,DT_FIM_PROG ) values (\''+ this.req.body.idsap+'\',\''+ this.req.body.solicitante+'\','+ this.req.body.layout+','+ this.req.body.ct+','+ this.req.body.tipoManut+','+ this.req.body.causa+',\''+ this.req.body.def+'\',\''+horaatual+'\', \''+ this.req.body.obs+'\','+this.req.body.prior+', 1,'+this.req.body.setor+',\''+this.req.body.requerParada+'\',\''+this.req.body.dtIniPlan+'\',\''+this.req.body.dtIniProg+'\',\''+this.req.body.dtFimPlan+'\',\''+this.req.body.dtFimProg+'\');';
    }
    private insertEQUIPSQL(equip : any, id : any){
        return 'insert into TBEQUIP_WITH_TBOM (IDOM,IDEQUIP, OPER) values ('+ id+','+ equip.id+',\''+ equip.oper+'\');';
    }
    private setLastID(){
        return 'select LAST_INSERT_ID() as id;';
    }
    private generateADDSQL(){
        return 'select * from TBOM where TBOM.ID = \'' + this.req.body.id + '\' AND STATUS = 1;';
    }
    private selectEquipWOM(){
        return 'SELECT TBEQUIP.NOME EQUIPNOME, TBEQUIP_WITH_TBOM.OPER from TBEQUIP_WITH_TBOM INNER JOIN TBEQUIP ON TBEQUIP_WITH_TBOM.IDEQUIP = TBEQUIP.ID where TBEQUIP_WITH_TBOM.IDOM = \'' + this.req.body.idom + '\';';
    }
    private generateSQL(){
        return 'select * from TBOM where TBOM.ID = \'' + this.req.body.id + '\'  AND STATUS = 1;';
    }
    private selectSQL() : string {
        return 'select TBOM.*,TBSETOR.NOME as TBSETORNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBSETOR ON TBOM.SETOR_ATRIB = TBSETOR.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where TBOM.ESTADO = 1 AND TBOM.STATUS = 1;';
    }
    private selectOMsBySetor() : string {
        return 'select TBOM.*,TBSETOR.NOME as TBSETORNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBSETOR ON TBOM.SETOR_ATRIB = TBSETOR.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where TBOM.ESTADO = 1 AND TBOM.SETOR_ATRIB = (SELECT ID from TBSETOR where TBSETOR.IDLIDER = ' + this.req.body.idUser  + ' ) AND TBOM.STATUS = 1;';
    }
    
    private selectOMsAndamentoLider() : string {
        return 'select TBOM.*,TBSETOR.NOME as TBSETORNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBSETOR ON TBOM.SETOR_ATRIB = TBSETOR.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where (TBOM.ESTADO = 2 OR TBOM.ESTADO = 3) AND TBOM.SETOR_ATRIB = (SELECT ID from TBSETOR where TBSETOR.IDLIDER = ' + this.req.body.idUser  + ' ) AND TBOM.STATUS = 1;';
    }
    
    private selectOMsFinalizadaLider() : string {
        return 'select TBOM.*,TBSETOR.NOME as TBSETORNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBSETOR ON TBOM.SETOR_ATRIB = TBSETOR.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where TBOM.ESTADO = 4 AND TBOM.SETOR_ATRIB = (SELECT ID from TBSETOR where TBSETOR.IDLIDER = ' + this.req.body.idUser  + ' ) AND TBOM.STATUS = 1;';
    }

    private deleteSQL() : string {
        return 'UPDATE TBOM SET STATUS = \'0\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    }

    private editSQL() : string {
        
        return 'UPDATE TBOM SET IDSAP = \'' + this.req.body.idsap + '\',SOLIC = \'' + this.req.body.solicitante + '\',IDLAYOUT = ' + this.req.body.layout + ' ,IDCT = ' + this.req.body.ct + ',TPOM = ' + this.req.body.tipoManut + ',CAUSADEF = ' + this.req.body.causa + ',DEF = \'' + this.req.body.def + '\',OBS = \'' + this.req.body.obs + '\',PRIORIDADE = ' + this.req.body.prior + ',SETOR_ATRIB = ' + this.req.body.setor + ',REQUERPARADA = \'' + this.req.body.requerParada + '\',REQUERPARADA = \'' + this.req.body.dtIniPlan + '\' WHERE ID =  ' + this.req.body.id + ' AND STATUS = 1;';
    }
    @Post('/AddOM')
    public Post(){
        this.validateData();
            console.log(this.req.body)
        // new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
        //     (data : any) => {
        //         if (data.length || data.length > 0){
                    
                    
        //         this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'OM já existe'));
        //         return;
        //         }else{
                    
                    new MySQLFactory().getConnection().select(this.insertSQL()).subscribe(
                        (data : any) => {
                            console.log(data.insertId)
                            this.req.body.equips.forEach((equip: any) => {
                                new MySQLFactory().getConnection().select(this.insertEQUIPSQL(equip,data.insertId)).subscribe(
                                    (data1 : any) => {
                                
                        });
                            });
                                   
                        }
                    );
                // }
                this.sendAnswer({
                    token    : new VPUtils().generateGUID().toUpperCase()
                });
        //     },
        //     (error : any) => {
        //         this.sendError(error);
        //     }
        // );
    }
    @Post('/GetEquipWOM')
    public EquipWOM(){

        new MySQLFactory().getConnection().select(this.selectEquipWOM()).subscribe(
            (data : any) => {
                this.sendAnswer(data);
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
    @Post('/GetOMsAndamentoLider')
    public getOMsAndamentoLider(){
        
        new MySQLFactory().getConnection().select(this.selectOMsAndamentoLider()).subscribe(
            (data : any) => {
                this.sendAnswer(data);
            },
            (error : any) => {
                this.sendError(error);
            }
        );
    }
    @Post('/GetOMsBySetor')
    public getOMsBySetor(){
        
        new MySQLFactory().getConnection().select(this.selectOMsBySetor()).subscribe(
            (data : any) => {
                this.sendAnswer(data);
            },
            (error : any) => {
                this.sendError(error);
            }
        );
    }
    @Post('/GetOMsFinalizadaLider')
    public getOMsFinalizadaLider(){
        
        new MySQLFactory().getConnection().select(this.selectOMsFinalizadaLider()).subscribe(
            (data : any) => {
                this.sendAnswer(data);
            },
            (error : any) => {
                this.sendError(error);
            }
        );
    }
    @Post('/GetOMUnica')
    public Get1(){
        console.log(this.req.body);
        new MySQLFactory().getConnection().select(this.generateADDSQL()).subscribe(
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

