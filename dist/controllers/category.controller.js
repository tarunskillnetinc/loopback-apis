"use strict";
// Uncomment these imports to begin using these cool features!
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const services_1 = require("../services");
const rest_1 = require("@loopback/rest");
let CategoryController = exports.CategoryController = class CategoryController {
    constructor(treesService) {
        this.treesService = treesService;
    }
    async getCategoryTrees() {
        try {
            const categoryTrees = await this.treesService.fetchFromEndpoint('category-trees');
            return categoryTrees;
        }
        catch (error) {
            // Handle errors
            throw error;
        }
    }
    async getConcreteProductDetails(productId) {
        try {
            const productDetails = await this.treesService.getConcreteProductDetails(productId);
            return productDetails;
        }
        catch (error) {
            // Handle errors
            throw error;
        }
    }
    async getBestSellingProducts() {
        try {
            const bestSellingProducts = await this.treesService.getBestSellingProduct();
            return bestSellingProducts;
        }
        catch (error) {
            // Handle errors
            throw error;
        }
    }
    async getCatalogSearchSuggestions(query) {
        try {
            const catalogSearchSuggestions = await this.treesService.getCatalogSearchSuggestions(query);
            return catalogSearchSuggestions;
        }
        catch (error) {
            // Handle errors
            throw error;
        }
    }
};
tslib_1.__decorate([
    (0, rest_1.get)('/get-category-trees'),
    (0, rest_1.response)(200, {
        description: 'Get category trees from the external API',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], CategoryController.prototype, "getCategoryTrees", null);
tslib_1.__decorate([
    (0, rest_1.get)('/spryker-product/{productId}'),
    (0, rest_1.response)(200, {
        description: 'Get concrete product details from the external API',
    }),
    tslib_1.__param(0, rest_1.param.path.string('productId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], CategoryController.prototype, "getConcreteProductDetails", null);
tslib_1.__decorate([
    (0, rest_1.get)('/spryker-best-selling-products'),
    (0, rest_1.response)(200, {
        description: 'Get best selling products from the external API',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], CategoryController.prototype, "getBestSellingProducts", null);
tslib_1.__decorate([
    (0, rest_1.get)('/spryker-best-selling/{query}'),
    (0, rest_1.response)(200, {
        description: 'Get VTEX catalog search suggestions from the external API',
    }),
    tslib_1.__param(0, rest_1.param.path.string('query')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], CategoryController.prototype, "getCatalogSearchSuggestions", null);
exports.CategoryController = CategoryController = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('services.TreesService')),
    tslib_1.__metadata("design:paramtypes", [services_1.TreesService])
], CategoryController);
//# sourceMappingURL=category.controller.js.map