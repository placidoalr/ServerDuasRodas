"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var mysql = require('mysql');
var MySQL = /** @class */ (function () {
    function MySQL(host, user, password, database, port) {
        if (port === void 0) { port = 3306; }
        this.host = '';
        this.port = 0;
        this.user = '';
        this.password = '';
        this.database = '';
        this.host = host;
        this.port = port;
        this.user = user;
        this.password = password;
        this.database = database;
    }
    MySQL.prototype.executeSelect = function (sql, connection, observer) {
        console.log(sql);
        connection.query(sql, function (error, result, fields) {
            if (error) {
                connection.end();
                observer.error(error);
                observer.complete();
                return;
            }
            if (result) {
                connection.end();
                observer.next(result);
                observer.complete();
                return;
            }
            connection.end();
            observer.error({});
            observer.complete();
        });
    };
    MySQL.prototype.select = function (sql) {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            var connection = mysql.createConnection({
                host: _this.host,
                port: _this.port,
                user: _this.user,
                password: _this.password,
                database: _this.database
            });
            connection.connect(function (error) {
                if (error) {
                    observer.error(error);
                    observer.complete();
                    return;
                }
                _this.executeSelect(sql, connection, observer);
            });
        });
    };
    return MySQL;
}());
exports.MySQL = MySQL;
