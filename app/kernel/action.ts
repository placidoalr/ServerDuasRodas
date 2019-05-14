import {Request, Response } from 'express';
import {ActionType} from './route-types';

export abstract class Action {
    public req          : Request;
    public resp         : Response;
    public observer     : any = null;
    public actionEscope : ActionType = ActionType.atPrivate;

    public statusCode : number = 200;

    constructor (req : Request, resp : Response) {
      this.req  = req ;
      this.resp = resp;      
    }
     
    protected sendAnswer(data : any){
        this.observer.next(data);
        this.observer.complete();
    }

    protected sendError(error : any){
        this.observer.error(error);        
    }

}