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
                    Accept: 'application/json',
                    'X-VTEX-API-AppToken': 'RVXQMZYNRRZNTMEURBRBHPRCWYMITOEUNUPISMZTCCAGROZIUTHBZFUCZKIVIWSHJPAREKDSZSKDTFKGQZHNBKKXLIANVJLFBTJJBUWJJNDQTJVQKXLOKCMFYHWORAVT',
                    'X-VTEX-API-AppKey': 'vtexappkey-skillnet-VOZXMR',
                },
            });
            return response.data;
        }
        catch (error) {
            console.log('error', error);
            throw error;
        }
    }
    //for cartapi
    async cartFetchFromEndpoint(endpoint) {
        try {
            const response = await axios_1.default.get(`https://hometest--skillnet.myvtex.com/${endpoint}`, {
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
            const data = {
                statusCode: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
            };
            return data;
        }
    }
    async vtexCategoryTreeLoopbackFetchFromEndpoint(endpoint) {
        try {
            const response = await axios_1.default.get(`${endpoint}`, { timeout: 100000,
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
    async getVtexCategoryTree() {
        const endpoint = 'api/catalog_system/pub/category/tree/2';
        const response = await this.fetchFromEndpoint(endpoint);
        const transformCategoryTree = this.vtextransformCategoryTree(response);
        console.log('transformCategoryTree', transformCategoryTree);
        return transformCategoryTree;
    }
    // async getVtexCategoryTreeloopback(): Promise<any> {
    //   const endpoint = 'api/catalog_system/pub/category/tree/2';
    //   const response = await this.fetchFromEndpoint(endpoint);
    //   const categoryTreemap: any = [];
    //   // const result=this.vtextransformCategoryTree1(response)
    //   const transformCategoryTree =this.vtextransformCategoryTreeloopback(response);
    //   Promise.all(response?.map(async (item: any, index: any) => {
    //     const endpoint = `https://skillnet.vtexcommercestable.com.br/api/io/_v/api/intelligent-search/product_search/category-1/${item.name}`;
    //     const response = await this.vtexCategoryTreeLoopbackFetchFromEndpoint(endpoint)
    //     console.log("response",response)
    //     categoryTreemap.push({
    //       id: item.id,
    //       title: item.name,
    //       data: response.products,
    //     });  
    //   }));
    //   console.log('transformCategoryTree', categoryTreemap);
    //   return categoryTreemap;
    // }
    async getVtexCategoryTreeloopback() {
        const endpoint = 'api/catalog_system/pub/category/tree/2';
        const response = await this.fetchFromEndpoint(endpoint);
        const categoryTreemap = [];
        await Promise.all(response === null || response === void 0 ? void 0 : response.map(async (item, index) => {
            const endpoint = `https://skillnet.vtexcommercestable.com.br/api/io/_v/api/intelligent-search/product_search/category-1/${item.name}`;
            const responseData = await this.vtexCategoryTreeLoopbackFetchFromEndpoint(endpoint);
            console.log("response", responseData);
            await categoryTreemap.push({
                id: item.id,
                title: item.name,
                data: await this.functionVtexCategoryTreeLoopbackForData(responseData),
            });
        }));
        console.log('transformCategoryTree', categoryTreemap);
        return categoryTreemap;
    }
    async functionVtexCategoryTreeLoopbackForData(responseData) {
        const dataArr = [];
        await (responseData === null || responseData === void 0 ? void 0 : responseData.products.map(async (responseitem, index) => {
            const Ddatavar = await {
                attributes: {
                    "sku": responseitem === null || responseitem === void 0 ? void 0 : responseitem.productId,
                    "isDiscontinued": false,
                    "discontinuedNote": null,
                    "averageRating": null,
                    "reviewCount": 0,
                    "productAbstractSku": "232",
                    "name": responseitem === null || responseitem === void 0 ? void 0 : responseitem.productName,
                    "description": responseitem === null || responseitem === void 0 ? void 0 : responseitem.description,
                    "attributes": [],
                    "superAttributesDefinition": [],
                    "metaTitle": null,
                    "metaKeywords": null,
                    "metaDescription": null,
                    "attributeNames": [],
                    "productConfigurationInstance": null,
                    "abstractSku": "232",
                    "url": responseitem === null || responseitem === void 0 ? void 0 : responseitem.link,
                    "price": responseitem.priceRange.sellingPrice.highPrice,
                    "abstractName": responseitem === null || responseitem === void 0 ? void 0 : responseitem.productName,
                    "prices": responseitem === null || responseitem === void 0 ? void 0 : responseitem.priceRange,
                    "images": responseitem === null || responseitem === void 0 ? void 0 : responseitem.images
                },
            };
            await dataArr.push(Ddatavar);
        }));
        return dataArr;
    }
    // private vtextransformCategoryTree1(response: any): any {
    //   console.log("response1234",response)
    //   const categoryTreemap: any = [];
    //   response?.map(async (item: any, index: any) => {
    //     // item.children.map(async (childitem: any) => {
    //     //   categoryChildren.push({
    //     //     Id: childitem.id,
    //     //     name: childitem.name,
    //     //     hasChildren: childitem.hasChildren,
    //     //     url: childitem.url,
    //     //   });
    //     // });
    //     const endpoint = `https://skillnet.vtexcommercestable.com.br/api/io/_v/api/intelligent-search/product_search/category-1/${item.name}`;
    //     const response = await this.vtexCategoryTreeLoopbackFetchFromEndpoint(endpoint)
    //     // console.log("response",response)
    //     categoryTreemap.push({
    //       parent_Id: item.id,
    //       name: item.name,
    //       data: response.products,
    //       hasChildren: item.hasChildren,
    //       url: item.url
    //     });
    //   });
    //   return categoryTreemap;
    // }
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
        console.log("rersrser", categoryId);
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
        const endpoint1 = `api/catalog_system/pub/products/variations/${data.Id}`;
        const product_variation = this.fetchFromEndpoint(endpoint1);
        const product_variation_response = await product_variation;
        product_variation_response['categoryId'] = data.CategoryId;
        product_variation_response['brandId'] = data.BrandId;
        product_variation_response['description'] = data.Description;
        console.log('product_variation_response', product_variation_response);
        const transformVtexPdp = this.transformVtexProductDetailPage(product_variation_response);
        // console.log("transformVtexPdp",transformVtexPdp);
        return transformVtexPdp;
    }
    async getVtexCartDetails() {
        // a7be4a750c55442a865ca49fd22a4232 cart id
        const endpoint = `api/checkout/pub/orderForm/a7be4a750c55442a865ca49fd22a4232`;
        return this.cartFetchFromEndpoint(endpoint);
    }
    async getTransformedVtexProductDetails(productId) {
        const endpoint = `api/catalog/pvt/product/${productId}`;
        const response = await this.fetchFromEndpoint(endpoint);
        // return this.fetchFromEndpoint(endpoint);
        const transformedResponse = this.transformProductDetails(response);
        return transformedResponse;
    }
    async getBestSellingProducts() {
        const endpoint = `api/catalog/pvt/collection/143/products`;
        const response = this.fetchFromEndpoint(endpoint);
        const data = await response;
        var emptyarray = [];
        await Promise.all(data.Data.map(async (items, index) => {
            const endpoint_two = `api/pricing/prices/${items.SkuId}`;
            const product_price_response = await this.fetchFromEndpoint(endpoint_two);
            console.log('danishis', product_price_response);
            items.basePrice = product_price_response.basePrice;
            items.listPrice = product_price_response.costPrice;
            emptyarray.push({ ...items });
            return items;
        }));
        return emptyarray;
    }
    async getNewSellingProducts() {
        const endpoint = `api/catalog/pvt/collection/137/products`;
        const response = this.fetchFromEndpoint(endpoint);
        const data = await response;
        var emptyarray = [];
        await Promise.all(data.Data.map(async (items, index) => {
            const endpoint_two = `api/pricing/prices/${items.SkuId}`;
            const product_price_response = await this.fetchFromEndpoint(endpoint_two);
            console.log('danishis', product_price_response);
            items.basePrice = product_price_response.basePrice;
            items.listPrice = product_price_response.costPrice;
            emptyarray.push({ ...items });
            return items;
        }));
        return emptyarray;
    }
    async getVtexProductByCategory(categoryId) {
        const endpoint = `/api/io/_v/api/intelligent-search/product_search/category-1/${categoryId}`;
        const response = this.fetchFromEndpoint(endpoint);
        const data = await response;
        const product_arr = [];
        await Promise.all(data === null || data === void 0 ? void 0 : data.products.map((items) => {
            var _a;
            product_arr.push({
                product_id: items === null || items === void 0 ? void 0 : items.productId,
                sku_id: "",
                product_name: items === null || items === void 0 ? void 0 : items.productName,
                product_image: (_a = items === null || items === void 0 ? void 0 : items.items[0]) === null || _a === void 0 ? void 0 : _a.images[0].imageUrl,
                product_rating: "",
                alt: "",
                product_description: items === null || items === void 0 ? void 0 : items.description,
                product_features: "",
                product_price: items === null || items === void 0 ? void 0 : items.priceRange,
                product_category: items === null || items === void 0 ? void 0 : items.categoryId,
                product_category_id: items === null || items === void 0 ? void 0 : items.categoriesIds,
                properties: items === null || items === void 0 ? void 0 : items.properties
            });
        }));
        return product_arr;
    }
    async getVtexProductBySubCategory(subCategoryId) {
        const endpoint = `/api/io/_v/api/intelligent-search/product_search/category-2/${subCategoryId}`;
        const response = this.fetchFromEndpoint(endpoint);
        const data = await response;
        const product_arr = [];
        await Promise.all(data === null || data === void 0 ? void 0 : data.products.map((items) => {
            var _a;
            product_arr.push({
                product_id: items === null || items === void 0 ? void 0 : items.productId,
                sku_id: "",
                product_name: items === null || items === void 0 ? void 0 : items.productName,
                product_image: (_a = items === null || items === void 0 ? void 0 : items.items[0]) === null || _a === void 0 ? void 0 : _a.images[0].imageUrl,
                product_rating: "",
                alt: "",
                product_description: items === null || items === void 0 ? void 0 : items.description,
                product_features: "",
                product_price: items === null || items === void 0 ? void 0 : items.priceRange,
                product_category: items === null || items === void 0 ? void 0 : items.categoryId,
                product_category_id: items === null || items === void 0 ? void 0 : items.categoriesIds,
                properties: items === null || items === void 0 ? void 0 : items.properties
            });
        }));
        return product_arr;
    }
    async getVtexProductByQuery(query) {
        const endpoint = `/api/io/_v/api/intelligent-search/product_search/${query}`;
        const response = this.fetchFromEndpoint(endpoint);
        const data = await response;
        const product_arr = [];
        await Promise.all(data === null || data === void 0 ? void 0 : data.products.map((items) => {
            var _a;
            product_arr.push({
                product_id: items === null || items === void 0 ? void 0 : items.productId,
                sku_id: "",
                product_name: items === null || items === void 0 ? void 0 : items.productName,
                product_image: (_a = items === null || items === void 0 ? void 0 : items.items[0]) === null || _a === void 0 ? void 0 : _a.images[0].imageUrl,
                product_rating: "",
                alt: "",
                product_description: items === null || items === void 0 ? void 0 : items.description,
                product_features: "",
                product_price: items === null || items === void 0 ? void 0 : items.priceRange,
                product_category: items === null || items === void 0 ? void 0 : items.categoryId,
                product_category_id: items === null || items === void 0 ? void 0 : items.categoriesIds,
                properties: items === null || items === void 0 ? void 0 : items.properties
            });
        }));
        return product_arr;
    }
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
    vtextransformCategoryTreeloopback(response) {
        // console.log("response1234",response)
        const categoryTreemap = [];
        response === null || response === void 0 ? void 0 : response.map(async (item, index) => {
            var childrendata = this.CategroychildrenDataloopback(item.children);
            // console.log("dwadawdaw",childrendata)
            categoryTreemap.push(childrendata);
        });
        // console.log("categoryTreemap",categoryTreemap)
        return categoryTreemap;
    }
    CategroychildrenDataloopback(response) {
        const categoryChildren = [];
        response === null || response === void 0 ? void 0 : response.map(async (childitem) => {
            const endpoint = `https://skillnet.vtexcommercestable.com.br/api/io/_v/api/intelligent-search/product_search/category-2/${childitem.name}`;
            const response = await this.vtexCategoryTreeLoopbackFetchFromEndpoint(endpoint);
            console.log('CategroychildrenDataloopback', response);
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
    vtextransformCategoryTree(response) {
        // console.log("response1234",response)
        const categoryTreemap = [];
        response === null || response === void 0 ? void 0 : response.map(async (item, index) => {
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
                children: this.CategroychildrenData(item.children),
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
                children: this.CategroychildrenData(childitem.children),
            });
        });
        return categoryChildren;
    }
    transformVtexProductDetailPage(response) {
        return {
            productId: response.productId,
            name: response.name,
            available: response.available,
            skus: response.skus,
        };
    }
};
exports.VtexService = VtexService = tslib_1.__decorate([
    (0, core_1.injectable)(),
    tslib_1.__param(0, (0, core_1.inject)('datasources.vtex')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.VtexDataSource])
], VtexService);
//# sourceMappingURL=vtex.service.js.map