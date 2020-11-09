import { Get, Patch, Post, Put } from '../decorators';
import { Action } from '../kernel/action';
import { ActionType } from '../kernel/route-types';
import { MySQLFactory } from '../mysql/mysql_factory';
import { jwts } from '../utils/jwt';

export class FiltrosAction extends Action {

    private selectSQL(): string {
        var sql = 'select TBOM.*, TBSINTOMA.NOME as SINTOMANOME,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME, TBLAYOUTOM.IDESTILO AS ESTILO, TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBSINTOMA ON TBOM.SINTOMA = TBSINTOMA.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID where TBOM.STATUS = 1 ';
        if(this.req.body.estado){
            sql += ' AND TBOM.ESTADO = "'+this.req.body.estado+'"';
        }
        if(this.req.body.prioridade){
            sql += ' AND TBOM.PRIORIDADE = "'+this.req.body.prioridade+'"';
        }
        if(this.req.body.locinst){
            sql += ' AND TBOM.LOC_INST_ATRIB = "'+this.req.body.locinst+'"';
        }
        if(this.req.body.idct){
            sql += ' AND TBOM.IDCT = "'+this.req.body.idct+'"';
        }
        if(this.req.body.idlayout){
            sql += ' AND TBOM.IDLAYOUT = "'+this.req.body.idlayout+'"';
        }
        if(this.req.body.tpom){
            sql += ' AND TBOM.TPOM = "'+this.req.body.tpom+'"';
        }
        if(this.req.body.sintoma){
            sql += ' AND TBOM.SINTOMA = "'+this.req.body.sintoma+'"';
        }
        if(this.req.body.causadef){
            sql += ' AND TBOM.CAUSADEF = "'+this.req.body.causadef+'"';
        }
        if(this.req.body.requerparada){
            sql += ' AND TBOM.REQUERPARADA = "'+this.req.body.requerparada+'"';
        }
        if(this.req.body.idsap){
            sql += ' AND TBOM.IDSAP = "'+this.req.body.idsap+'"';
        }
        if(this.req.body.id){
            sql += ' AND TBOM.ID = "'+this.req.body.id+'"';
        }


        if(this.req.body.geracaoMin){
            sql += ' AND TBOM.DTGERACAO >= "'+this.req.body.geracaoMin+'"';
        }
        if(this.req.body.geracaoMax){
            sql += ' AND TBOM.DTGERACAO <= "'+this.req.body.geracaoMax+'"';
        }
        if(this.req.body.iniPlanMin){
            sql += ' AND TBOM.DT_INI_PLAN >= "'+this.req.body.iniPlanMin+'"';
        }
        if(this.req.body.iniPlanMax){
            sql += ' AND TBOM.DT_INI_PLAN <= "'+this.req.body.iniPlanMax+'"';
        }
        if(this.req.body.iniProgMin){
            sql += ' AND TBOM.DT_INI_PROG >= "'+this.req.body.iniProgMin+'"';
        }
        if(this.req.body.iniProgMax){
            sql += ' AND TBOM.DT_INI_PROG <= "'+this.req.body.iniProgMax+'"';
        }
        if(this.req.body.fimPlanMin){
            sql += ' AND TBOM.DT_FIM_PLAN >= "'+this.req.body.fimPlanMin+'"';
        }
        if(this.req.body.fimPlanMax){
            sql += ' AND TBOM.DT_FIM_PLAN <= "'+this.req.body.fimPlanMax+'"';
        }
        if(this.req.body.fimProgMin){
            sql += ' AND TBOM.DT_FIM_PROG >= "'+this.req.body.fimProgMin+'"';
        }
        if(this.req.body.fimProgMax){
            sql += ' AND TBOM.DT_FIM_PROG <= "'+this.req.body.fimProgMax+'"';
        }


        if(this.req.body.orderbydesc){
            sql += ' ORDER BY '+this.req.body.orderbydesc+' DESC';
        }else if(this.req.body.orderbyasc){
            sql += ' ORDER BY '+this.req.body.orderbyasc+' ASC';
        }

        sql+=';';
        return sql;
    }


    @Post('/GetOMFiltrada')
    public Get() {
        var jwtss = new jwts();
        
        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false){
            return retorno.res;
        }else{
        new MySQLFactory().getConnection().select(this.selectSQL()).subscribe(
            (data: any) => {
                this.sendAnswer(data);
            },
            (error: any) => {
                this.sendError(error);
            }
        );}
    }
    defineVisibility() {
        this.actionEscope = ActionType.atPublic;
    }
}