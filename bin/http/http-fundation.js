"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var rxjs_1 = require("rxjs");
var HttpFundation = /** @class */ (function () {
    function HttpFundation() {
    }
    HttpFundation.prototype.makeRequest = function (url, method, headers, body, observer) {
        var options = {
            url: url,
            method: method,
            headers: headers
        };
        axios_1.default.request(options).then(function (response) {
            observer.next(response.data);
            observer.complete();
        })
            .catch(function (error) {
            if (error.response) {
                observer.error(error.response.data);
            }
            else if (error.request) {
                observer.error(error.request);
            }
            else {
                console.log(error);
                observer.error({ 'error': 'Axios dont know what happen' });
            }
        });
    };
    HttpFundation.prototype.get = function (url, headers) {
        var _this = this;
        if (headers === void 0) { headers = {}; }
        return new rxjs_1.Observable(function (observer) {
            _this.makeRequest(url, 'GET', headers, {}, observer);
        });
    };
    HttpFundation.prototype.post = function (url, body, headers) {
        var _this = this;
        if (headers === void 0) { headers = {}; }
        return new rxjs_1.Observable(function (observer) {
            _this.makeRequest(url, 'POST', headers, body, observer);
        });
    };
    HttpFundation.prototype.put = function (url, body, headers) {
        var _this = this;
        if (headers === void 0) { headers = {}; }
        return new rxjs_1.Observable(function (observer) {
            _this.makeRequest(url, 'PUT', headers, body, observer);
        });
    };
    HttpFundation.prototype.patch = function (url, body, headers) {
        var _this = this;
        if (headers === void 0) { headers = {}; }
        return new rxjs_1.Observable(function (observer) {
            _this.makeRequest(url, 'PATCH', headers, body, observer);
        });
    };
    HttpFundation.prototype.delete = function (url, headers) {
        var _this = this;
        if (headers === void 0) { headers = {}; }
        return new rxjs_1.Observable(function (observer) {
            _this.makeRequest(url, 'DELETE', headers, {}, observer);
        });
    };
    return HttpFundation;
}());
exports.HttpFundation = HttpFundation;
