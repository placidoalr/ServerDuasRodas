import {Post} from '../decorators';
import {Action} from '../kernel/action';
import {ActionType} from '../kernel/route-types';
import {VPUtils} from '../utils/vputils';
import {KernelUtils} from '../kernel/kernel-utils';
import { MySQLFactory } from '../mysql/mysql_factory';

export class AddCTAction extends Action{

    

    private generateSQL() : string {
        return 'select * from TBCT where TBCT.NOME = \'' + this.req.body.name + '\';';
    }

    defineVisibility() {
        this.actionEscope = ActionType.atPublic;
    }
}