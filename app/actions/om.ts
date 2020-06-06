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

        return 'insert into TBOM (IDSAP,SOLIC,IDLAYOUT,IDCT,TPOM,CAUSADEF,DEF,DTGERACAO,OBS,PRIORIDADE,ESTADO,LOC_INST_ATRIB,REQUERPARADA,DT_INI_PLAN,DT_INI_PROG,DT_FIM_PLAN,DT_FIM_PROG ) values (\''+ this.req.body.idsap+'\',\''+ this.req.body.solicitante+'\','+ this.req.body.layout+','+ this.req.body.ct+','+ this.req.body.tipoManut+','+ this.req.body.causa+',\''+ this.req.body.def+'\',NOW(), \''+ this.req.body.obs+'\','+this.req.body.prior+', 1,'+this.req.body.li+',\''+this.req.body.requerParada+'\',\''+this.req.body.dtIniPlan+'\',\''+this.req.body.dtIniProg+'\',\''+this.req.body.dtFimPlan+'\',\''+this.req.body.dtFimProg+'\');';
    }
    private insertEQUIPSQL(equip : any, id : any){
        return 'insert into TBEQUIP_WITH_TBOM (IDOM,IDEQUIP, OPER,MAT_UTIL,QTDE_MAT) values ('+ id+','+ equip.id+',\''+ equip.oper+'\','+ equip.material+','+ equip.qtde+');';
    }
    private insertMATSQL(mat : any, id : any){
        return 'insert into TBMAT_WITH_OM (IDOM, IDMAT, QTDE) values ('+ id+','+ mat.id+','+ mat.qtde+');';
    }
    private insertOPERSQL(oper : any, id : any){
        return 'insert into TBOPER_WITH_OM (IDOM, IDOPER) values ('+ id+','+ oper.id+');';
    }
    private generateADDSQL(){
        return 'select * from TBOM where TBOM.ID = \'' + this.req.body.id + '\' AND STATUS = 1;';
    }
    private selectEquipWOM(){
        return 'SELECT TBEQUIP.NOME EQUIPNOME, TBEQUIP_WITH_TBOM.OPER,TBEQUIP_WITH_TBOM.OPER_REALIZADA, TBEQUIP_WITH_TBOM.OPER, TBEQUIP_WITH_TBOM.MAT_UTIL,TBEQUIP_WITH_TBOM.QTDE_MAT from TBEQUIP_WITH_TBOM INNER JOIN TBEQUIP ON TBEQUIP_WITH_TBOM.IDEQUIP = TBEQUIP.ID where TBEQUIP_WITH_TBOM.IDOM = \'' + this.req.body.idom + '\';';
    }
    
    private selectMATWOM(){
        return 'SELECT TBMATERIAL.DESC MATDESC,TBMATERIAL.UN_MEDIDA MATMEDIDA, TBMAT_WITH_OM.QTDE from TBMAT_WITH_OM INNER JOIN TBMATERIAL ON TBMAT_WITH_OM.IDMAT = TBMATERIAL.ID where TBMAT_WITH_OM.IDOM = \'' + this.req.body.idom + '\';';
    }
    
    private selectOPERWOM(){
        return 'SELECT TBOPERACAO.DESC OPERDESC from TBOPER_WITH_OM INNER JOIN TBEQUIP ON TBOPER_WITH_OM.IDEQUIP = TBOPERACAO.ID where TBOPER_WITH_OM.IDOM = \'' + this.req.body.idom + '\';';
    }
    private generateSQL(){
        return 'select * from TBOM where TBOM.ID = \'' + this.req.body.id + '\'  AND STATUS = 1;';
    }
    private selectSQL() : string {
        if(this.req.body.timein != undefined && this.req.body.timeout != undefined && this.req.body.li != undefined ){
            return 'select TBOM.*,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where TBOM.ESTADO = 1 AND TBOM.STATUS = 1  AND TBOM.DTGERACAO >= '+this.req.body.timein+' AND TBOM.DTGERACAO <= '+this.req.body.timeout+' AND TBOM.LOC_INST_ATRIB = '+this.req.body.li+';';
        }else{
            return 'select TBOM.*,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where TBOM.ESTADO = 1 AND TBOM.STATUS = 1 LIMIT 100;';
        }
    }
    private selectOMsBySetor() : string {
        if(this.req.body.timein != undefined && this.req.body.timeout != undefined){
            return 'select TBOM.*,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where TBOM.ESTADO = 1 AND TBOM.LOC_INST_ATRIB = (SELECT ID from TBLOC_INST where TBLOC_INST.IDLIDER = ' + this.req.body.idUser  + ' ) AND TBOM.DTGERACAO >= '+this.req.body.timein+' AND TBOM.DTGERACAO <= '+this.req.body.timeout+' AND TBOM.STATUS = 1;';
        }else{
            return 'select TBOM.*,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where TBOM.ESTADO = 1 AND TBOM.LOC_INST_ATRIB = (SELECT ID from TBLOC_INST where TBLOC_INST.IDLIDER = ' + this.req.body.idUser  + ' ) AND TBOM.STATUS = 1 LIMIT 100;';
        }
    }
    
    private selectOMsAndamentoLider() : string {
        if(this.req.body.timein != undefined && this.req.body.timeout != undefined){
            return 'select TBOM.*,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where (TBOM.ESTADO = 2 OR TBOM.ESTADO = 3) AND TBOM.LOC_INST_ATRIB = (SELECT ID from TBLOC_INST where TBLOC_INST.IDLIDER = ' + this.req.body.idUser  + ' ) AND TBOM.DTGERACAO >= '+this.req.body.timein+' AND TBOM.DTGERACAO <= '+this.req.body.timeout+' AND TBOM.STATUS = 1;';
        }else{
            return 'select TBOM.*,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where (TBOM.ESTADO = 2 OR TBOM.ESTADO = 3) AND TBOM.LOC_INST_ATRIB = (SELECT ID from TBLOC_INST where TBLOC_INST.IDLIDER = ' + this.req.body.idUser  + ' ) AND TBOM.STATUS = 1 LIMIT 100;';
        }
    }
    
    private selectOMsFinalizadaLider() : string {
        if(this.req.body.timein != undefined && this.req.body.timeout != undefined){
            return 'select TBOM.*,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where TBOM.ESTADO = 4 AND TBOM.LOC_INST_ATRIB = (SELECT ID from TBLOC_INST where TBLOC_INST.IDLIDER = ' + this.req.body.idUser  + ' ) AND TBOM.DTGERACAO >= '+this.req.body.timein+' AND TBOM.DTGERACAO <= '+this.req.body.timeout+' AND TBOM.STATUS = 1;';     
        }else{
            return 'select TBOM.*,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where TBOM.ESTADO = 4 AND TBOM.LOC_INST_ATRIB = (SELECT ID from TBLOC_INST where TBLOC_INST.IDLIDER = ' + this.req.body.idUser  + ' ) AND TBOM.STATUS = 1 LIMIT 100;';     
        }
    }
    private selectOMsAndamentoADM() : string {
        if(this.req.body.timein != undefined && this.req.body.timeout != undefined && this.req.body.li != undefined ){
        return 'select TBOM.*,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where (TBOM.ESTADO = 2 OR TBOM.ESTADO = 3 OR TBOM.ESTADO = 4)  AND TBOM.STATUS = 1  AND TBOM.DTGERACAO >= '+this.req.body.timein+' AND TBOM.DTGERACAO <= '+this.req.body.timeout+' AND TBOM.LOC_INST_ATRIB = '+this.req.body.li+';';
    }else{
        return 'select TBOM.*,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where (TBOM.ESTADO = 2 OR TBOM.ESTADO = 3 OR TBOM.ESTADO = 4)  AND TBOM.STATUS = 1 LIMIT 100;';
    }
    }
    private selectOMsFinalizadaADM() : string {
        if(this.req.body.timein != undefined && this.req.body.timeout != undefined && this.req.body.li != undefined ){
        return 'select TBOM.*,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where TBOM.ESTADO = 5  AND TBOM.STATUS = 1  AND TBOM.DTGERACAO >= '+this.req.body.timein+' AND TBOM.DTGERACAO <= '+this.req.body.timeout+' AND TBOM.LOC_INST_ATRIB = '+this.req.body.li+';';
    }else{
        return 'select TBOM.*,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where TBOM.ESTADO = 5  AND TBOM.STATUS = 1 LIMIT 100;';
    }
}

    private deleteSQL() : string {
        return 'UPDATE TBOM SET STATUS = \'0\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    }

    private editSQL() : string {
        return 'UPDATE TBOM SET IDSAP = \'' + this.req.body.idsap + '\',SOLIC = \'' + this.req.body.solicitante + '\',IDLAYOUT = ' + this.req.body.layout + ' ,IDCT = ' + this.req.body.ct + ',TPOM = ' + this.req.body.tipoManut + ',CAUSADEF = ' + this.req.body.causa + ',DEF = \'' + this.req.body.def + '\',OBS = \'' + this.req.body.obs + '\',PRIORIDADE = ' + this.req.body.prior + ',LOC_INST_ATRIB = ' + this.req.body.li + ',REQUERPARADA = \'' + this.req.body.requerParada + '\',REQUERPARADA = \'' + this.req.body.dtIniPlan + '\' WHERE ID =  ' + this.req.body.id + ' AND STATUS = 1;';
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
                                
                                    }
                                );
                            });
                                this.req.body.opers.forEach((oper: any) => {
                                    new MySQLFactory().getConnection().select(this.insertOPERSQL(oper,data.insertId)).subscribe(
                                        (data1 : any) => {
                                    
                                        }
                                    );
                                });
                                this.req.body.mats.forEach((mat: any) => {
                                    new MySQLFactory().getConnection().select(this.insertMATSQL(mat,data.insertId)).subscribe(
                                        (data1 : any) => {
                                    
                                        }
                                    );
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
    @Post('/GetMatWOM')
    public MatWOM(){

        new MySQLFactory().getConnection().select(this.selectMATWOM()).subscribe(
            (data : any) => {
                this.sendAnswer(data);
            },
            (error : any) => {
                this.sendError(error);
            }
        );
    }    
    @Post('/GetOperWOM')
    public OperWOM(){

        new MySQLFactory().getConnection().select(this.selectOPERWOM()).subscribe(
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
    @Get('/GetOMsFinalizadaADM')
    public getOMsFinalizadaADM(){
        
        new MySQLFactory().getConnection().select(this.selectOMsFinalizadaADM()).subscribe(
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
    @Get('/GetOMsAndamentoADM')
    public getOMsAndamentoADM(){
        
        new MySQLFactory().getConnection().select(this.selectOMsAndamentoADM()).subscribe(
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

