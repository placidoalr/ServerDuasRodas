import {Observable} from 'rxjs';
import {ActionType} from './route-types';
import {KernelUtils} from './kernel-utils';

export class AccessControl {
    private observer : any = null;

    constructor(private action : any){
        
    }

    private permitAccess(){
        this.observer.next({});
        this.observer.complete();
    }

    private negateAccess(){
        this.observer.error(new KernelUtils().createErrorApiObject(404, '1007', 'Access Denied', ''));
        this.observer.complete();
    }

    public grantAccess() : Observable<any>{
        return new Observable(observer => {
            this.observer = observer;

            if (this.action.defineVisibility){
                this.action.defineVisibility();
            }

            if (this.action.actionEscope === ActionType.atPublic){
                this.permitAccess();
                return;
            }

            if (this.action.actionEscope === ActionType.atPrivateWithApiToken){
                if (this.action.req.query.apikey === 'FA4B71B066404664A5F3F9BC052072AB'){
                    this.permitAccess();
                    return;
                } else {
                    this.negateAccess();
                    return;
                }
            }
            
            this.negateAccess();
        });
    }
}