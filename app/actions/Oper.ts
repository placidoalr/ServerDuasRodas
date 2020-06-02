import {Get, Patch, Post, Put} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import {MySQL} from '../mysql/mysql';
import {MySQLFactory} from '../mysql/mysql_factory';

export class OperAction extends Action{
    private validateData(){
        new KernelUtils().createExceptionApiError('1001', 'Informe o nome da Operação', this.req.body.desc == '' || this.req.body.desc == undefined);
    }

    private generateSQL(){
        return 'select * from TBOPERACAO where TBOPERACAO.DESC = \'' + this.req.body.desc + '\' AND STATUS = 1;';
    }
    private selectSQL() : string {
        return 'select ID,DESC,IDSAP from TBOPERACAO where STATUS = 1;';
    }

    private deleteSQL() : string {
        return 'UPDATE TBOPERACAO SET STATUS = \'0\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    }

    private insertSQL() : string{
        return 'insert into TBOPERACAO (TBOPERACAO.DESC,TBOPERACAO.IDSAP) values (\''+ this.req.body.desc+'\',\''+ this.req.body.idsap+'\');';
    }

    @Post('/AddOPER')
    public Post(){
        this.validateData();

        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
            (data : any) => {
                if (data.length || data.length > 0){
                    //console.log("Operação já existe "+data);
                  this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Operação já existe'));
                  return;
                }else{
                    //console.log(data);
                    new MySQLFactory().getConnection().select(this.insertSQL()).subscribe(
                        (data : any) => {
                            //console.log("DEU CERTO ADD "+data);
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

    @Get('/GetOPER')
    public GetOPER(){
        
        new MySQLFactory().getConnection().select(this.selectSQL()).subscribe(
            (data : any) => {
                this.sendAnswer(data);
            },
            (error : any) => {
                this.sendError(error);
            }
        );
    }

    @Patch('/DelOPER')
    public PatchOPER(){
        //console.log("ENTROU"+this.req.body.desc)
        new MySQLFactory().getConnection().select(this.deleteSQL()).subscribe(
            (data : any) => {
                //console.log(data);
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