import {MySQL} from '../mysql/mysql';

export class MySQLFactory {
    constructor(){

    }

    public getConnection() : any{
      return new MySQL('localhost', 'root', '', 'DRDB');
    }
}