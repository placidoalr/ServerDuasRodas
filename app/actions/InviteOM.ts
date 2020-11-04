import { Get, Patch, Post, Put } from '../decorators';
import { Action } from '../kernel/action';
import { ActionType } from '../kernel/route-types';
import { VPUtils } from '../utils/vputils';
import { KernelUtils } from '../kernel/kernel-utils';
import { MySQL } from '../mysql/mysql';
import { MySQLFactory } from '../mysql/mysql_factory';
import { jwts } from '../utils/jwt';

export class InviteOMAction extends Action {

    private validateData() {
        new KernelUtils().createExceptionApiError('1001', 'Informe o ID do Manutentor do Convidado e ID  da Ordem de manutenção', this.req.body.idUser == '' || this.req.body.idUser == undefined || this.req.body.idOm == '' || this.req.body.idOm == undefined || this.req.body.idAdm == '' || this.req.body.idAdm == undefined);
    }
    private insertSQL(): string {
        return 'insert into TBUSUARIO_WITH_TBOM (TBUSUARIO_WITH_TBOM.IDMANUT, TBUSUARIO_WITH_TBOM.IDOM) values (\'' + this.req.body.idUser + '\',\'' + this.req.body.idOm + '\');';
    }
    private historico(nomeADM: any, manutNome: any): string {
        var desc = 'Manuntentor ' + nomeADM + ' convidou o manutentor ' + manutNome + ' para a OM';
        return 'insert into TBHISTORICO (TBHISTORICO.IDUSER, TBHISTORICO.IDOM, TBHISTORICO.DESC, TBHISTORICO.DTALTER) values (\'' + this.req.body.idAdm + '\',\'' + this.req.body.idOm + '\',\'' + desc + '\', now());';
    }
    private generateSQL() {
        return 'select * from TBUSUARIO_WITH_TBOM where TBUSUARIO_WITH_TBOM.IDMANUT = \'' + this.req.body.idUser + '\' AND TBUSUARIO_WITH_TBOM.IDOM = \'' + this.req.body.idOm + '\';';
    }
    private ADMonOM() {
        return 'select * from TBUSUARIO_WITH_TBOM where TBUSUARIO_WITH_TBOM.IDMANUT = \'' + this.req.body.idAdm + '\' AND TBUSUARIO_WITH_TBOM.IDOM = \'' + this.req.body.idOm + '\';';
    }
    private validateADM() {
        return 'select CARGO,NOME from TBUSUARIO where TBUSUARIO.ID = \'' + this.req.body.idAdm + '\' AND STATUS = 1;';
    }
    private validateManut() {
        return 'select CARGO,NOME from TBUSUARIO where TBUSUARIO.ID = \'' + this.req.body.idUser + '\' AND STATUS = 1;';
    }

    @Post('/InviteOMUser')
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

                        new MySQLFactory().getConnection().select(this.validateManut()).subscribe(
                            (manut: any) => {
                                if (manut[0].CARGO == 1) {
                                    new MySQLFactory().getConnection().select(this.ADMonOM()).subscribe(
                                        (admon: any) => {
                                            if (admon.length || admon.length > 0) {
                                                new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
                                                    (data: any) => {
                                                        if (data.length || data.length > 0) {
                                                            this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Vínculo já existe'));
                                                            return;
                                                        } else {
                                                            new MySQLFactory().getConnection().select(this.insertSQL()).subscribe(
                                                                (data1: any) => {
                                                                    new MySQLFactory().getConnection().select(this.historico(adm[0].NOME, manut[0].NOME)).subscribe(
                                                                        (data2: any) => {

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
                                } else {

                                    this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Usuário sem permissão para receber a OM'));
                                }
                            });

                    } else {

                        this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Usuário sem permissão para convidar'));
                    }
                });
        }
    }

    defineVisibility() {
        this.actionEscope = ActionType.atPublic;
    }
}
