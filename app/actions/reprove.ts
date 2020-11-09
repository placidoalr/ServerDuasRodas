import { Get, Patch, Post, Put } from '../decorators';
import { Action } from '../kernel/action';
import { ActionType } from '../kernel/route-types';
import { VPUtils } from '../utils/vputils';
import { KernelUtils } from '../kernel/kernel-utils';
import { MySQL } from '../mysql/mysql';
import { MySQLFactory } from '../mysql/mysql_factory';
import { jwts } from '../utils/jwt';

export class ReproveOMAction extends Action {

    private validateData() {
        new KernelUtils().createExceptionApiError('1001', 'Informe o ID do Manutentor do Convidado e ID  da Ordem de manutenção', this.req.body.idUser == '' || this.req.body.idUser == undefined || this.req.body.idOm == '' || this.req.body.idOm == undefined);
    }
    private exit(): string {
        return 'delete from TBUSUARIO_WITH_TBOM where TBUSUARIO_WITH_TBOM.IDMANUT = \'' + this.req.body.idUser + '\' and TBUSUARIO_WITH_TBOM.IDOM = \'' + this.req.body.idOm + '\';';
    }
    private historico(manutNome: any, cargo: any): string {

        var desc = 'Manuntentor ' + manutNome + ' saiu da OM';
        if (cargo == 2) {
            desc = 'Líder ' + manutNome + ' reprovou a OM'
        } else
            if (cargo == 3) {
                desc = 'Administrador ' + manutNome + ' reprovou a OM'
            }
        return 'insert into TBHISTORICO (TBHISTORICO.IDUSER, TBHISTORICO.IDOM, TBHISTORICO.DESC, TBHISTORICO.DTALTER) values (\'' + this.req.body.idUser + '\',\'' + this.req.body.idOm + '\',\'' + desc + '\', now());';
    }
    private ADMonOM() {
        return 'select ID from TBUSUARIO_WITH_TBOM where TBUSUARIO_WITH_TBOM.IDMANUT = \'' + this.req.body.idUser + '\' AND TBUSUARIO_WITH_TBOM.IDOM = \'' + this.req.body.idOm + '\';';
    }
    private Reprove(state: any) {
        return 'update TBOM set ESTADO = ' + state + ' where ID = ' + this.req.body.idOm + ';';
    }
    private rejeitar() {
        return 'DELETE from TBASSINATURAS where IDOM = ' + this.req.body.idOm + ';';
    }
    private validateManut() {
        return 'select CARGO,NOME from TBUSUARIO where TBUSUARIO.ID = \'' + this.req.body.idUser + '\' AND STATUS = 1;';
    }
    private getOMEstado() {
        return 'select ESTADO from TBOM where TBOM.ID = \'' + this.req.body.idOm + '\' AND STATUS = 1;';
    }

    @Post('/ReproveOM')
    public Post() {
        var jwtss = new jwts();

        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        } else {
            this.validateData();


            new MySQLFactory().getConnection().select(this.validateManut()).subscribe(
                (manut: any) => {
                    if (manut[0].CARGO == 1) {
                        new MySQLFactory().getConnection().select(this.getOMEstado()).subscribe(
                            (om: any) => {
                                if (om[0].ESTADO == 2) {
                                    new MySQLFactory().getConnection().select(this.ADMonOM()).subscribe(
                                        (admon: any) => {
                                            if (admon.length || admon.length > 0) {
                                                new MySQLFactory().getConnection().select(this.exit()).subscribe(
                                                    (data1: any) => {
                                                        new MySQLFactory().getConnection().select(this.historico(manut[0].NOME, manut[0].CARGO)).subscribe(
                                                            (data2: any) => {

                                                            }
                                                        );
                                                    }
                                                );

                                                this.sendAnswer({
                                                    token: new VPUtils().generateGUID().toUpperCase()
                                                });


                                            } else {
                                                this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Manutentor ADM não está na OM '));
                                            }
                                        }
                                    );
                                } else {
                                    this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Ordem de manutenção não foi concluída por manutentor'));
                                }
                            }
                        );
                    } else {
                        new MySQLFactory().getConnection().select(this.getOMEstado()).subscribe(
                            (om: any) => {
                                if (om[0].ESTADO == 3 && manut[0].CARGO == 2) {
                                    new MySQLFactory().getConnection().select(this.Reprove(2)).subscribe(
                                        (rep: any) => {
                                            new MySQLFactory().getConnection().select(this.historico(manut[0].NOME, manut[0].CARGO)).subscribe(
                                                (data2: any) => {
                                                    new MySQLFactory().getConnection().select(this.rejeitar()).subscribe(
                                                        (data2: any) => {

                                                        }
                                                    );
                                                }
                                            );
                                        });

                                } else if (om[0].ESTADO == 4 && manut[0].CARGO == 3) {
                                    new MySQLFactory().getConnection().select(this.Reprove(2)).subscribe(
                                        (rep: any) => {
                                            new MySQLFactory().getConnection().select(this.historico(manut[0].NOME, manut[0].CARGO)).subscribe(
                                                (data2: any) => {
                                                    new MySQLFactory().getConnection().select(this.rejeitar()).subscribe(
                                                        (data2: any) => {

                                                        }
                                                    );
                                                }
                                            );
                                        });
                                } else {
                                    this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Ordem de manutenção não pode ser alterada por esse cargo'));
                                }
                            }
                        );

                    }
                }
            );
        }

    }

    defineVisibility() {
        this.actionEscope = ActionType.atPublic;
    }
}
