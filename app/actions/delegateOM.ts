import { Get, Patch, Post, Put } from '../decorators';
import { Action } from '../kernel/action';
import { ActionType } from '../kernel/route-types';
import { VPUtils } from '../utils/vputils';
import { KernelUtils } from '../kernel/kernel-utils';
import { MySQL } from '../mysql/mysql';
import { MySQLFactory } from '../mysql/mysql_factory';
import { jwts } from '../utils/jwt';

export class DelegateOMAction extends Action {

    private validateData() {
        new KernelUtils().createExceptionApiError('1001', 'Informe o ID do Manutentor do ADM e ID  da Ordem de manutenção', this.req.body.idUser == '' || this.req.body.idUser == undefined || this.req.body.idOm == '' || this.req.body.idOm == undefined || this.req.body.idAdm == '' || this.req.body.idAdm == undefined);
    }
    private insertSQL(): string {
        return 'insert into TBUSUARIO_WITH_TBOM (TBUSUARIO_WITH_TBOM.IDMANUT, TBUSUARIO_WITH_TBOM.IDOM) values (\'' + this.req.body.idUser + '\',\'' + this.req.body.idOm + '\');';
    }
    private historico(nomeADM: any, manutNome: any): string {
        var desc = 'Lider ' + nomeADM + ' delegou a OM para o manutentor ' + manutNome;
        return 'insert into TBHISTORICO (TBHISTORICO.IDUSER, TBHISTORICO.IDOM, TBHISTORICO.DESC, TBHISTORICO.DTALTER) values (\'' + this.req.body.idAdm + '\',\'' + this.req.body.idOm + '\',\'' + desc + '\', now());';
    }
    private generateSQL() {
        return 'select * from TBUSUARIO_WITH_TBOM where TBUSUARIO_WITH_TBOM.IDMANUT = \'' + this.req.body.idUser + '\' AND TBUSUARIO_WITH_TBOM.IDOM = \'' + this.req.body.idOm + '\';';
    }
    private updateOM(): string {
        return 'update TBOM set ESTADO = 2 where TBOM.ID = \'' + this.req.body.idOm + '\';';
    }
    private validateADM() {
        return 'select CARGO,NOME from TBUSUARIO where TBUSUARIO.ID = \'' + this.req.body.idAdm + '\' AND STATUS = 1;';
    }
    private validateManut() {
        return 'select CARGO,NOME from TBUSUARIO where TBUSUARIO.ID = \'' + this.req.body.idUser + '\' AND STATUS = 1;';
    }
    @Post('/DelegateOM')
    public Post() {
        var jwtss = new jwts();

        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        } else {
            this.validateData();
            new MySQLFactory().getConnection().select(this.validateADM()).subscribe(
                (adm: any) => {
                    if (adm[0].CARGO != 1) {
                        new MySQLFactory().getConnection().select(this.validateManut()).subscribe(
                            (manut: any) => {
                                if (manut[0].CARGO == 1) {
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
                                                                new MySQLFactory().getConnection().select(this.historico(adm[0].NOME, manut[0].NOME)).subscribe(
                                                                    (data: any) => {
                                                                    });

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

                                    this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Usuário não é um manutentor'));
                                }
                            })
                    } else {

                        this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Usuário sem permissão para delegar'));
                    }
                });
        }
    }

    defineVisibility() {
        this.actionEscope = ActionType.atPublic;
    }
}
