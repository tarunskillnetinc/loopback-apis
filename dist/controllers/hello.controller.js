"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelloController = void 0;
const tslib_1 = require("tslib");
const rest_1 = require("@loopback/rest");
class HelloController {
    hello() {
        return 'Hello world!';
    }
}
exports.HelloController = HelloController;
tslib_1.__decorate([
    (0, rest_1.get)('/hello'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", String)
], HelloController.prototype, "hello", null);
//# sourceMappingURL=hello.controller.js.map