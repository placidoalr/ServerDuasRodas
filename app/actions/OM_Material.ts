import { Get, Patch, Post, Put } from '../decorators';
import { Action } from '../kernel/action';
import { ActionType } from '../kernel/route-types';
import { VPUtils } from '../utils/vputils';
import { KernelUtils } from '../kernel/kernel-utils';
import { MySQL } from '../mysql/mysql';
import { MySQLFactory } from '../mysql/mysql_factory';
import { jwts } from '../utils/jwt';

export class OMMaterialAction extends Action {

    private validateData() {
        new KernelUtils().createExceptionApiError('1001', 'Informe o ID do Manutentor e ID da Ordem de manutenção', this.req.body.idMat == '' || this.req.body.idMat == undefined || this.req.body.idOm == '' || this.req.body.idOm == undefined);
    }
    private insertSQL(): string {
        return 'insert into TBMAT_WITH_OM (TBMAT_WITH_OM.IDMAT, TBMAT_WITH_OM.IDOM, TBMAT_WITH_OM.QTDE) values (\'' + this.req.body.idMat + '\',\'' + this.req.body.idOm + '\',\'' + this.req.body.qtde + '\');';
    }
    private updateSQL(): string {
        return 'update TBMAT_WITH_OM SET TBMAT_WITH_OM.QTDE = \'' + this.req.body.qtde + '\' where TBMAT_WITH_OM.IDOM = \'' + this.req.body.idOm + '\' AND TBMAT_WITH_OM.IDMAT = \'' + this.req.body.idMat + '\';';
    }
    private deleteSQL(): string {
        return 'delete from TBMAT_WITH_OM where TBMAT_WITH_OM.IDOM = \'' + this.req.body.idOm + '\' AND TBMAT_WITH_OM.IDMAT = \'' + this.req.body.idMat + '\';';
    }
    private historico(manutNome: any, matNome: any): string {

        var desc = 'Material - Manuntentor ' + manutNome + ' adicionou à OM o material ' + matNome;
        return 'insert into TBHISTORICO (TBHISTORICO.IDUSER, TBHISTORICO.IDOM, TBHISTORICO.DESC, TBHISTORICO.DTALTER) values (\'' + this.req.body.idUser + '\',\'' + this.req.body.idOm + '\',\'' + desc + '\', now());';
    }
    private historicoUp(manutNome: any, matNome: any): string {
        var desc = 'Material - Manuntentor ' + manutNome + ' editou a quantidade do material ' + matNome + ' para ' + this.req.body.qtde;
        return 'insert into TBHISTORICO (TBHISTORICO.IDUSER, TBHISTORICO.IDOM, TBHISTORICO.DESC, TBHISTORICO.DTALTER) values (\'' + this.req.body.idUser + '\',\'' + this.req.body.idOm + '\',\'' + desc + '\', now());';
    }
    private historicoDel(manutNome: any, matNome: any): string {
        var desc = 'Material - Manuntentor ' + manutNome + ' deletou o material ' + matNome;
        return 'insert into TBHISTORICO (TBHISTORICO.IDUSER, TBHISTORICO.IDOM, TBHISTORICO.DESC, TBHISTORICO.DTALTER) values (\'' + this.req.body.idUser + '\',\'' + this.req.body.idOm + '\',\'' + desc + '\', now());';
    }
    private generateSQL() {
        return 'select * from TBMAT_WITH_OM where TBMAT_WITH_OM.IDMAT = \'' + this.req.body.idMat + '\' AND TBMAT_WITH_OM.IDOM = \'' + this.req.body.idOm + '\';';
    }
    private getNomes() {
        return 'select NOME,(select TBMATERIAL.DESC from TBMATERIAL where TBMATERIAL.ID = \'' + this.req.body.idMat + '\' LIMIT 1) as MATERIALNOME from TBUSUARIO where TBUSUARIO.ID = \'' + this.req.body.idUser + '\';';
    }

    @Post('/AddOMMaterial')
    public Post() {
        var jwtss = new jwts();

        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        } else {
            this.validateData();

            new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
                (data: any) => {
                    if (data.length || data.length > 0) {
                        this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Vínculo já existe'));
                        return;
                    } else {
                        new MySQLFactory().getConnection().select(this.insertSQL()).subscribe(
                            (data: any) => {
                                new MySQLFactory().getConnection().select(this.getNomes()).subscribe(
                                    (dados: any) => {
                                        new MySQLFactory().getConnection().select(this.historico(dados[0].NOME, dados[0].MATERIALNOME)).subscribe(
                                            (dados: any) => {

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
        }
    }

    @Post('/EditOMMaterialQTD')
    public Edit() {
        var jwtss = new jwts();

        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        } else {
            this.validateData();

            new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
                (data: any) => {
                    if (!data.length || data.length <= 0) {
                        this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Material não encontrado'));
                        return;
                    } else {
                        new MySQLFactory().getConnection().select(this.updateSQL()).subscribe(
                            (data: any) => {
                                new MySQLFactory().getConnection().select(this.getNomes()).subscribe(
                                    (dados: any) => {
                                        new MySQLFactory().getConnection().select(this.historicoUp(dados[0].NOME, dados[0].MATERIALNOME)).subscribe(
                                            (dados: any) => {

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
        }
    }
    @Patch('/DeleteOMMaterial')
    public Delete() {
        var jwtss = new jwts();

        var retorno = jwtss.verifyJWT(this.req, this.resp);
        if (retorno.val == false) {
            return retorno.res;
        } else {
            this.validateData();

            new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
                (data: any) => {
                    if (!data.length || data.length <= 0) {
                        this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Material não encontrado'));
                        return;
                    } else {
                        new MySQLFactory().getConnection().select(this.deleteSQL()).subscribe(
                            (data: any) => {
                                new MySQLFactory().getConnection().select(this.getNomes()).subscribe(
                                    (dados: any) => {
                                        new MySQLFactory().getConnection().select(this.historicoDel(dados[0].NOME, dados[0].MATERIALNOME)).subscribe(
                                            (dados: any) => {

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
        }
    }

    defineVisibility() {
        this.actionEscope = ActionType.atPublic;
    }
}
