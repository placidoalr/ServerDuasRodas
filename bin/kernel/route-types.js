"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpMethod;
(function (HttpMethod) {
    HttpMethod[HttpMethod["Undefined"] = 0] = "Undefined";
    HttpMethod[HttpMethod["get"] = 1] = "get";
    HttpMethod[HttpMethod["post"] = 2] = "post";
    HttpMethod[HttpMethod["put"] = 3] = "put";
    HttpMethod[HttpMethod["patch"] = 4] = "patch";
})(HttpMethod = exports.HttpMethod || (exports.HttpMethod = {}));
;
var ActionType;
(function (ActionType) {
    ActionType[ActionType["atPrivate"] = 0] = "atPrivate";
    ActionType[ActionType["atPublic"] = 1] = "atPublic";
    ActionType[ActionType["atPrivateWithApiToken"] = 2] = "atPrivateWithApiToken";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
;
