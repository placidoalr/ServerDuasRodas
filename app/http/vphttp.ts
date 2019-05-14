import {HttpFundation} from './http-fundation';

export class VpHttp {
    public url : string = '';
    public accessToken : any = null;
    public cache : boolean = false;

    private http : HttpFundation;

    constructor(private initialUrl : string = ''){
        this.http = new HttpFundation();
        this.url = initialUrl;
    }

    private prepareHeaders(contentType: boolean) {
        let headers : any = {};

        headers['Accept'] = 'application/json';
    
        if (!this.cache) {
            headers['Cache-Control'] = 'no-cache';
        }
    
        if (contentType) {
            headers['Content-Type'] = 'application/json';
        }
    
        if (this.accessToken === '') {
          this.accessToken = null;
        }
    
        if (this.accessToken != null) {
            headers['Authorization'] = 'bearer ' + this.accessToken;          
        }
    
        return headers;
    }

    public post(object : any) {
        let body = '';
    
        let headers = this.prepareHeaders(true);
    
        if (object !== null && object !== undefined) {
          body = JSON.stringify(object);
        }
    
        return this.http.post(this.url, body, headers);
    }

    public put(object : any) {
      let body = '';
    
      const headers = this.prepareHeaders(true);
    
      if (object !== null && object !== undefined) {
        body = JSON.stringify(object);
      }
    
      return this.http.put(this.url, body, headers);
    }
    
    public patch(object : any) {
      let body = '';
    
      const headers = this.prepareHeaders(true);
    
      if (object !== null && object !== undefined) {
        body = JSON.stringify(object);
      }
    
      return this.http.patch(this.url, body, headers);
    }
    
    public get() {
      let headers = this.prepareHeaders(false);
    
      return this.http.get(this.url, headers);
    }      

}