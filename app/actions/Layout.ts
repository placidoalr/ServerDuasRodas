import {Post, Patch, Get, Put} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import { MySQLFactory } from '../mysql/mysql_factory';

export class LayoutAction extends Action{

    private validateData(){
        new KernelUtils().createExceptionApiError('1001', 'Informe o Layout', this.req.body.name == '' || this.req.body.name == undefined || this.req.body.layout == '' || this.req.body.layout == undefined);
    }

    private generateSQL() : string {
        return 'select ID from TBLAYOUTOM where (TBLAYOUTOM.NOME = \'' + this.req.body.name + '\' AND \'' + this.req.body.name + '\' != \'' + this.req.body.namelast + '\' ) \
         AND STATUS = 1;';
    }
    private generateADDSQL() : string {
        return 'select * from TBLAYOUTOM where TBLAYOUTOM.NOME = \'' + this.req.body.name + '\'  AND STATUS = 1;';
    }
    private insertSQL() : string{
        return 'insert into TBLAYOUTOM (TBLAYOUTOM.NOME, TBLAYOUTOM.CDLAYOUT ) values (\''+ this.req.body.name+'\','+ this.req.body.layout+');';
    }
    private selectSQL() : string{
        return 'select * from TBLAYOUTOM where status = 1';
    }
    private deleteSQL() : string {
        return 'UPDATE TBLAYOUTOM SET STATUS = \'0\' WHERE NOME =  \'' + this.req.body.name + '\';';
    }
    private editSQL() : string {
        
        return 'UPDATE TBLAYOUTOM SET NOME  = \'' + this.req.body.name + '\' WHERE NOME = \'' + this.req.body.namelast + '\' AND STATUS = 1 ;';
    }


    @Post('/AddLAYOUTOM')
    public Post(){
        this.validateData();

        new MySQLFactory().getConnection().select(this.generateADDSQL()).subscribe(
            (data : any) => {
                if (data.length || data.length > 0){
                    console.log(data);
                  this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Layout já existe'));
                  return;
                }else{
                    console.log(data);
                    new MySQLFactory().getConnection().select(this.insertSQL()).subscribe(
                        (data : any) => {
                            console.log(data);
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
    @Get('/GetLAYOUTOM')
    public Get(){
        
        new MySQLFactory().getConnection().select(this.selectSQL()).subscribe(
            (data : any) => {
                this.sendAnswer(data);
            },
            (error : any) => {
                this.sendError(error);
            }
        );
    }
    @Patch('/DelLAYOUTOM')
    public Patch(){
        //console.log("ENTROU"+this.req.body.name)
        new MySQLFactory().getConnection().select(this.deleteSQL()).subscribe(
            (data : any) => {
                //console.log(data);
                this.sendAnswer(data);
            },
            (error : any) => {
                this.sendError(error);
            }
        )};
        @Post('/EditLAYOUTOM')
        public Edit(){
    
            new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
                (data : any) => {
                    if (data.length || data.length > 0 && this.req.body.name != this.req.body.namelast){
                        //console.log(data);
                      this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Usuário já existe'));
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