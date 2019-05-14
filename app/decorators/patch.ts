import {RegisterMethods} from './register-method';
import {HttpMethod} from '../kernel/route-types';


export default function Patch(url : string){
    return function (target : any, key : any = null , descriptor : any = null){
        new RegisterMethods(target, key, descriptor, HttpMethod.patch, url);
    
        return descriptor;
    }
}