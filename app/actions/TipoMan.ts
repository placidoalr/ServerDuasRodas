import {Get, Patch, Post, Put} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import { MySQLFactory } from '../mysql/mysql_factory';

export class TipoManAction extends Action{

    private validateData(){
        new KernelUtils().createExceptionApiError('1001', 'Informe o nome do tipo de manutenção', this.req.body.name == '' || this.req.body.name == undefined);
    }

    private generateSQL(){
        return 'select * from TBTIPOMAN where TBTIPOMAN.ID = \'' + this.req.body.ID + '\' AND STATUS = 1;';
    }

    private selectSQL() : string {
        return 'select ID,NOME from TBTIPOMAN where STATUS = 1;';
    }

    private deleteSQL() : string {
        return 'UPDATE TBTIPOMAN SET STATUS = \'0\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    }

    private editSQL() : string {
        
        return 'UPDATE TBTIPOMAN SET NOME = \'' + this.req.body.name + '\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    }


    private insertSQL() : string{
        return 'insert into TBTIPOMAN (TBTIPOMAN.NOME ) values (\''+ this.req.body.name+'\');';
    }


    @Post('/AddTIPOMAN')
    public Post(){
        this.validateData();

        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
            (data : any) => {
                if (data.length || data.length > 0){
                    //console.log("Centro de trabalho já existe "+data);
                  this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Tipo de manutenção já existe'));
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

    @Get('/GetTIPOMAN')
    public GetTIPOMAN(){
        
        new MySQLFactory().getConnection().select(this.selectSQL()).subscribe(
            (data : any) => {
                this.sendAnswer(data);
            },
            (error : any) => {
                this.sendError(error);
            }
        );
    }

    @Post('/DelTIPOMAN')
    public PatchTIPOMAN(){
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
    @Post('/EditTIPOMAN')
    public EditTIPOMAN(){

        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
            (data : any) => {
                if (data.length || data.length > 0){
                    //console.log(data);
                  this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Novo tipo de manutenção já existe'));
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





    