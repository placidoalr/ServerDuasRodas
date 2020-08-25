import {Get, Patch, Post, Put} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import {MySQL} from '../mysql/mysql';
import {MySQLFactory} from '../mysql/mysql_factory';

export class OMMaterialAction extends Action{

    private validateData(){
        new KernelUtils().createExceptionApiError('1001', 'Informe o ID do Manutentor e ID da Ordem de manutenção', this.req.body.idEpi == '' || this.req.body.idEpi == undefined || this.req.body.idOm == '' || this.req.body.idOm == undefined);
    }
    private insertSQL() : string{
        return 'insert into TBEPI_WITH_TBOM (TBEPI_WITH_TBOM.IDEPI, TBEPI_WITH_TBOM.IDOM, TBEPI_WITH_TBOM.IDMANUT) values (\''+ this.req.body.idEpi+'\',\''+ this.req.body.idOm+'\',\''+ this.req.body.idUser+'\');';
    }
    private historico(manutNome : any, epiNome:any) : string{
        
        var desc = 'EPI - Manuntentor '+manutNome+' sinalizou que está utilizando o EPI '+epiNome;
        return 'insert into TBHISTORICO (TBHISTORICO.IDUSER, TBHISTORICO.IDOM, TBHISTORICO.DESC, TBHISTORICO.DTALTER) values (\''+ this.req.body.idUser+'\',\''+ this.req.body.idOm+'\',\''+ desc+'\', now());';
    }
    private generateSQL(){
        return 'select * from TBEPI_WITH_TBOM where TBEPI_WITH_TBOM.IDEPI = \'' + this.req.body.idEpi + '\' AND TBEPI_WITH_TBOM.IDOM = \'' + this.req.body.idOm + '\' AND TBEPI_WITH_TBOM.IDMANUT = \'' + this.req.body.idUser + '\';';
    }
    private getNomes(){
        return 'select NOME,(select NOME from TBEPI where TBEPI.ID = \'' + this.req.body.idEpi + '\' LIMIT 1) as EPINOME from TBUSUARIO where TBUSUARIO.ID = \'' + this.req.body.idUser + '\';';
    }
    private selectSQL(){
        return 'select TBEPI.ID,TBEPI.NOME as EPINOME, TBUSUARIO.NOME as USERNAME, TBEPI.IDOM from TBEPI INNER JOIN TBEPI_WITH_TBOM on TBEPI_WITH_TBOM.IDEPI = TBEPI.ID INNER JOIN TBUSUARIO on  TBEPI_WITH_TBOM.IDMANUT = TBUSUARIO.ID where TBEPI_WITH_TBOM.IDOM = \'' + this.req.body.idOm + '\';';
    }
    
    @Post('/AddOMMaterial')
    public Post(){
        this.validateData();

        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
            (data : any) => {
                if (data.length || data.length > 0){
                  this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Vínculo já existe'));
                  return;
                }else{
                    new MySQLFactory().getConnection().select(this.insertSQL()).subscribe(
                        (data : any) => {
                            new MySQLFactory().getConnection().select(this.getNomes()).subscribe(
                                (dados : any) => {
                                    new MySQLFactory().getConnection().select(this.historico(dados[0].NOME,dados[0].EPINOME)).subscribe(
                                        (dados : any) => {
                                            
                                        }
                                    );
                                }
                            );
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
}
