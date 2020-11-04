import { Post } from '../decorators';
import { Action } from '../kernel/action';
import { ActionType } from '../kernel/route-types';
import { VPUtils } from '../utils/vputils';
import { KernelUtils } from '../kernel/kernel-utils';
import { MySQL } from '../mysql/mysql';
import { MySQLFactory } from '../mysql/mysql_factory';
require("dotenv-safe").config();
var jwt = require('jsonwebtoken');

export class LogonAction extends Action {

    private validateData() {
        new KernelUtils().createExceptionApiError('1001', 'Usuário e senha inválidos', this.req.body.userName == '' || this.req.body.password == '' || this.req.body.userName == undefined || this.req.body.password == undefined);
    }

    private generateSQL(): string {
        return 'select TBUSUARIO.ID, TBUSUARIO.CARGO, TBCARGO.NOME as CARGONOME from TBUSUARIO INNER JOIN TBCARGO ON TBUSUARIO.CARGO = TBCARGO.ID  where TBUSUARIO.LOGIN = \'' + this.req.body.userName + '\' and TBUSUARIO.SENHA = \'' + this.req.body.password + '\';';
    }


    @Post('/logon')
    public Post() {
        this.validateData();
        new MySQLFactory().getConnection().select(this.generateSQL()).subscribe(
            (data: any) => {
                if (!data.length || data.length != 1) {
                    this.sendError(new KernelUtils().createErrorApiObject(401, '1001', 'Usuário e senha inválidos'));
                    return;
                }
                var id = data[0].ID;
                var token = jwt.sign({ id }, process.env.SECRET, {
                    expiresIn: 18000 // expires in 5min
                });
                this.sendAnswer({
                    token: token,
                    auth: true,
                    userName: this.req.body.userName,
                    id: id,
                    cargoId: data[0].CARGO,
                    cargoNome: data[0].CARGONOME

                });
            },
            (error: any) => {
                this.sendError(error);
            }
        );
    }
    @Post('/logout')
    public Logout() {
        this.sendAnswer({
            auth: false, token: null
        });
    }

    defineVisibility() {
        this.actionEscope = ActionType.atPublic;
    }
}