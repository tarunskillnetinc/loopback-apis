"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryDataSource = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const config = {
    name: 'category',
    connector: 'rest',
    baseURL: 'https://glue.de.faas-suite-prod.cloud.spryker.toys',
    options: {
        headers: {
            'content-type': 'application/json',
        },
    },
};
let CategoryDataSource = exports.CategoryDataSource = class CategoryDataSource extends repository_1.juggler.DataSource {
    constructor(dsConfig = config) {
        super(dsConfig);
    }
};
CategoryDataSource.dataSourceName = 'category';
CategoryDataSource.defaultConfig = config;
exports.CategoryDataSource = CategoryDataSource = tslib_1.__decorate([
    (0, core_1.lifeCycleObserver)('datasource'),
    tslib_1.__param(0, (0, core_1.inject)('datasources.config.category', { optional: true })),
    tslib_1.__metadata("design:paramtypes", [Object])
], CategoryDataSource);
//# sourceMappingURL=category.datasource.js.map