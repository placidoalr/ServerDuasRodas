import {ApiError} from './route-types';

export class KernelUtils {

    createErrorApiObject(errorHttp : number, apiError : string, errorDescription : string, adicionalInfo : string = '') : ApiError{
        let error : ApiError = {
          HttpError : errorHttp,
          ApiError : apiError,
          ErrorDescription : errorDescription,
          AditionalInfo : adicionalInfo
        };
        
        return error;
      }

    createExceptionApiError(apiError : string, adicionalInfo : string, condition : boolean = true) : void {
        if (condition){
            throw this.createErrorApiObject(404, apiError, '', adicionalInfo);            
        }
    }   

    createExceptionFromException(e : any){              
        let error : ApiError = this.createErrorApiObject(500, '', '', '');

        if (e.HttpError){
            error.HttpError = e.HttpError;
        }

        if (e.ApiError){
            error.ApiError = e.ApiError;
        }

        if (e.ErrorDescription){
            error.ErrorDescription = e.ErrorDescription;
        }

        if (e.AditionalInfo){
            error.AditionalInfo = e.AditionalInfo;
        }

        throw error;
    }
}