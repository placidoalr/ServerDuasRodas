import {HttpMethod, Route, ActionType, ApiError} from './route-types';
import {Observable} from 'rxjs';
import {Request, Response } from 'express';
import {KernelUtils} from './kernel-utils';
import {AccessControl } from './access-control';

export class RouteExecute {
    private action : any;

    constructor(private route : Route, private req : Request, private resp : Response){
        this.action = new route.classType.constructor(this.req, this.resp);
        this.execute();
    }

    private accessControl() : Observable<any>{        
        return new AccessControl(this.action).grantAccess();
    }

    private callMethod() : Observable<any>{
        return new Observable(observer => {
            try { 
                this.action.observer = observer;
                this.action[this.route.methodName]();
            } catch (e){
                new KernelUtils().createExceptionFromException(e);
            }
         });         
    } 

    private execute(){
      this.accessControl().subscribe(
          data => {              
            this.callMethod().subscribe(
                data => {
                  this.sendResponse(data);
                },
                error => {
                    this.sendError(error);
                }
            )
          },
          error => {
              this.sendError(error);
          }
      );
    }

    private sendResponse(data : any =  null) {
        if (data !== null && data !== undefined){
            this.resp.status(this.action.statusCode);
            this.resp.json(data);
        } else {
            this.resp.sendStatus(this.action.statusCode);
        }
    }

    private sendError(e : any = null){
        if (e.HttpError){
            this.action.statusCode = e.HttpError;
        } else {
            this.action.statusCode = 500;
        }

        let error = new KernelUtils().createErrorApiObject(this.action.statusCode, '', '', '');
        
        if (e.ApiError){
            error.ApiError = e.ApiError;
        }

        if (e.ErrorDescription){
            error.ErrorDescription = e.ErrorDescription;
        }

        if (e.AditionalInfo){
            error.AditionalInfo = e.AditionalInfo;
        }

        this.resp.status(this.action.statusCode);
        this.resp.json(error);
    }
}