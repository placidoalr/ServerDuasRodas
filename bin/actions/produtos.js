"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var decorators_1 = require("../decorators");
var action_1 = require("../kernel/action");
var route_types_1 = require("../kernel/route-types");
var kernel_utils_1 = require("../kernel/kernel-utils");
var ProdutosAction = /** @class */ (function (_super) {
    __extends(ProdutosAction, _super);
    function ProdutosAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProdutosAction.prototype.getProdutos = function () {
        var produtos = [];
        var idcategoria = this.req.params.idcategoria;
        new kernel_utils_1.KernelUtils().createExceptionApiError('1002', 'Cidade não informada', (idcategoria == null || idcategoria == undefined));
        if (idcategoria == 1) {
            produtos.push({
                id: 1,
                name: "Cerveja",
                quantity: 10
            }, {
                id: 2,
                name: "Vinho",
                quantity: 15
            }, {
                id: 3,
                name: "Cachaça",
                quantity: 7
            });
        }
        if (idcategoria == 2) {
            produtos.push({
                id: 4,
                name: "Hamburguer",
                quantity: 8
            }, {
                id: 5,
                name: "Escondidinho",
                quantity: 2
            }, {
                id: 6,
                name: "Filé de salmão",
                quantity: 3
            });
        }
        if (idcategoria == 3) {
            produtos.push({
                id: 7,
                name: "Balas",
                quantity: 8
            }, {
                id: 8,
                name: "Picolé",
                quantity: 2
            }, {
                id: 9,
                name: "Guloseimas",
                quantity: 3
            });
        }
        this.sendAnswer(produtos);
    };
    ProdutosAction.prototype.defineVisibility = function () {
        this.actionEscope = route_types_1.ActionType.atPublic;
    };
    __decorate([
        decorators_1.Get('/produtos/:idcategoria'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ProdutosAction.prototype, "getProdutos", null);
    return ProdutosAction;
}(action_1.Action));
exports.ProdutosAction = ProdutosAction;
