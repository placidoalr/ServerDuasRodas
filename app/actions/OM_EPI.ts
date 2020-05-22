import {Get, Patch, Post, Put} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import {MySQL} from '../mysql/mysql';
import {MySQLFactory} from '../mysql/mysql_factory';

export class OMEPIAction extends Action{

    private validateData(){
        new KernelUtils().createExceptionApiError('1001', 'Informe o ID do Manutentor e ID da Ordem de manutenção', this.req.body.idEpi == '' || this.req.body.idEpi == undefined || this.req.body.idOm == '' || this.req.body.idOm == undefined);
    }
    private insertSQL() : string{
        return 'insert into TBEPI_WITH_TBOM (TBEPI_WITH_TBOM.IDEPI, TBUSUARIO_WITH_TBOM.IDOM, TBUSUARIO_WITH_TBOM.IDMANUT) values (\''+ this.req.body.idEpi+'\',\''+ this.req.body.idOm+'\',\''+ this.req.body.idUser+'\');';
    }
    private generateSQL(){
        return 'select * from TBEPI_WITH_TBOM where TBEPI_WITH_TBOM.IDEPI = \'' + this.req.body.idEpi + '\' AND TBEPI_WITH_TBOM.IDOM = \'' + this.req.body.idOm + '\' AND TBEPI_WITH_TBOM.IDMANUT = \'' + this.req.body.idUser + '\' AND STATUS = 1;';
    }
    private selectSQL(){
        return 'select TBEPI.ID,TBEPI.NOME from TBEPI INNER JOIN TBEPI_WITH_TBOM on TBEPI_WITH_TBOM.IDEPI = TBEPI.ID where TBEPI_WITH_TBOM.IDOM = \'' + this.req.body.idOm + '\';';
    }
    
    @Post('/AddOMEPI')
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
    @Post('/GetOMEPI')
    public Getone(){
        
        new MySQLFactory().getConnection().select(this.selectSQL()).subscribe(
            (data : any) => {
                this.sendAnswer(data);
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
