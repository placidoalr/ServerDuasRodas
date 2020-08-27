import { Get, Patch, Post, Put } from '../decorators';
import { Action } from '../kernel/action';
import { ActionType } from '../kernel/route-types';
import { VPUtils } from '../utils/vputils';
import { KernelUtils } from '../kernel/kernel-utils';
import { MySQL } from '../mysql/mysql';
import { MySQLFactory } from '../mysql/mysql_factory';

export class OMEPIAction extends Action {

    private validateData() {
        new KernelUtils().createExceptionApiError('1001', 'Informe os EPIS e ID da Ordem de manutenção', this.req.body.epis == '' || this.req.body.epis == undefined || this.req.body.idOm == '' || this.req.body.idOm == undefined);
    }
    private insertSQL(epi: any): string {
        return 'insert into TBEPI_WITH_TBOM (TBEPI_WITH_TBOM.IDEPI, TBEPI_WITH_TBOM.IDOM, TBEPI_WITH_TBOM.IDMANUT) values (\'' + epi + '\',\'' + this.req.body.idOm + '\',\'' + this.req.body.idUser + '\');';
    }
    private historico(manutNome: any, epiNome: any): string {

        var desc = 'EPI - Manuntentor ' + manutNome + ' sinalizou que está utilizando o EPI ' + epiNome;
        return 'insert into TBHISTORICO (TBHISTORICO.IDUSER, TBHISTORICO.IDOM, TBHISTORICO.DESC, TBHISTORICO.DTALTER) values (\'' + this.req.body.idUser + '\',\'' + this.req.body.idOm + '\',\'' + desc + '\', now());';
    }
    private generateSQL(epi:any) {
        return 'select * from TBEPI_WITH_TBOM where TBEPI_WITH_TBOM.IDEPI = \'' + epi + '\' AND TBEPI_WITH_TBOM.IDOM = \'' + this.req.body.idOm + '\' AND TBEPI_WITH_TBOM.IDMANUT = \'' + this.req.body.idUser + '\';';
    }
    private getNomes(epi: any) {
        return 'select NOME,(select NOME from TBEPI where TBEPI.ID = \'' + epi + '\' LIMIT 1) as EPINOME from TBUSUARIO where TBUSUARIO.ID = \'' + this.req.body.idUser + '\';';
    }
    private selectSQL() {
        return 'select TBEPI.ID,TBEPI.NOME as EPINOME, TBUSUARIO.NOME as USERNAME, TBEPI_WITH_TBOM.IDOM from TBEPI INNER JOIN TBEPI_WITH_TBOM on TBEPI_WITH_TBOM.IDEPI = TBEPI.ID INNER JOIN TBUSUARIO on  TBEPI_WITH_TBOM.IDMANUT = TBUSUARIO.ID where TBEPI_WITH_TBOM.IDOM = \'' + this.req.body.idOm + '\';';
    }

    @Post('/AddOMEPI')
    public Post() {

        this.validateData();
        if (this.req.body.epis) {
            this.req.body.epis.forEach((epi: any) => {
                new MySQLFactory().getConnection().select(this.insertSQL(epi)).subscribe(

                    new MySQLFactory().getConnection().select(this.generateSQL(epi)).subscribe(
                        (data: any) => {
                            if (data.length || data.length > 0) {
                                this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Vínculo já existe'));
                                return;
                            } else {

                                new MySQLFactory().getConnection().select(this.insertSQL(epi)).subscribe(
                                    (data: any) => {
                                        new MySQLFactory().getConnection().select(this.getNomes(epi)).subscribe(
                                            (dados: any) => {
                                                new MySQLFactory().getConnection().select(this.historico(dados[0].NOME, dados[0].EPINOME)).subscribe(
                                                    (dados: any) => {

                                                    }
                                                );
                                            }
                                        );
                                    }
                                );
                            }
                            
                        },
                        (error: any) => {
                            this.sendError(error);
                        }

                    ));
            });
            this.sendAnswer({
                token: new VPUtils().generateGUID().toUpperCase()
            });
        }
    }
    @Post('/GetOMEPI')
    public Getone() {

        new MySQLFactory().getConnection().select(this.selectSQL()).subscribe(
            (data: any) => {
                this.sendAnswer(data);
            },
            (error: any) => {
                this.sendError(error);
            }
        );
    }
    defineVisibility() {
        this.actionEscope = ActionType.atPublic;
    }
}
