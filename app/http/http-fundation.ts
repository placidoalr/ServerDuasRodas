import axios from 'axios';
import {Observable} from 'rxjs';


export class HttpFundation {

    private makeRequest(url : string, method : string, headers : any, body : any, observer : any){
        let options : any = {
            url : url,
            method : method,
            headers : headers          
        };      
        
        axios.request(options).then( response =>{
            observer.next(response.data);
            observer.complete();
        })
        .catch(error => {
            if (error.response){
                observer.error(error.response.data);
            } else if (error.request){
                observer.error(error.request);
            } else {
                console.log(error);
                observer.error({'error' : 'Axios dont know what happen'});
            }
        });
    }

    public get(url : string, headers : any = {}) : Observable<any>{
        return new Observable(observer => {
            this.makeRequest(url, 'GET', headers, {}, observer);
        });
    }

    public post(url : string, body : any, headers : any = {}) : Observable<any>{
        return new Observable(observer => {
            this.makeRequest(url, 'POST', headers, body, observer);
        });
    }
    
    public put(url : string, body : any, headers : any = {}) : Observable<any>{
        return new Observable(observer => {
            this.makeRequest(url, 'PUT', headers, body, observer);
        });
    }    

    public patch(url : string, body : any, headers : any = {}) : Observable<any>{
        return new Observable(observer => {
            this.makeRequest(url, 'PATCH', headers, body, observer);
        });
    }  
    
    public delete(url : string, headers : any = {}) : Observable<any>{
        return new Observable(observer => {        
            this.makeRequest(url, 'DELETE', headers, {}, observer);            
        });
    }    
}