"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var KernelUtils = /** @class */ (function () {
    function KernelUtils() {
    }
    KernelUtils.prototype.createErrorApiObject = function (errorHttp, apiError, errorDescription, adicionalInfo) {
        if (adicionalInfo === void 0) { adicionalInfo = ''; }
        var error = {
            HttpError: errorHttp,
            ApiError: apiError,
            ErrorDescription: errorDescription,
            AditionalInfo: adicionalInfo
        };
        return error;
    };
    KernelUtils.prototype.createExceptionApiError = function (apiError, adicionalInfo, condition) {
        if (condition === void 0) { condition = true; }
        if (condition) {
            throw this.createErrorApiObject(404, apiError, '', adicionalInfo);
        }
    };
    KernelUtils.prototype.createExceptionFromException = function (e) {
        var error = this.createErrorApiObject(500, '', '', '');
        if (e.HttpError) {
            error.HttpError = e.HttpError;
        }
        if (e.ApiError) {
            error.ApiError = e.ApiError;
        }
        if (e.ErrorDescription) {
            error.ErrorDescription = e.ErrorDescription;
        }
        if (e.AditionalInfo) {
            error.AditionalInfo = e.AditionalInfo;
        }
        throw error;
    };
    return KernelUtils;
}());
exports.KernelUtils = KernelUtils;
