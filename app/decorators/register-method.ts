import {ApplyRoutes} from '../kernel/routes';
import {Route, HttpMethod} from '../kernel/route-types';

var singleton = require('../kernel/singleton');

export class RegisterMethods{
    constructor(private target : any, private key : any = null , private descriptor : any = null, private httpMethod : HttpMethod, private url : string){
        this.make();
    }

    private make(){
        if (this.key === null || this.descriptor === null){                        
            return this.descriptor;
        }

        if (this.url.length > 0 && this.url[0] !== '/'){
            this.url = '/' + this.url;
        }      
        
        let methods : Array<Route> = [];  
        
        switch (this.httpMethod){
            case HttpMethod.get:
                console.log('Registrando ' + 'GET: ' + this.url);
            break;

            case HttpMethod.post:
                console.log('Registrando ' + 'POST: ' + this.url);
            break;
            
            case HttpMethod.put:
                console.log('Registrando ' + 'PUT: ' + this.url);
            break;
            
            case HttpMethod.patch:
                console.log('Registrando ' + 'PATCH: ' + this.url);
            break;            
        }

        methods.push({
            httpMethod : this.httpMethod,
            methodName : this.key,
            routeName : this.url,
            classType : this.target 
        });        

        new ApplyRoutes(singleton.getExpressApp(), methods);
    }
}