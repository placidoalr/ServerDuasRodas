"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_fundation_1 = require("./http-fundation");
var VpHttp = /** @class */ (function () {
    function VpHttp(initialUrl) {
        if (initialUrl === void 0) { initialUrl = ''; }
        this.initialUrl = initialUrl;
        this.url = '';
        this.accessToken = null;
        this.cache = false;
        this.http = new http_fundation_1.HttpFundation();
        this.url = initialUrl;
    }
    VpHttp.prototype.prepareHeaders = function (contentType) {
        var headers = {};
        headers['Accept'] = 'application/json';
        if (!this.cache) {
            headers['Cache-Control'] = 'no-cache';
        }
        if (contentType) {
            headers['Content-Type'] = 'application/json';
        }
        if (this.accessToken === '') {
            this.accessToken = null;
        }
        if (this.accessToken != null) {
            headers['Authorization'] = 'bearer ' + this.accessToken;
        }
        return headers;
    };
    VpHttp.prototype.post = function (object) {
        var body = '';
        var headers = this.prepareHeaders(true);
        if (object !== null && object !== undefined) {
            body = JSON.stringify(object);
        }
        return this.http.post(this.url, body, headers);
    };
    VpHttp.prototype.put = function (object) {
        var body = '';
        var headers = this.prepareHeaders(true);
        if (object !== null && object !== undefined) {
            body = JSON.stringify(object);
        }
        return this.http.put(this.url, body, headers);
    };
    VpHttp.prototype.patch = function (object) {
        var body = '';
        var headers = this.prepareHeaders(true);
        if (object !== null && object !== undefined) {
            body = JSON.stringify(object);
        }
        return this.http.patch(this.url, body, headers);
    };
    VpHttp.prototype.get = function () {
        var headers = this.prepareHeaders(false);
        return this.http.get(this.url, headers);
    };
    return VpHttp;
}());
exports.VpHttp = VpHttp;
