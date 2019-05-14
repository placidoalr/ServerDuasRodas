export enum HttpMethod {
    Undefined,
    get,
    post,
    put,
    patch
};

export type Route = {
  httpMethod : HttpMethod,
  methodName : string,
  routeName : string,
  classType : any 
};

export enum ActionType {
    atPrivate,
    atPublic,
    atPrivateWithApiToken
};

export type ApiError = {
    HttpError : number,
    ApiError : string,
    ErrorDescription : string,
    AditionalInfo : string
};

export type ApiToken = {
    TokenModel : number,
    TokenType : number,
    TokenID : string,
    TokenExpires : any,
    UserID : string,
    TokenSignature : string,
    App : number
};