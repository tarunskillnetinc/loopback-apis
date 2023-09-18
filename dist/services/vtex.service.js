"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VtexService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const axios_1 = tslib_1.__importDefault(require("axios"));
const datasources_1 = require("../datasources");
const FormData = require("form-data");
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
    async fetchSfFromEndpoint(endpoint) {
        try {
            const response = await axios_1.default.get(`https://zzkd-004.dx.commercecloud.salesforce.com/s/RefArch/dw/${endpoint}`, {
                headers: {
                    Accept: '*/*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Cookie': 'BrowserId=cZTU7kWFEe6BcxsRNxYQ0g'
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
            await categoryTreemap.push({
                id: item.id,
                title: item.name,
                data: await this.functionVtexCategoryTreeLoopbackForData(responseData),
            });
        }));
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
        const childrenendpoint = `api/catalog_system/pub/products/search?fq=C:/${categoryId}/`;
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
        const transformVtexPdp = this.transformVtexProductDetailPage(product_variation_response);
        // console.log("transformVtexPdp",transformVtexPdp);
        return transformVtexPdp;
    }
    async getVtexCartDetails(cartId) {
        // a7be4a750c55442a865ca49fd22a4232 cart id
        const endpoint = `api/checkout/pub/orderForm/${cartId}`;
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
            items.basePrice = product_price_response.basePrice;
            items.listPrice = product_price_response.costPrice;
            items.rating_avg = 3.2;
            items.rating_count = 7;
            emptyarray.push({ ...items });
            return items;
        }));
        return emptyarray;
    }
    async getBestSellingProductsrating() {
        const endpoint = `api/catalog/pvt/collection/143/products`;
        const response = this.fetchFromEndpoint(endpoint);
        const data = await response;
        var emptyarray = [];
        await Promise.all(data.Data.map(async (items) => {
            const endpoint_two = `api/pricing/prices/${items.SkuId}`;
            const endpoint_three = `https://skillnet.myvtex.com/reviews-and-ratings/api/rating/${items.ProductId}`;
            const data_with_rating = await axios_1.default.get(endpoint_three, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-VTEX-API-AppKey': 'vtexappkey-skillnet-VOZXMR',
                    'X-VTEX-API-AppToken': 'RVXQMZYNRRZNTMEURBRBHPRCWYMITOEUNUPISMZTCCAGROZIUTHBZFUCZKIVIWSHJPAREKDSZSKDTFKGQZHNBKKXLIANVJLFBTJJBUWJJNDQTJVQKXLOKCMFYHWORAVT'
                }
            });
            const response_with_rating = await data_with_rating;
            const product_price_response = await this.fetchFromEndpoint(endpoint_two);
            items.basePrice = product_price_response.basePrice;
            items.listPrice = product_price_response.costPrice;
            items.rating_avg = response_with_rating.data.average;
            items.rating_count = response_with_rating.data.totalCount;
            emptyarray.push({ ...items });
            return items; // Return the updated item
        }));
        // return this.fetchFromEndpoint(endpoint);
        return emptyarray;
    }
    async getTopSellingProductsrating() {
        const endpoint = `api/catalog/pvt/collection/147/products`;
        const response = this.fetchFromEndpoint(endpoint);
        const data = await response;
        var emptyarray = [];
        await Promise.all(data.Data.map(async (items) => {
            const endpoint_two = `api/pricing/prices/${items.SkuId}`;
            const endpoint_three = `https://skillnet.myvtex.com/reviews-and-ratings/api/rating/${items.ProductId}`;
            const data_with_rating = await axios_1.default.get(endpoint_three, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-VTEX-API-AppKey': 'vtexappkey-skillnet-VOZXMR',
                    'X-VTEX-API-AppToken': 'RVXQMZYNRRZNTMEURBRBHPRCWYMITOEUNUPISMZTCCAGROZIUTHBZFUCZKIVIWSHJPAREKDSZSKDTFKGQZHNBKKXLIANVJLFBTJJBUWJJNDQTJVQKXLOKCMFYHWORAVT'
                }
            });
            const response_with_rating = await data_with_rating;
            const product_price_response = await this.fetchFromEndpoint(endpoint_two);
            items.basePrice = product_price_response.basePrice;
            items.listPrice = product_price_response.costPrice;
            items.rating_avg = response_with_rating.data.average;
            items.rating_count = response_with_rating.data.totalCount;
            emptyarray.push({ ...items });
            return items; // Return the updated item
        }));
        // return this.fetchFromEndpoint(endpoint);
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
        const available_facets = [];
        const endpoint_two = `api/io/_v/api/intelligent-search/facets/category-1/${categoryId}?hideUnavailableItems=false`;
        const facets_Data = this.fetchFromEndpoint(endpoint_two);
        const new_facets_data = await facets_Data;
        const my_new_data = new_facets_data.facets;
        my_new_data.map((items, index) => {
            available_facets.push({
                name: items.values[0].key,
                value: items.values,
            });
        });
        const product_arr = [];
        await Promise.all(data === null || data === void 0 ? void 0 : data.products.map((items) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            product_arr.push({
                product_id: items === null || items === void 0 ? void 0 : items.productId,
                sku_id: "",
                product_name: items === null || items === void 0 ? void 0 : items.productName,
                product_image: (_a = items === null || items === void 0 ? void 0 : items.items[0]) === null || _a === void 0 ? void 0 : _a.images[0].imageUrl,
                product_rating: "",
                alt: "",
                product_description: items === null || items === void 0 ? void 0 : items.description,
                product_features: "",
                product_price: { "sellingPrice": (_c = (_b = items === null || items === void 0 ? void 0 : items.priceRange) === null || _b === void 0 ? void 0 : _b.sellingPrice) === null || _c === void 0 ? void 0 : _c.highPrice, "listPrice": (_e = (_d = items === null || items === void 0 ? void 0 : items.priceRange) === null || _d === void 0 ? void 0 : _d.listPrice) === null || _e === void 0 ? void 0 : _e.highPrice, "discount": ((_g = (_f = items === null || items === void 0 ? void 0 : items.priceRange) === null || _f === void 0 ? void 0 : _f.sellingPrice) === null || _g === void 0 ? void 0 : _g.highPrice) - ((_j = (_h = items === null || items === void 0 ? void 0 : items.priceRange) === null || _h === void 0 ? void 0 : _h.listPrice) === null || _j === void 0 ? void 0 : _j.highPrice) },
                product_category: items === null || items === void 0 ? void 0 : items.categoryId,
                product_category_id: items === null || items === void 0 ? void 0 : items.categoriesIds,
                properties: items === null || items === void 0 ? void 0 : items.properties
            });
        }));
        const finalData = {
            productData: product_arr,
            valuesFacets: available_facets
        };
        return finalData;
        // return product_arr;
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
        const endpoint = `/api/io/_v/api/intelligent-search/product_search/?query=${query}`;
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
    //For single product (Updated API)
    async getAProductById(pid) {
        const endpoint = `api/catalog/pvt/product/${pid}`;
        const response = this.fetchFromEndpoint(endpoint);
        const data = await response;
        return data;
    }
    async getOrCreateCartId() {
        const endpoint = `api/checkout/pub/orderForm`;
        const response = this.fetchFromEndpoint(endpoint);
        const data = await response;
        return data;
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
    async startLogin(email, password) {
        const formData = new FormData();
        formData.append('accountName', 'skillnet');
        formData.append('scope', 'skillnet');
        formData.append('returnUrl', 'https://skillnet.myvtex.com/');
        formData.append('callbackUrl', 'https://skillnet.myvtex.com/api/vtexid/oauth/finish?popup=false');
        formData.append('user', email);
        formData.append('fingerprint', '');
        const response = await (0, axios_1.default)({
            method: 'post',
            url: 'https://skillnet.myvtex.com/api/vtexid/pub/authentication/startlogin',
            data: formData
        });
        return response.data;
    }
    async validateLogin(email, password) {
        const formData = new FormData();
        formData.append('login', email);
        formData.append('password', password);
        formData.append('recaptcha', '');
        formData.append('fingerprint', '');
        const response = await (0, axios_1.default)({
            method: 'post',
            url: 'https://skillnet.myvtex.com/api/vtexid/pub/authentication/classic/validate',
            headers: {
                ...formData.getHeaders(),
            },
            data: formData
        });
        return response.data;
    }
    async startLogins(email) {
        const formData = new FormData();
        formData.append('accountName', 'skillnet');
        formData.append('scope', 'skillnet');
        formData.append('returnUrl', 'https://skillnet.myvtex.com/');
        formData.append('callbackUrl', 'https://skillnet.myvtex.com/api/vtexid/oauth/finish?popup=false');
        formData.append('user', email);
        try {
            const response = await axios_1.default.post('https://skillnet.myvtex.com/api/vtexid/pub/authentication/startlogin', formData);
            console.log('response', response);
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    // async getSession(cookie : any): Promise<AxiosResponse<any>> {
    //   const response = await axios.get(
    //     'https://skillnet.myvtex.com/api/sessions?items=*',
    //     {
    //       headers: {
    //         Cookie: cookie,
    //       },
    //     }
    //   );
    //   console.log('response', response.data);
    //   return response;   
    // }
    async vtexlogin(email) {
        const formDataObject = new FormData();
        formDataObject.append('scope', "skillnet");
        formDataObject.append('accountName', "skillnet");
        formDataObject.append('user', email);
        formDataObject.append('appStart', "true");
        formDataObject.append('callbackUrl', "https://skillnet.myvtex.com/api/vtexid/oauth/finish");
        const response = await axios_1.default.post('https://skillnet.myvtex.com/api/vtexid/pub/authentication/start', formDataObject, {
            headers: {
                'accept': '*/*',
            },
        });
        const token = response.data.authenticationToken;
        console.log("token", token);
        // const response =  await this.fetchFromEndpointpost(endpoint,formDataObject);
        // const data = await response;
        // const validateresponse= await this.loginvalidate(response.authenticationToken,body.user,body.password)
        // console.log("validateresponse",validateresponse)
        return response;
    }
    async validateLogins(email, password, auth) {
        try {
            console.log("auth", auth);
            const formData = new FormData();
            formData.append("login", email);
            formData.append("password", password);
            formData.append("recaptcha", "");
            formData.append("fingerprint", "");
            const authToken = "_vss=" + auth;
            console.log("authToken", authToken);
            const response = await axios_1.default.post("https://skillnet.myvtex.com/api/vtexid/pub/authentication/classic/validate", formData, {
                headers: {
                    accept: "*/*",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "sec-gpc": "1",
                    Cookie: authToken,
                },
            });
            console.log("response", formData);
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    async createSession(response) {
        const sessionresponse = await axios_1.default.post("https://skillnet.myvtex.com/api/sessions", {
            headers: {
                cookie: `${(response.accountAuthCookie.Name =
                    response.accountAuthCookie.Value)}+";"+${(response.authCookie.Name =
                    response.accountAuthCookie.Value)}`,
            },
        });
        console.log("sessionreponse123", sessionresponse);
        // const data:any = {
        //   resp:response,
        //   session:sessionresponse.data,
        // };
        // console.log("dataamber", data);
        return sessionresponse;
    }
    async login(email, password) {
        const start = await this.vtexlogin(email);
        console.log("start", start);
        const auth = await start.data.authenticationToken;
        console.log("auth", auth);
        const validate = await this.validateLogins(email, password, auth);
        console.log("validate", validate);
        if (await validate.data.authStatus != "Success") {
            return {
                validation: 'Validation failed',
                session: "cannot create session due to invalid credentials",
            };
        }
        else {
            const session = await this.createSession(validate.data);
            console.log("session123", session);
            validate.data.authCookie.Name = "VtexIdclientAutCookie_skillnet";
            validate.data.accountAuthCookie.Name = "VtexIdclientAutCookie_13ca6e38-75b0-4070-8cf2-5a61412e4919";
            return {
                validation: validate.data,
                session: session.data,
            };
        }
        // const validate = await this.validateLogin(email, password);
    }
    //Function to generate Customer Cart:
    async createCustomerCart() {
        const endpoint = `api/checkout/pub/orderForm?forceNewCart=true`;
        const cart_response = this.fetchFromEndpoint(endpoint);
        const order_form_id = await cart_response;
        console.log("Cart", order_form_id.orderFormId);
        return order_form_id;
    }
    //Function for adding items in cart:
    async addItems(orderFormId, requestBody) {
        // const body = {"orderItems":[{"quantity":3,"seller":"1","id":"880582"}]}
        console.log('requestBody', requestBody);
        const endpoint = `api/checkout/pub/orderForm/${orderFormId}/items`;
        try {
            const url = `${this.dataSource.settings.baseURL}/${endpoint}`;
            console.log('urlis', url);
            const response = await axios_1.default.post(`${this.dataSource.settings.baseURL}/${endpoint}`, requestBody, {
                headers: {
                    Accept: 'application/json',
                    'X-VTEX-API-AppToken': 'RVXQMZYNRRZNTMEURBRBHPRCWYMITOEUNUPISMZTCCAGROZIUTHBZFUCZKIVIWSHJPAREKDSZSKDTFKGQZHNBKKXLIANVJLFBTJJBUWJJNDQTJVQKXLOKCMFYHWORAVT',
                    'X-VTEX-API-AppKey': 'vtexappkey-skillnet-VOZXMR',
                }
            });
            console.log('itemsaddedare', response);
            return response.data;
        }
        catch (error) {
            throw error;
        }
    }
    // Function for updating items in cart
    async updateCartItem(orderFormId, requestBody) {
        // const body = {"orderItems":[{"quantity":5,"index":0}]}
        console.log("request12345", requestBody);
        const endpoint = `api/checkout/pub/orderForm/${orderFormId}/items/update`;
        try {
            const url = `${this.dataSource.settings.baseURL}/${endpoint}`;
            console.log('urlis', url);
            const response = await axios_1.default.post(`${this.dataSource.settings.baseURL}/${endpoint}`, requestBody, {
                headers: {
                    Accept: 'application/json',
                    'X-VTEX-API-AppToken': 'RVXQMZYNRRZNTMEURBRBHPRCWYMITOEUNUPISMZTCCAGROZIUTHBZFUCZKIVIWSHJPAREKDSZSKDTFKGQZHNBKKXLIANVJLFBTJJBUWJJNDQTJVQKXLOKCMFYHWORAVT',
                    'X-VTEX-API-AppKey': 'vtexappkey-skillnet-VOZXMR',
                }
            });
            console.log('updateCartItems', response);
            return response.data;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    // Function for Deleting items in cart
    async deleteCartItem(orderFormId, requestBody) {
        const endpoint = `api/checkout/pub/orderForm/${orderFormId}/items/update`;
        try {
            const url = `${this.dataSource.settings.baseURL}/${endpoint}`;
            console.log('urlis', url);
            const response = await axios_1.default.post(`${this.dataSource.settings.baseURL}/${endpoint}`, requestBody, {
                headers: {
                    Accept: 'application/json',
                    'X-VTEX-API-AppToken': 'RVXQMZYNRRZNTMEURBRBHPRCWYMITOEUNUPISMZTCCAGROZIUTHBZFUCZKIVIWSHJPAREKDSZSKDTFKGQZHNBKKXLIANVJLFBTJJBUWJJNDQTJVQKXLOKCMFYHWORAVT',
                    'X-VTEX-API-AppKey': 'vtexappkey-skillnet-VOZXMR',
                }
            });
            console.log('updateCartItems', response);
            return response.data;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    //Function for getting Cart Details Or Cart Items:
    async getCartItems(orderFormId) {
        const endpoint = `api/checkout/pub/orderForm/${orderFormId}`;
        const response = this.fetchFromEndpoint(endpoint);
        const data = await response;
        return data;
    }
    async sfBestSelling() {
        const endpoint = `shop/v23_2/product_search?refine=cgid%3Dmens&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b&expand=images%2Cprices%2Cavailability%2Cvariations`;
        const response = await this.fetchSfFromEndpoint(endpoint);
        // console.log('response', response.hits)
        const data = await response;
        console.log('res', data);
        const products = [];
        for (const hit of data.hits) {
            const ProductId = hit.product_id;
            const ProductName = hit.product_name;
            const SkuImageUrl = hit.image.link; // Extract image URL
            const listPrice = hit.price; // Extract the price and name it as listPrice
            const basePrice = hit.price;
            console.log('Product ID:', ProductId);
            console.log('Product Name:', ProductName);
            console.log('Product Image:', SkuImageUrl);
            console.log('List Price:', listPrice);
            products.push({
                ProductId,
                skuId: ProductId,
                ProductName,
                SkuImageUrl,
                listPrice,
                basePrice
            });
        }
        console.log('Products:', products);
        return products;
    }
    async salesForceProduct(pid) {
        const endpoint = `shop/v23_2/products/${pid}?null=null&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b&expand=images%2Cprices%2Cavailability%2Cvariations%2Cpromotions%2Cset_products&all_images=true`;
        const response = await this.fetchSfFromEndpoint(endpoint);
        const data = await response; // Parse JSON response
        console.log('res', data);
        const productId = data.id;
        const name = data.name;
        const available = data.inventory.orderable;
        const skus = data.variants.map((variant) => {
            const sku = variant.product_id;
            const skuname = variant.product_name;
            const skuAvailable = variant.orderable;
            const availableQuantity = data.inventory.stock_level;
            const listPriceFormated = variant.price_per_unit;
            const listPrice = variant.price;
            console.log('listPrice', variant.inventory);
            console.log('listPriceVal', data);
            console.log('listPriceValdsd', data.image_groups[0].images[0].link);
            const image = data.image_groups[0].images[0].link;
            const sellerId = variant.sellerId;
            const seller = variant.seller;
            const measures = variant.measures;
            const unitMultiplier = variant.unitMultiplier;
            const rewardValue = variant.rewardValue;
            return {
                sku,
                skuname: sku,
                available: skuAvailable,
                availablequantity: availableQuantity,
                listPriceFormated,
                listPrice,
                bestPrice: listPrice,
                image,
                sellerId,
                seller,
                measures,
                unitMultiplier,
                rewardValue
            };
        });
        return {
            productId,
            SkuId: productId,
            name,
            available,
            skus
        };
    }
};
exports.VtexService = VtexService = tslib_1.__decorate([
    (0, core_1.injectable)(),
    tslib_1.__param(0, (0, core_1.inject)('datasources.vtex')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.VtexDataSource])
], VtexService);
//# sourceMappingURL=vtex.service.js.map