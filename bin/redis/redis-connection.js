"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var redis = __importStar(require("redis"));
var rxjs_1 = require("rxjs");
var config_1 = require("../config");
var RedisConnection = /** @class */ (function () {
    function RedisConnection(redisServer, redisPassword, redisDB, redisPort) {
        if (redisPassword === void 0) { redisPassword = ''; }
        if (redisDB === void 0) { redisDB = 0; }
        if (redisPort === void 0) { redisPort = 6379; }
        this.redisServer = redisServer;
        this.redisPassword = redisPassword;
        this.redisDB = redisDB;
        this.redisPort = redisPort;
        this.connection = null;
    }
    RedisConnection.create = function () {
        var config = new config_1.VpAppConfig();
        return new RedisConnection(config.redisServer(), config.redisPassword(), config.redisDB(), config.redisPort());
    };
    RedisConnection.prototype.connect = function () {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            _this.connection = redis.createClient({
                host: _this.redisServer,
                port: _this.redisPort,
                password: _this.redisPassword,
                db: _this.redisDB,
                retry_strategy: function (options) {
                    return new Error('Não foi possivel conectar ao servidor');
                }
            });
            _this.connection.on('error', function () {
                console.log('Erro on Redis Connection :(');
                observer.error({});
                observer.complete();
            });
            _this.connection.on('connect', function () {
                observer.next({});
                observer.complete();
            });
            _this.connection.on('end', function () {
            });
        });
    };
    RedisConnection.prototype.get = function (key, closeConnection) {
        var _this = this;
        if (closeConnection === void 0) { closeConnection = true; }
        return new rxjs_1.Observable(function (observer) {
            if (_this.connection === null) {
                _this.connect().subscribe(function (data) {
                    _this.executeGet(key, observer, closeConnection);
                }, function (error) {
                    _this.connection = null;
                    observer.error();
                    observer.complete();
                });
            }
            else {
                _this.executeGet(key, observer, closeConnection);
            }
        });
    };
    RedisConnection.prototype.executeGet = function (key, observer, closeConnection) {
        var _this = this;
        if (closeConnection === void 0) { closeConnection = true; }
        this.connection.get(key, function (error, result) {
            if (error) {
                observer.error(error);
                observer.complete();
                if (closeConnection) {
                    _this.close();
                }
            }
            else {
                observer.next(result);
                observer.complete();
                if (closeConnection) {
                    _this.close();
                }
            }
        });
    };
    RedisConnection.prototype.executeSet = function (key, data, observer, closeConnection) {
        var _this = this;
        if (closeConnection === void 0) { closeConnection = true; }
        this.connection.set(key, data, function (error, reply) {
            if (error) {
                observer.error(error);
                observer.complete();
                if (closeConnection) {
                    _this.close();
                }
            }
            else {
                observer.next({});
                observer.complete();
                if (closeConnection) {
                    _this.close();
                }
            }
        });
    };
    RedisConnection.prototype.set = function (key, datastr, closeConnection) {
        var _this = this;
        if (closeConnection === void 0) { closeConnection = true; }
        return new rxjs_1.Observable(function (observer) {
            if (_this.connection === null) {
                _this.connect().subscribe(function (data) {
                    _this.executeSet(key, datastr, observer, closeConnection);
                }, function (error) {
                    _this.connection = null;
                    observer.error();
                    observer.complete();
                });
            }
            else {
                _this.executeSet(key, datastr, observer, closeConnection);
            }
        });
    };
    RedisConnection.prototype.close = function () {
        if (this.connection !== null) {
            this.connection.quit();
            this.connection = null;
        }
    };
    return RedisConnection;
}());
exports.RedisConnection = RedisConnection;
