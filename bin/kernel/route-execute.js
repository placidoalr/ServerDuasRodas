"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var kernel_utils_1 = require("./kernel-utils");
var access_control_1 = require("./access-control");
var RouteExecute = /** @class */ (function () {
    function RouteExecute(route, req, resp) {
        this.route = route;
        this.req = req;
        this.resp = resp;
        this.action = new route.classType.constructor(this.req, this.resp);
        this.execute();
    }
    RouteExecute.prototype.accessControl = function () {
        return new access_control_1.AccessControl(this.action).grantAccess();
    };
    RouteExecute.prototype.callMethod = function () {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            try {
                _this.action.observer = observer;
                _this.action[_this.route.methodName]();
            }
            catch (e) {
                new kernel_utils_1.KernelUtils().createExceptionFromException(e);
            }
        });
    };
    RouteExecute.prototype.execute = function () {
        var _this = this;
        this.accessControl().subscribe(function (data) {
            _this.callMethod().subscribe(function (data) {
                _this.sendResponse(data);
            }, function (error) {
                _this.sendError(error);
            });
        }, function (error) {
            _this.sendError(error);
        });
    };
    RouteExecute.prototype.sendResponse = function (data) {
        if (data === void 0) { data = null; }
        if (data !== null && data !== undefined) {
            this.resp.status(this.action.statusCode);
            this.resp.json(data);
        }
        else {
            this.resp.sendStatus(this.action.statusCode);
        }
    };
    RouteExecute.prototype.sendError = function (e) {
        if (e === void 0) { e = null; }
        if (e.HttpError) {
            this.action.statusCode = e.HttpError;
        }
        else {
            this.action.statusCode = 500;
        }
        var error = new kernel_utils_1.KernelUtils().createErrorApiObject(this.action.statusCode, '', '', '');
        if (e.ApiError) {
            error.ApiError = e.ApiError;
        }
        if (e.ErrorDescription) {
            error.ErrorDescription = e.ErrorDescription;
        }
        if (e.AditionalInfo) {
            error.AditionalInfo = e.AditionalInfo;
        }
        this.resp.status(this.action.statusCode);
        this.resp.json(error);
    };
    return RouteExecute;
}());
exports.RouteExecute = RouteExecute;
