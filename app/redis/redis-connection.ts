import * as redis from 'redis';
import {Observable } from 'rxjs';
import {VpAppConfig} from '../config';

export class RedisConnection {
    private connection : any = null;

    static create() : RedisConnection{
        let config = new VpAppConfig();

        return new RedisConnection(config.redisServer(), config.redisPassword(), config.redisDB(), config.redisPort());
    }

    constructor(private redisServer : string, private redisPassword : string = '', private redisDB : number = 0, private redisPort : number = 6379){                
      
    }

    public connect() : Observable<any>{
        return new Observable(observer =>{
            this.connection = redis.createClient({
                host:this.redisServer,
                port:this.redisPort,
                password:this.redisPassword,
                db: this.redisDB,
                retry_strategy : (options : any) =>{
                    return new Error('Não foi possivel conectar ao servidor');
                }
            });

            this.connection.on('error', () => {
                console.log('Erro on Redis Connection :(');
                observer.error({});
                observer.complete();
            });
    
            this.connection.on('connect', () => {                
                observer.next({});
                observer.complete();
            });

            this.connection.on('end', () => {
                
            });
        });
    }

    public get(key : string, closeConnection : boolean = true): Observable<any>{
        return new Observable(observer => {
            if (this.connection === null){
                this.connect().subscribe(
                    data => {
                        this.executeGet(key, observer, closeConnection);
                    },
                    error => {                        
                        this.connection = null;                        
                        observer.error();
                        observer.complete();                        
                    }
                )
            } else {
                this.executeGet(key, observer, closeConnection);
            }
        });
    }

    private executeGet(key : string, observer : any, closeConnection : boolean = true) : void{                
        this.connection.get(key, (error : any, result : any) => {
            if (error){
                observer.error(error);
                observer.complete();

                if (closeConnection){
                    this.close();
                }
            } else {
                observer.next(result);
                observer.complete();
                if (closeConnection){
                    this.close();
                }                    
            }
        });
    }

    private executeSet(key : string, data : string, observer : any, closeConnection : boolean = true) : void{                
        this.connection.set(key, data, (error : any, reply : any) => {
            if (error){
                observer.error(error);
                observer.complete();
                if (closeConnection){
                    this.close();
                }                    
            } else {
                observer.next({});
                observer.complete();                
                if (closeConnection){
                    this.close();
                }                    
            }                
        });
    }

    public set(key : string, datastr : string, closeConnection : boolean = true) : Observable<any>{        
        return new Observable(observer => {
            if (this.connection === null){
                this.connect().subscribe(
                    data => {
                        this.executeSet(key, datastr, observer, closeConnection);
                    },
                    error => {
                        this.connection = null;                        
                        observer.error();
                        observer.complete();                        
                    }
                )
            } else {
                this.executeSet(key, datastr, observer, closeConnection);
            }
        });
    }

    public close(){
        if (this.connection !== null){
            this.connection.quit();
            this.connection = null;
        }        
    }
}
