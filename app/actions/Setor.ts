import {Get, Patch, Post, Put} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import {MySQL} from '../mysql/mysql';
import {MySQLFactory} from '../mysql/mysql_factory';

export class SetorAction extends Action{

    private validateData(){
        new KernelUtils().createExceptionApiError('1001', 'Informe o Setor', this.req.body.name == '' || this.req.body.name == undefined || this.req.body.codigo == '' || this.req.body.codigo == undefined);
    }

    private generateSQL(){
        return 'select * from TBSETOR where (TBSETOR.NOME = \'' + this.req.body.name + '\' AND \'' + this.req.body.name + '\' != \'' + this.req.body.namelast + '\' ) \
        OR (TBSETOR.IDSAP = \'' + this.req.body.codigo + '\' AND \'' + this.req.body.codigo + '\' != \'' + this.req.body.codigolast + '\' ) AND STATUS = 1;';
    }
    private generateADDSQL(){
        return 'select * from TBSETOR where (TBSETOR.NOME = \'' + this.req.body.name + '\' OR TBSETOR.IDSAP = \'' + this.req.body.codigo + '\') AND STATUS = 1;';
    }

    private selectSQL() : string {
        return 'select ID,IDSAP,NOME from TBSETOR where STATUS = 1;';
    }

    private deleteSQL() : string {
        return 'UPDATE TBSETOR SET STATUS = \'0\' WHERE IDSAP =  \'' + this.req.body.codigo + '\' AND STATUS = 1;';
    }

    private editSQL() : string {
        return 'UPDATE TBSETOR SET NOME = \'' + this.req.body.name + '\', IDSAP = \'' + this.req.body.codigo + '\' WHERE NOME =  \'' + this.req.body.namelast + '\' AND IDSAP = \'' + this.req.body.codigolast + '\' AND STATUS = 1;';
    }


    private insertSQL() : string{
        return 'insert into TBSETOR (TBSETOR.NOME,TBSETOR.IDSAP ) values (\''+ this.req.body.name+'\',\''+ this.req.body.codigo+'\');';
    }



    @Post('/AddSETOR')
    public Post(){
        this.validateData();

        new MySQLFactory().getConnection().select(this.generateADDSQL()).subscribe(
            (data : any) => {
                console.log(data);
                if (data.length || data.length > 0){
                    //console.log("Centro de trabalho já existe "+data);
                  this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Setor já existe'));
                  return;
                }else{
                    console.log(data);
                    new MySQLFactory().getConnection().select(this.insertSQL()).subscribe(
                        (data : any) => {
                            console.log("DEU CERTO ADD "+data);
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

    @Get('/GetSETOR')
    public GetSetor(){
        
        new MySQLFactory().getConnection().select(this.selectSQL()).subscribe(
            (data : any) => {
                this.sendAnswer(data);
            },
            (error : any) => {
                this.sendError(error);
            }
        );
    }

    @Patch('/DelSETOR')
    public PatchCT(){
        //console.log("ENTROU"+this.req.body.name)
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
@Post('/EditSETOR')
    public EditSetor(){

        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
            (data : any) => {
                if (data.length || data.length > 0){
                    //console.log(data);
                  this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Novo Setor já existe'));
                  return;
                }else{
                    //console.log(data);
                    new MySQLFactory().getConnection().select(this.editSQL()).subscribe(
                        (data : any) => {
                          //  console.log(data);
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
    defineVisibility() {
        this.actionEscope = ActionType.atPublic;
    }
}



