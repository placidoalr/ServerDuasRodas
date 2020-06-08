import { Get, Patch, Post, Put } from '../decorators';
import { Action } from '../kernel/action';
import { ActionType } from '../kernel/route-types';
import { VPUtils } from '../utils/vputils';
import { KernelUtils } from '../kernel/kernel-utils';
import { MySQL } from '../mysql/mysql';
import { MySQLFactory } from '../mysql/mysql_factory';

export class EPIAction extends Action {
    private validateData() {
        new KernelUtils().createExceptionApiError('1001', 'Informe o nome do EPI de Trabalho', this.req.body.name == '' || this.req.body.name == undefined);
    }

    private generateSQL() {
        return 'select * from TBEPI where TBEPI.NOME = \'' + this.req.body.name + '\' AND STATUS = 1;';
    }
    private selectS(): string {
        return 'select ID,NOME,IDPADRAO from TBEPI where STATUS = 1 and UPPER(IDPADRAO) = \'S\';';
    }
    private select(): string {
        return 'select ID,NOME,IDPADRAO from TBEPI where STATUS = 1 and UPPER(IDPADRAO) != \'S\';';
    }
    private selectALL(): string {
        return 'select ID,NOME,IDPADRAO from TBEPI where STATUS = 1';
    }

    private deleteSQL(): string {
        return 'UPDATE TBEPI SET STATUS = \'0\' WHERE ID =  \'' + this.req.body.id + '\' AND STATUS = 1;';
    }


    private insertSQL(): string {
        return 'insert into TBEPI (TBEPI.NOME,TBEPI.IDPADRAO) values (\'' + this.req.body.name + '\',\'' + this.req.body.idpadrao + '\');';
    }

    @Post('/AddEPI')
    public Post() {
        this.validateData();

        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
            (data: any) => {
                if (data.length || data.length > 0) {
                    //console.log("Centro de trabalho já existe "+data);
                    this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'EPI já existe'));
                    return;
                } else {
                    //console.log(data);
                    new MySQLFactory().getConnection().select(this.insertSQL()).subscribe(
                        (data: any) => {
                            //console.log("DEU CERTO ADD "+data);
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
    @Get('/GetEPIall')
    public GetepiAll() {

        new MySQLFactory().getConnection().select(this.selectALL()).subscribe(
            (data: any) => {
                this.sendAnswer(data);
            },
            (error: any) => {
                this.sendError(error);
            }
        );
    }
    @Get('/GetEPIs')
    public GetCT() {

        new MySQLFactory().getConnection().select(this.selectS()).subscribe(
            (data: any) => {
                this.sendAnswer(data);
            },
            (error: any) => {
                this.sendError(error);
            }
        );
    }
    @Get('/GetEPI')
    public Get() {

        new MySQLFactory().getConnection().select(this.select()).subscribe(
            (data: any) => {
                this.sendAnswer(data);
            },
            (error: any) => {
                this.sendError(error);
            }
        );
    }

    @Post('/DelEPI')
    public PatchCT() {
        //console.log("ENTROU"+this.req.body.name)
        new MySQLFactory().getConnection().select(this.deleteSQL()).subscribe(
            (data: any) => {
                //console.log(data);
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