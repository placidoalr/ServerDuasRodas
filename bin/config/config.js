"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VpAppConfig = /** @class */ (function () {
    function VpAppConfig() {
        this.debug = false;
    }
    VpAppConfig.prototype.redisServer = function () {
        var result = '';
        if (this.debug) {
            result = 'localhost';
        }
        if (!this.debug) {
            if (process.env.REDIS_SERVER !== undefined) {
                result = process.env.REDIS_SERVER;
            }
        }
        return result;
    };
    VpAppConfig.prototype.redisPassword = function () {
        var result = '';
        if (!this.debug) {
            if (process.env.REDIS_PASSWORD !== undefined) {
                result = process.env.REDIS_PASSWORD;
            }
        }
        return result;
    };
    VpAppConfig.prototype.redisPort = function () {
        var result = 6379;
        if (!this.debug) {
            if (process.env.REDIS_PORT !== undefined) {
                result = Number(process.env.REDIS_PORT);
            }
        }
        return result;
    };
    VpAppConfig.prototype.redisDB = function () {
        var result = 0;
        if (!this.debug) {
            if (process.env.REDIS_DB !== undefined) {
                result = Number(process.env.REDIS_DB);
            }
        }
        return result;
    };
    return VpAppConfig;
}());
exports.VpAppConfig = VpAppConfig;
