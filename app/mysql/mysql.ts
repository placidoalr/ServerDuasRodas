import {Observable} from 'rxjs';
import {Connection} from 'mysql';
const mysql = require('mysql');

export class MySQL {
    private host     : string = '';
    private port     : number = 0 ;
    private user     : string = '';
    private password : string = '';
    private database : string = '';

    constructor (host : string, user : string, password : string, database : string, port : number = 3306){
        this.host     = host    ;
        this.port     = port    ;
        this.user     = user    ;
        this.password = password;
        this.database = database;
    }

    private executeSelect(sql : string, connection : Connection, observer : any) : void{
        console.log(sql);

        connection.query(sql, (error : any, result : any, fields : any) => {
            if (error){
                connection.end();
                observer.error(error);
                observer.complete();
                return;
            }

            if (result){
                connection.end();
                observer.next(result);
                observer.complete();
                return;
            }

            connection.end();
            observer.error({});
            observer.complete();
        });
    }

    public select(sql : string) : Observable<any> {
        return new Observable( observer => {
            let connection : Connection = mysql.createConnection({
                host     : this.host,
                port     : this.port,
                user     : this.user,
                password : this.password,
                database : this.database
            });

            connection.connect((error : any) => {
                if (error){
                    observer.error(error);
                    observer.complete();
                    return;
                }

                this.executeSelect(sql, connection, observer);
            });
        });
    }
}