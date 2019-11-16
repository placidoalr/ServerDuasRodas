import {Get, Patch, Post, Put} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import { MySQLFactory } from '../mysql/mysql_factory';

export class UserAction extends Action{

    private validateData(){
        new KernelUtils().createExceptionApiError('1001', 'Informe todos os campos corretamente', this.req.body.idsap == null || this.req.body.name == '' || this.req.body.password == '' || this.req.body.idsap == undefined || this.req.body.name == undefined || this.req.body.password == undefined || this.req.body.cdct == undefined || this.req.body.cdct == null || this.req.body.cargo == undefined || this.req.body.cargo == null || this.req.body.login == undefined || this.req.body.login == '');
    }

    private generateSQL() : string {
<<<<<<< HEAD
<<<<<<< HEAD
        return 'select ID from TBUSUARIO where (TBUSUARIO.LOGIN = \'' + this.req.body.login + '\' AND \'' + this.req.body.login + '\' != \'' + this.req.body.loginlast + '\' ) \
        OR (' + this.req.body.idsap + ' != ' + this.req.body.idsaplast + ' AND TBUSUARIO.IDSAP = ' + this.req.body.idsap + ');';
    }
    private generateADDSQL() : string {
        return 'select * from TBUSUARIO where TBUSUARIO.LOGIN = \'' + this.req.body.login + '\' OR TBUSUARIO.IDSAP = ' + this.req.body.idsap + ';';
=======
        return 'select ID from TBUSUARIO where (TBUSUARIO.LOGIN = \'' + this.req.body.login + '\' OR TBUSUARIO.IDSAP = ' + this.req.body.idsap + ') AND (' + this.req.body.idsap + ' != ' + this.req.body.idsaplast + ' AND );';
>>>>>>> parent of cf963a6... Usuário pronto
=======
        return 'select ID from TBUSUARIO where (TBUSUARIO.LOGIN = \'' + this.req.body.login + '\' OR TBUSUARIO.IDSAP = ' + this.req.body.idsap + ') AND (' + this.req.body.idsap + ' != ' + this.req.body.idsaplast + ' AND );';
>>>>>>> parent of cf963a6... Usuário pronto
    }
    private insertSQL() : string{
        return 'insert into TBUSUARIO (TBUSUARIO.IDSAP ,TBUSUARIO.LOGIN, TBUSUARIO.SENHA, TBUSUARIO.CARGO, TBUSUARIO.NOME, TBUSUARIO.CDCT) values (\''+ this.req.body.idsap+'\',\''+ this.req.body.login +'\', \''+ this.req.body.password+'\', \''+ this.req.body.cargo+'\', \''+ this.req.body.name+'\', \''+ this.req.body.cdct+'\');';
    }
    private selectSQL() : string {
        return 'select IDSAP,NOME,LOGIN,SENHA,CARGO,CDCT from TBUSUARIO where STATUS = 1;';
    }

    private deleteSQL() : string {
        return 'UPDATE TBUSUARIO SET STATUS = \'0\' WHERE IDSAP =  \'' + this.req.body.idsap + '\';';
    }

    private editSQL() : string {
        
        return 'UPDATE TBUSUARIO SET NOME = \'' + this.req.body.name + '\', IDSAP = \'' + this.req.body.idsap + '\', \
        LOGIN = \'' + this.req.body.login + '\', SENHA = \'' + this.req.body.password + '\', CARGO = \'' + this.req.body.cargo + '\' \
        , CDCT = \'' + this.req.body.cdct + '\' \
        WHERE IDSAP =  \'' + this.req.body.idsaplast + '\';';
    }
    private reativar() : string {
        
        return 'UPDATE TBUSUARIO SET STATUS = 1 \
        WHERE IDSAP =  \'' + this.req.body.idsap + '\';';
    }

    @Post('/AddUSER')
    public Post(){
        this.validateData();

        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
            (data : any) => {
                if (data.length || data.length > 0){
                    if(data.STATUS == 0){
                        this.reativar();
                        this.sendAnswer({
                            token    : new VPUtils().generateGUID().toUpperCase()
                        });
                        return;
                    }
                    console.log(data);
                  this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Usuário já existe'));
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

    @Get('/GetUSER')
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

    @Patch('/DelUSER')
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
        );
}
@Post('/EditUSER')
    public Edit(){

        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
            (data : any) => {
                if (data.length || data.length > 0 && this.req.body.idsap != this.req.body.idsaplast){
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


/*

export class CTAction extends Action{
    private validateData(){
        new KernelUtils().createExceptionApiError('1001', 'Informe o nome do Centro de Trabalho', this.req.body.name == '' || this.req.body.name == undefined);
    }

    private selectSQL() : string {
        return 'select NOME from TBCT where STATUS = 1;';
    }

    private deleteSQL() : string {
        return 'UPDATE TBCT SET STATUS = \'0\' WHERE NOME =  \'' + this.req.body.name + '\';';
    }

    private editSQL() : string {
        
        return 'UPDATE TBCT SET NOME = \'' + this.req.body.name + '\' WHERE NOME =  \'' + this.req.body.namelast + '\';';
    }


    private insertSQL() : string{
        return 'insert into TBCT (TBCT.NOME ) values (\''+ this.req.body.name+'\');';
    }

    @Post('/AddCT')
    public Post(){
        this.validateData();

        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
            (data : any) => {
                if (data.length || data.length > 0){
                    //console.log("Centro de trabalho já existe "+data);
                  this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Centro de trabalho já existe'));
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

    @Get('/GetCT')
    public GetCT(){
        
        new MySQLFactory().getConnection().select(this.selectSQL()).subscribe(
            (data : any) => {
                this.sendAnswer(data);
            },
            (error : any) => {
                this.sendError(error);
            }
        );
    }

    @Patch('/DelCT')
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
@Post('/EditCT')
    public EditCT(){

        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
            (data : any) => {
                if (data.length || data.length > 0){
                    //console.log(data);
                  this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Novo centro de trabalho já existe'));
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
*/