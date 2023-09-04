"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreesService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const axios_1 = tslib_1.__importDefault(require("axios"));
const datasources_1 = require("../datasources");
let TreesService = exports.TreesService = class TreesService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async fetchFromEndpoint(endpoint) {
        try {
            const response = await axios_1.default.get(`${this.dataSource.settings.baseURL}/${endpoint}`);
            return response.data;
        }
        catch (error) {
            throw error;
        }
    }
    async getConcreteProductDetails(productId) {
        const endpoint = `concrete-products/${productId}?include=concrete-product-image-sets%252cconcrete-product-availabilities`;
        return this.fetchFromEndpoint(endpoint);
    }
    async getBestSellingProduct() {
        const endpoint = `concrete-products/099_27207215?include=concrete-product-availabilities%2Cconcrete-product-image-sets%2Cconcrete-product-prices`;
        const response = await this.fetchFromEndpoint(endpoint);
        const transformedResponse = this.extractDesiredFields(response);
        return transformedResponse;
    }
    extractDesiredFields(response) {
        var _a, _b, _c;
        // Extract desired fields from the API response
        const data = response.data;
        const attributes = data.attributes;
        const imageSet = response.included.find((item) => item.type === 'concrete-product-image-sets');
        const largeImageUrl = (_c = (_b = (_a = imageSet === null || imageSet === void 0 ? void 0 : imageSet.attributes) === null || _a === void 0 ? void 0 : _a.imageSets[0]) === null || _b === void 0 ? void 0 : _b.images[0]) === null || _c === void 0 ? void 0 : _c.externalUrlLarge;
        // Create a new response with the desired information
        return {
            productId: attributes.sku,
            skuId: attributes.sku,
            name: attributes.name,
            largeImageUrl: largeImageUrl,
        };
    }
    async getCatalogSearchSuggestions(query) {
        const endpoint = `catalog-search-suggestions?q=${query}`;
        const response = await this.fetchFromEndpoint(endpoint);
        // Extract and transform the desired fields from the response
        // const transformedResponse = this.transformCatalogSearchSuggestions(response);
        return response;
    }
    transformCatalogSearchSuggestions(response) {
        var _a, _b, _c;
        const data = response.data;
        const transformedSuggestions = ((_c = (_b = (_a = data[0]) === null || _a === void 0 ? void 0 : _a.attributes) === null || _b === void 0 ? void 0 : _b.abstractProducts) === null || _c === void 0 ? void 0 : _c.map((item) => {
            var _a;
            return {
                ProductId: item.abstractSku,
                SkuId: item.abstractSku,
                ProductName: item.abstractName,
                price: item.price,
                SkuImageUrl: ((_a = item.images[0]) === null || _a === void 0 ? void 0 : _a.externalUrlLarge) || null,
            };
        })) || [];
        return transformedSuggestions;
    }
};
exports.TreesService = TreesService = tslib_1.__decorate([
    (0, core_1.injectable)(),
    tslib_1.__param(0, (0, core_1.inject)('datasources.category')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.CategoryDataSource])
], TreesService);
//# sourceMappingURL=trees.service.js.map