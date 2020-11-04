import { Get, Patch, Post, Put } from '../decorators';
import { Action } from '../kernel/action';
import { ActionType } from '../kernel/route-types';
import { VPUtils } from '../utils/vputils';
import { KernelUtils } from '../kernel/kernel-utils';
import { MySQL } from '../mysql/mysql';
import { MySQLFactory } from '../mysql/mysql_factory';
import { jwts } from '../utils/jwt';

export class OMUserAction extends Action {

    private validateData() {
        new KernelUtils().createExceptionApiError('1001', 'Informe o ID do Manutentor e ID da Ordem de manutenção', this.req.body.idUser == '' || this.req.body.idUser == undefined || this.req.body.idOm == '' || this.req.body.idOm == undefined);
    }
    private insertSQL(): string {
        return 'insert into TBUSUARIO_WITH_TBOM (TBUSUARIO_WITH_TBOM.IDMANUT, TBUSUARIO_WITH_TBOM.IDOM) values (\'' + this.req.body.idUser + '\',\'' + this.req.body.idOm + '\');';
    }

    private updateOM(): string {
        return 'update TBOM set ESTADO = 2 where TBOM.ID = \'' + this.req.body.idOm + '\';';
    }

    private historico(nome: any): string {
        var desc = 'Manutentor ' + nome + ' assumiu a OM';
        return 'insert into TBHISTORICO (TBHISTORICO.IDUSER, TBHISTORICO.IDOM, TBHISTORICO.DESC, TBHISTORICO.DTALTER) values (\'' + this.req.body.idUser + '\',\'' + this.req.body.idOm + '\',\'' + desc + '\', now());';
    }

    private generateSQL() {
        return 'select * from TBUSUARIO_WITH_TBOM where TBUSUARIO_WITH_TBOM.IDMANUT = \'' + this.req.body.idUser + '\' AND TBUSUARIO_WITH_TBOM.IDOM = \'' + this.req.body.idOm + '\' ;';
    }

    private selectAtribuida(): string {
        if (this.req.body.timein != undefined && this.req.body.timeout != undefined && this.req.body.li != undefined) {
            return 'select TBOM.*,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID INNER JOIN TBUSUARIO_WITH_TBOM ON TBOM.ID = TBUSUARIO_WITH_TBOM.IDOM where TBUSUARIO_WITH_TBOM.IDMANUT = \'' + this.req.body.idUser + '\' AND TBOM.ESTADO = 2 AND  TBOM.STATUS = 1  AND TBOM.DTGERACAO >= ' + this.req.body.timein + ' AND TBOM.DTGERACAO <= ' + this.req.body.timeout + ' AND TBOM.LOC_INST_ATRIB = ' + this.req.body.li + ';';
        } else {
            return 'select TBOM.*,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID INNER JOIN TBUSUARIO_WITH_TBOM ON TBOM.ID = TBUSUARIO_WITH_TBOM.IDOM where TBUSUARIO_WITH_TBOM.IDMANUT = \'' + this.req.body.idUser + '\' AND TBOM.ESTADO = 2 AND  TBOM.STATUS = 1 LIMIT 100;';
        }
    }
    private selectFinalizada(): string {
        if (this.req.body.timein != undefined && this.req.body.timeout != undefined && this.req.body.li != undefined) {
            return 'select TBOM.*,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID INNER JOIN TBUSUARIO_WITH_TBOM ON TBOM.ID = TBUSUARIO_WITH_TBOM.IDOM where TBUSUARIO_WITH_TBOM.IDMANUT = \'' + this.req.body.idUser + '\' AND TBOM.ESTADO = 3 AND  TBOM.STATUS = 1  AND TBOM.DTGERACAO >= ' + this.req.body.timein + ' AND TBOM.DTGERACAO <= ' + this.req.body.timeout + ' AND TBOM.LOC_INST_ATRIB = ' + this.req.body.li + ';';
        } else {
            return 'select TBOM.*,TBLOC_INST.NOME as TBLOC_INSTNOME,TBCT.NOME as TBCTNOME,TBLAYOUTOM.NOME as TBLAYOUTOMNOME,TBTIPOMAN.NOME as TBTIPOMANNOME, TBCAUSADEF.DSCAUSA as TBCAUSADEFNOME, TBPRIORIDADE.NOME as TBPRIORIDADENOME from TBOM INNER JOIN TBLOC_INST ON TBOM.LOC_INST_ATRIB = TBLOC_INST.ID inner join TBCT on TBOM.IDCT = TBCT.ID inner join TBLAYOUTOM on TBOM.IDLAYOUT = TBLAYOUTOM.ID INNER JOIN TBTIPOMAN ON TBOM.TPOM = TBTIPOMAN.ID INNER JOIN TBCAUSADEF ON TBOM.CAUSADEF = TBCAUSADEF.ID INNER JOIN TBPRIORIDADE ON TBOM.PRIORIDADE = TBPRIORIDADE.ID INNER JOIN TBUSUARIO_WITH_TBOM ON TBOM.ID = TBUSUARIO_WITH_TBOM.IDOM where TBUSUARIO_WITH_TBOM.IDMANUT = \'' + this.req.body.idUser + '\' AND TBOM.ESTADO = 3 AND  TBOM.STATUS = 1  LIMIT 100;';
        }
    }

    private validateADM() {
        return 'select CARGO,NOME from TBUSUARIO where TBUSUARIO.ID = \'' + this.req.body.idUser + '\' AND STATUS = 1;';
    }

    @Post('/AddOMUser')
    public Post() {
        var jwtss = new jwts();

        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        } else {
            this.validateData();
            new MySQLFactory().getConnection().select(this.validateADM()).subscribe(
                (adm: any) => {
                    if (adm[0].CARGO == 1) {
                        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
                            (data: any) => {
                                if (data.length || data.length > 0) {
                                    this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Vínculo já existe'));
                                    return;
                                } else {
                                    new MySQLFactory().getConnection().select(this.insertSQL()).subscribe(
                                        (data: any) => {
                                            new MySQLFactory().getConnection().select(this.updateOM()).subscribe(
                                                (data: any) => {
                                                    new MySQLFactory().getConnection().select(this.historico(adm[0].NOME)).subscribe(
                                                        (data: any) => {

                                                        }
                                                    )
                                                });
                                        }
                                    );
                                }
                                this.sendAnswer({
                                    token: new VPUtils().generateGUID().toUpperCase()
                                });
                            },
                            (error: any) => {
                                this.sendError(error);
                            }
                        );
                    } else {
                        this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Usuário não é um manutentor'));
                    }
                });
        }
    }

    @Post('/GetOMByUserIDAtribuida')
    public Get() {
        var jwtss = new jwts();

        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        } else {
            new MySQLFactory().getConnection().select(this.selectAtribuida()).subscribe(
                (data: any) => {
                    this.sendAnswer(data);
                },
                (error: any) => {
                    this.sendError(error);
                }
            );
        }
    }

    @Post('/GetOMByUserIDFinalizada')
    public Get1() {
        var jwtss = new jwts();

        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        } else {
            new MySQLFactory().getConnection().select(this.selectFinalizada()).subscribe(
                (data: any) => {
                    this.sendAnswer(data);
                },
                (error: any) => {
                    this.sendError(error);
                }
            );
        }
    }

    defineVisibility() {
        this.actionEscope = ActionType.atPublic;
    }
}