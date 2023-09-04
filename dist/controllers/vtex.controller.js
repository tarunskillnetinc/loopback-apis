"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VtexController = void 0;
const tslib_1 = require("tslib");
const rest_1 = require("@loopback/rest");
const core_1 = require("@loopback/core");
const services_1 = require("../services");
let VtexController = exports.VtexController = class VtexController {
    constructor(vtexService) {
        this.vtexService = vtexService;
    }
    async getVtexCategoryTree() {
        try {
            const vtexCategoryTree = await this.vtexService.getVtexCategoryTree();
            return vtexCategoryTree;
        }
        catch (error) {
            throw error;
        }
    }
    async getVtexProductDetails(productId) {
        try {
            const vtexProductDetails = await this.vtexService.getVtexProductDetails(productId);
            return vtexProductDetails;
        }
        catch (error) {
            throw error;
        }
    }
    // @get('/vtex-transformed/{productId}')
    // @response(200, {
    //   description: 'Get VTEX product details from the external API',
    // })
    // async gettransformedVtexProductDetails(@param.path.string('productId') productId: string): Promise<any> {
    //   try {
    //     const vtexProductDetails = await this.vtexService.getTransformedVtexProductDetails(productId);
    //     return vtexProductDetails;
    //   } catch (error) {
    //     throw error;
    //   }
    // }
    // @get('/vtex-best-selling-products')
    // @response(200, {
    //   description: 'Get VTEX best selling products from the external API',
    // })
    // async getBestSellingProducts(): Promise<any> {
    //   try {
    //     const bestSellingProducts = await this.vtexService.getBestSellingProducts();
    //     return bestSellingProducts;
    //   } catch (error) {
    //     throw error;
    //   }
    // }
    async getProductById(pid) {
        try {
            const data = await this.vtexService.getProductById(pid);
            const response = await data;
            console.log('danish', response);
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    async getVtexCollection(collectionId) {
        try {
            const vtexProductDetails = await this.vtexService.getVtexCollection(collectionId);
            return vtexProductDetails;
        }
        catch (error) {
            throw error;
        }
    }
    // @get('/vtex-plp')
    // @response(200, {
    //   description: 'Get VTEX product details from the external API',
    // })
    // async getVtexPlp(@param.path.string('categoryId') categoryId: string): Promise<any> {
    //   try {
    //     const vtexProductListingPage = await this.vtexService.getVtexProducListingPage(categoryId);
    //     return vtexProductListingPage;
    //   } catch (error) {
    //     throw error;
    //   }
    // }
    async getVtexCartData() {
        try {
            const vtexCartDetail = await this.vtexService.getVtexCartDetails();
            return vtexCartDetail;
        }
        catch (error) {
            throw error;
        }
    }
    async gettransformedVtexProductDetails(productId) {
        try {
            const vtexProductDetails = await this.vtexService.getTransformedVtexProductDetails(productId);
            return vtexProductDetails;
        }
        catch (error) {
            throw error;
        }
    }
    async getBestSellingProducts() {
        try {
            const bestSellingProducts = await this.vtexService.getBestSellingProducts();
            return bestSellingProducts;
        }
        catch (error) {
            throw error;
        }
    }
    async getVtexPlp(categoryId) {
        try {
            console.log("categoryID", categoryId);
            const vtexProductListingPage = await this.vtexService.getVtexProducListingPage(categoryId);
            return vtexProductListingPage;
        }
        catch (error) {
            throw error;
        }
    }
    async getVtexCategoryTreeloopback() {
        try {
            const vtexCategoryTree = await this.vtexService.getVtexCategoryTreeloopback();
            return vtexCategoryTree;
        }
        catch (error) {
            throw error;
        }
    }
};
tslib_1.__decorate([
    (0, rest_1.get)('/get-vtex-category-tree'),
    (0, rest_1.response)(200, {
        description: 'Get VTEX category tree from the external API',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "getVtexCategoryTree", null);
tslib_1.__decorate([
    (0, rest_1.get)('/vtex-product/{productId}'),
    (0, rest_1.response)(200, {
        description: 'Get VTEX product details from the external API',
    }),
    tslib_1.__param(0, rest_1.param.path.string('productId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "getVtexProductDetails", null);
tslib_1.__decorate([
    (0, rest_1.get)('get-vtex-product-by-id/{pid}'),
    (0, rest_1.response)(200, {
        description: "Get Vtex Products by their respective Id's",
    }),
    tslib_1.__param(0, rest_1.param.path.string('pid')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "getProductById", null);
tslib_1.__decorate([
    (0, rest_1.get)('/vtex-collection/{collectionId}'),
    (0, rest_1.response)(200, {
        description: 'Get VTEX product details from the external API',
    }),
    tslib_1.__param(0, rest_1.param.path.string('collectionId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "getVtexCollection", null);
tslib_1.__decorate([
    (0, rest_1.get)('/vtex-cartDetail'),
    (0, rest_1.response)(200, {
        description: 'Get VTEX cart details from the external API',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "getVtexCartData", null);
tslib_1.__decorate([
    (0, rest_1.get)('/vtex-transformed/{productId}'),
    (0, rest_1.response)(200, {
        description: 'Get VTEX product details from the external API',
    }),
    tslib_1.__param(0, rest_1.param.path.string('productId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "gettransformedVtexProductDetails", null);
tslib_1.__decorate([
    (0, rest_1.get)('/vtex-best-selling-products'),
    (0, rest_1.response)(200, {
        description: 'Get VTEX best selling products from the external API',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "getBestSellingProducts", null);
tslib_1.__decorate([
    (0, rest_1.get)('/vtex-plp/{categoryId}'),
    (0, rest_1.response)(200, {
        description: 'Get VTEX product details from the external API',
    }),
    tslib_1.__param(0, rest_1.param.path.string('categoryId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "getVtexPlp", null);
tslib_1.__decorate([
    (0, rest_1.get)('/get-vtex-category-tree-loopback'),
    (0, rest_1.response)(200, {
        description: 'Get VTEX category tree from the external API',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "getVtexCategoryTreeloopback", null);
exports.VtexController = VtexController = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('services.VtexService')),
    tslib_1.__metadata("design:paramtypes", [services_1.VtexService])
], VtexController);
//# sourceMappingURL=vtex.controller.js.map