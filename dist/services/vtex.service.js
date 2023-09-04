"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VtexService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const axios_1 = tslib_1.__importDefault(require("axios"));
const datasources_1 = require("../datasources");
let VtexService = exports.VtexService = class VtexService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async fetchFromEndpoint(endpoint) {
        try {
            const response = await axios_1.default.get(`${this.dataSource.settings.baseURL}/${endpoint}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-VTEX-API-AppToken': 'RVXQMZYNRRZNTMEURBRBHPRCWYMITOEUNUPISMZTCCAGROZIUTHBZFUCZKIVIWSHJPAREKDSZSKDTFKGQZHNBKKXLIANVJLFBTJJBUWJJNDQTJVQKXLOKCMFYHWORAVT',
                    'X-VTEX-API-AppKey': 'vtexappkey-skillnet-VOZXMR'
                }
            });
            return response.data;
        }
        catch (error) {
            throw error;
        }
    }
    // async getVtexCategoryTree(): Promise<any> {
    //   const endpoint = 'api/catalog_system/pub/category/tree/2';
    //   return this.fetchFromEndpoint(endpoint);
    // }
    // async getVtexProductDetails(productId: string): Promise<any> {
    //   const endpoint = `api/catalog/pvt/product/${productId}`;
    //   return this.fetchFromEndpoint(endpoint);
    // }
    async getTransformedVtexProductDetails(productId) {
        const endpoint = `api/catalog/pvt/product/${productId}`;
        const response = await this.fetchFromEndpoint(endpoint);
        // return this.fetchFromEndpoint(endpoint);
        const transformedResponse = this.transformProductDetails(response);
        return transformedResponse;
    }
    // async getBestSellingProducts(): Promise<any> {
    //   const endpoint = `api/catalog/pvt/collection/143/products`;
    //   return this.fetchFromEndpoint(endpoint);
    // }
    transformProductDetails(response) {
        return {
            productId: response.Id,
            productName: response.Name,
            category: {
                departmentId: response.DepartmentId,
                categoryId: response.CategoryId,
            },
        };
    }
    async getVtexCategoryTree() {
        const endpoint = 'api/catalog_system/pub/category/tree/2';
        const response = await this.fetchFromEndpoint(endpoint);
        const transformCategoryTree = this.vtextransformCategoryTree(response);
        console.log('transformCategoryTree', transformCategoryTree);
        return transformCategoryTree;
    }
    async getVtexCollection(collectionId) {
        const endpoint = `api/catalog/pvt/collection/${collectionId}/products`;
        var endpointresponse = await this.fetchFromEndpoint(endpoint);
        var collectionPrice = [];
        await Promise.all(endpointresponse.Data.map(async (item, index) => {
            const collectionPriceEndpoint = `api/pricing/prices/${item.SkuId}`;
            var collectionPriceResponse = await this.fetchFromEndpoint(collectionPriceEndpoint);
            if ((collectionPriceResponse === null || collectionPriceResponse === void 0 ? void 0 : collectionPriceResponse.statusCode) == 404) {
                collectionPrice.push({ ...item, price: '' });
            }
            else {
                collectionPrice.push({
                    ...item,
                    price: collectionPriceResponse === null || collectionPriceResponse === void 0 ? void 0 : collectionPriceResponse.costPrice,
                });
            }
        }));
        return collectionPrice;
    }
    async getVtexProducListingPage(categoryId) {
        const childrenendpoint = `api/catalog_system/pub/products/search?fq=C:/${categoryId}/`;
        console.log('wdaw', await this.fetchFromEndpoint(childrenendpoint));
        return await this.fetchFromEndpoint(childrenendpoint);
    }
    async getVtexProductDetails(productId) {
        const endpoint = `api/catalog/pvt/product/${productId}`;
        return this.fetchFromEndpoint(endpoint);
    }
    async getProductById(pid) {
        const endpoint = `api/catalog/pvt/product/${pid}`;
        const response = this.fetchFromEndpoint(endpoint);
        const data = await response;
        console.log("data", data);
        console.log("data.Id", data.Id);
        const endpoint1 = `api/catalog_system/pub/products/variations/${data.Id}`;
        const product_variation = this.fetchFromEndpoint(endpoint1);
        const product_variation_response = await product_variation;
        console.log("product_variation", product_variation);
        product_variation_response['categoryId'] = data.CategoryId;
        product_variation_response['brandId'] = data.BrandId;
        product_variation_response['description'] = data.Description;
        console.log("product_variation_response", product_variation_response);
        const transformVtexPdp = this.transformVtexProductDetailPage(product_variation_response);
        // console.log("transformVtexPdp",transformVtexPdp);
        return transformVtexPdp;
    }
    async getVtexCartDetails() {
        // a7be4a750c55442a865ca49fd22a4232 cart id
        const endpoint = `api/checkout/pub/orderForm/a7be4a750c55442a865ca49fd22a4232`;
        return this.fetchFromEndpoint(endpoint);
    }
    // async getTransformedVtexProductDetails(productId: string): Promise<any> {
    //   const endpoint = `api/catalog/pvt/product/${productId}`;
    //   const response = await this.fetchFromEndpoint(endpoint);
    //   // return this.fetchFromEndpoint(endpoint);
    //   const transformedResponse = this.transformProductDetails(response);
    //   return transformedResponse;
    // }
    async getBestSellingProducts() {
        const endpoint = `api/catalog/pvt/collection/143/products`;
        return this.fetchFromEndpoint(endpoint);
    }
    // private transformProductDetails(response: any): any {
    //   return {
    //     productId: response.Id,
    //     productName: response.Name,
    //     category: {
    //       departmentId: response.DepartmentId,
    //       categoryId: response.CategoryId,
    //     },
    //   };
    // }
    vtextransformCategoryTree(response) {
        // console.log("response1234",response)
        const categoryTreemap = [];
        response === null || response === void 0 ? void 0 : response.map(async (item, index) => {
            const endpoint = `/api/io/_v/api/intelligent-search/product_search/category-1/${item.name}`;
            const response = await this.fetchFromEndpoint(endpoint);
            // item.children.map(async (childitem: any) => {
            //   categoryChildren.push({
            //     Id: childitem.id,
            //     name: childitem.name,
            //     hasChildren: childitem.hasChildren,
            //     url: childitem.url,
            //   });
            // });
            categoryTreemap.push({
                parent_Id: item.id,
                name: item.name,
                hasChildren: item.hasChildren,
                url: item.url,
                // products: [response.products],
            });
        });
        return categoryTreemap;
    }
    CategroychildrenData(response) {
        const categoryChildren = [];
        response === null || response === void 0 ? void 0 : response.map(async (childitem) => {
            categoryChildren.push({
                Id: childitem.id,
                name: childitem.name,
                hasChildren: childitem.hasChildren,
                url: childitem.url,
                children: this.CategroychildrenData(childitem.children)
            });
        });
        return categoryChildren;
    }
    transformVtexProductDetailPage(response) {
        return {
            productId: response.productId,
            name: response.name,
            available: response.available,
            skus: response.skus
        };
    }
    filterSubcategories(data) {
        const subcategories = [];
        for (const category of data) {
            console.log('category', category);
            const products = this.getProductsByCategory(category.id);
            if (category.hasChildren) {
                const subcategory = {
                    Id: category.id,
                    name: category.name,
                    url: category.url,
                    products: [products],
                };
                console.log('subcategory', category);
                subcategories.push(subcategory);
            }
        }
        return subcategories;
    }
    async getVtexCategoryTreeloopback() {
        const endpoint = 'api/catalog_system/pub/category/tree/2';
        const response = await this.fetchFromEndpoint(endpoint);
        // console.log('response New', response);
        const transformCategoryTree = this.vtextransformCategoryTreeloopback(response);
        // console.log('transformCategoryTree', transformCategoryTree);
        return transformCategoryTree;
    }
    async getProductsByCategory(categoryId) {
        return new Promise(async (resolve, reject) => {
            try {
                const endpoint = `/api/io/_v/api/intelligent-search/product_search/category-1/${categoryId}`;
                const response = await this.fetchFromEndpoint(endpoint);
                // console.log('response', response);
                resolve(response.products);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async vtextransformCategoryTreeloopback(response) {
        const categoryTreemap = [];
        // Create an array of promises
        const promises = response.map(async (item) => {
            // Wait for the data from getProductsByCategory
            const products = await this.getProductsByCategory(item.name);
            // Push the result into the categoryTreemap
            categoryTreemap.push({
                id: item.id,
                title: item.name,
                url: item.url,
                products: products
            });
        });
        // Wait for all promises to resolve
        await Promise.all(promises);
        return categoryTreemap;
    }
    CategroychildrenDataloopback(response) {
        const categoryChildren = [];
        response === null || response === void 0 ? void 0 : response.map(async (childitem) => {
            const endpoint = `https://skillnet.vtexcommercestable.com.br/api/io/_v/api/intelligent-search/product_search/category-2/${childitem.name}`;
            const response = await this.vtexCategoryTreeLoopbackFetchFromEndpoint(endpoint);
            // console.log('CategroychildrenDataloopback', response);
            if (response) {
                categoryChildren.push({
                    id: childitem.id,
                    title: childitem.name,
                    data: response,
                });
            }
        });
        return categoryChildren;
    }
    async vtexCategoryTreeLoopbackFetchFromEndpoint(endpoint) {
        try {
            const response = await axios_1.default.get(`${endpoint}`, {
                headers: {
                    Accept: 'application/json',
                    'X-VTEX-API-AppToken': 'RVXQMZYNRRZNTMEURBRBHPRCWYMITOEUNUPISMZTCCAGROZIUTHBZFUCZKIVIWSHJPAREKDSZSKDTFKGQZHNBKKXLIANVJLFBTJJBUWJJNDQTJVQKXLOKCMFYHWORAVT',
                    'X-VTEX-API-AppKey': 'vtexappkey-skillnet-VOZXMR',
                },
            });
            return response.data;
        }
        catch (error) {
            console.log('error', error);
            // const data = {
            //   statusCode: error.response.status,
            //   statusText: error.response.statusText,
            //   data: error.response.data,
            // };
            // return data;
        }
    }
};
exports.VtexService = VtexService = tslib_1.__decorate([
    (0, core_1.injectable)(),
    tslib_1.__param(0, (0, core_1.inject)('datasources.vtex')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.VtexDataSource])
], VtexService);
//# sourceMappingURL=vtex.service.js.map