import { Get, Patch, Post, Put } from '../decorators';
import { Action } from '../kernel/action';
import { ActionType } from '../kernel/route-types';
import { VPUtils } from '../utils/vputils';
import { KernelUtils } from '../kernel/kernel-utils';
import { MySQL } from '../mysql/mysql';
import { MySQLFactory } from '../mysql/mysql_factory';
import { jwts } from '../utils/jwt';
+2
export class EndOMAction extends Action {
    private validateData() {
        new KernelUtils().createExceptionApiError('1001', 'Informe o ID do Manutentor do Convidado e ID  da Ordem de manutenção', this.req.body.idUser == '' || this.req.body.idUser == undefined || this.req.body.idOm == '' || this.req.body.idOm == undefined);
    }
    private insertSQL(estado: any): string {

        if (estado == 3) {
            return 'update TBOM SET TBOM.ESTADO = \'' + estado + '\' WHERE TBOM.ID = \'' + this.req.body.idOm + '\';';
        } else if (estado == 4) {
            return 'update TBOM SET TBOM.ESTADO = \'' + estado + '\' WHERE TBOM.ID = \'' + this.req.body.idOm + '\';';
        } else {
            return 'update TBOM SET TBOM.ESTADO = \'' + estado + '\' WHERE TBOM.ID = \'' + this.req.body.idOm + '\';';
        }
    }
    private historico(nome: any, estado: any): string {
        var desc = 'Manutentor ' + nome + ' assinou a OM';
        if (estado == 4) {
            desc = 'Líder ' + nome + ' assinou a OM';
        } else if (estado == 5) {
            desc = 'Administrador ' + nome + ' assinou a OM';
        }
        return 'insert into TBHISTORICO (TBHISTORICO.IDUSER, TBHISTORICO.IDOM, TBHISTORICO.DESC, TBHISTORICO.DTALTER) values (\'' + this.req.body.idUser + '\',\'' + this.req.body.idOm + '\',\'' + desc + '\', now());';
    }
    private assinar() {
        return 'insert into TBASSINATURAS (TBASSINATURAS.IDUSER, TBASSINATURAS.IDOM, TBASSINATURAS.DTBAIXA) values (\'' + this.req.body.idUser + '\',\'' + this.req.body.idOm + '\', now());';
    }
    private generateSQL() {
        return 'select ESTADO from TBOM where TBOM.ID = \'' + this.req.body.idOm + '\' AND STATUS = 1;';
    }
    private ADMonOM() {
        return 'select * from TBUSUARIO_WITH_TBOM where TBUSUARIO_WITH_TBOM.IDMANUT = \'' + this.req.body.idUser + '\' AND TBUSUARIO_WITH_TBOM.IDOM = \'' + this.req.body.idOm + '\'';
    }
    private validateADM() {
        return 'select CARGO,NOME from TBUSUARIO where TBUSUARIO.ID = \'' + this.req.body.idUser + '\' AND STATUS = 1;';
    }

    @Post('/EndOM')
    public Post() {
        var jwtss = new jwts();

        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        } else {
            this.validateData();
            new MySQLFactory().getConnection().select(this.validateADM()).subscribe(
                (adm: any) => {
                    var estado = adm[0].CARGO + 2;
                    new MySQLFactory().getConnection().select(this.ADMonOM()).subscribe(
                        (admon: any) => {
                            if (admon.length || admon.length > 0 || adm[0].CARGO > 1) {
                                new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
                                    (data: any) => {
                                        if (data[0].ESTADO > estado) {
                                            this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Estado setado é menor que o atual.'));
                                            return;
                                        } else {
                                            new MySQLFactory().getConnection().select(this.insertSQL(estado)).subscribe(
                                                (data: any) => {
                                                    new MySQLFactory().getConnection().select(this.historico(adm[0].NOME, estado)).subscribe(
                                                        (data: any) => {
                                                            new MySQLFactory().getConnection().select(this.assinar()).subscribe(
                                                                (data: any) => {


                                                                }
                                                            );

                                                        }
                                                    );

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
                                this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Manutentor ADM não está na OM '));
                            }
                        });
                });
        }
    }

    defineVisibility() {
        this.actionEscope = ActionType.atPublic;
    }
}
