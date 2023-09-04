"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VtexDataSource = void 0;
const tslib_1 = require("tslib");
// vtex.datasource.ts
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const config = {
    name: 'vtex',
    connector: 'rest',
    baseURL: 'https://skillnet.vtexcommercestable.com.br',
};
let VtexDataSource = exports.VtexDataSource = class VtexDataSource extends repository_1.juggler.DataSource {
    constructor(dsConfig = config) {
        super(dsConfig);
    }
};
VtexDataSource.dataSourceName = 'vtex';
VtexDataSource.defaultConfig = config;
exports.VtexDataSource = VtexDataSource = tslib_1.__decorate([
    (0, core_1.lifeCycleObserver)('datasource'),
    tslib_1.__param(0, (0, core_1.inject)('datasources.config.vtex', { optional: true })),
    tslib_1.__metadata("design:paramtypes", [Object])
], VtexDataSource);
//# sourceMappingURL=vtex.datasource.js.map