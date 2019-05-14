"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var route_types_1 = require("./route-types");
var kernel_utils_1 = require("./kernel-utils");
var AccessControl = /** @class */ (function () {
    function AccessControl(action) {
        this.action = action;
        this.observer = null;
    }
    AccessControl.prototype.permitAccess = function () {
        this.observer.next({});
        this.observer.complete();
    };
    AccessControl.prototype.negateAccess = function () {
        this.observer.error(new kernel_utils_1.KernelUtils().createErrorApiObject(404, '1007', 'Access Denied', ''));
        this.observer.complete();
    };
    AccessControl.prototype.grantAccess = function () {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            _this.observer = observer;
            if (_this.action.defineVisibility) {
                _this.action.defineVisibility();
            }
            if (_this.action.actionEscope === route_types_1.ActionType.atPublic) {
                _this.permitAccess();
                return;
            }
            if (_this.action.actionEscope === route_types_1.ActionType.atPrivateWithApiToken) {
                if (_this.action.req.query.apikey === 'FA4B71B066404664A5F3F9BC052072AB') {
                    _this.permitAccess();
                    return;
                }
                else {
                    _this.negateAccess();
                    return;
                }
            }
            _this.negateAccess();
        });
    };
    return AccessControl;
}());
exports.AccessControl = AccessControl;
