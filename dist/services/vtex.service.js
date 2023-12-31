"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VtexService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const axios_1 = tslib_1.__importDefault(require("axios"));
const datasources_1 = require("../datasources");
const FormData = require("form-data");
require('dotenv').config();
const vtexAppToken = process.env.VTEX_APP_TOKEN;
const vtexAppKey = process.env.VTEX_APP_KEY;
let VtexService = exports.VtexService = class VtexService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async fetchFromEndpoint(endpoint) {
        try {
            const response = await axios_1.default.get(`${this.dataSource.settings.baseURL}/${endpoint}`, {
                headers: {
                    Accept: 'application/json',
                    'X-VTEX-API-AppToken': vtexAppToken,
                    'X-VTEX-API-AppKey': vtexAppKey,
                },
            });
            return response.data;
        }
        catch (error) {
            return this.handleErrorResponse(error);
        }
    }
    //For handling Errors:
    handleErrorResponse(error) {
        var _a, _b;
        return {
            "status": error === null || error === void 0 ? void 0 : error.response.status,
            "statusText": (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.statusText,
            "message": (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data
        };
    }
    //for cartapi
    async cartFetchFromEndpoint(endpoint) {
        try {
            const response = await axios_1.default.get(`https://hometest--skillnet.myvtex.com/${endpoint}`, {
                headers: {
                    Accept: 'application/json',
                    'X-VTEX-API-AppToken': vtexAppToken,
                    'X-VTEX-API-AppKey': vtexAppKey,
                },
            });
            return response.data;
        }
        catch (error) {
            return this.handleErrorResponse(error);
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
            return this.handleErrorResponse(error);
        }
    }
    async vtexCategoryTreeLoopbackFetchFromEndpoint(endpoint) {
        try {
            const response = await axios_1.default.get(`${endpoint}`, { timeout: 100000,
                headers: {
                    Accept: 'application/json',
                    'X-VTEX-API-AppToken': vtexAppToken,
                    'X-VTEX-API-AppKey': vtexAppKey,
                },
            });
            return response.data;
        }
        catch (error) {
            return this.handleErrorResponse(error);
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
        var _a;
        const endpoint = `api/catalog/pvt/product/${pid}`;
        const response = this.fetchFromEndpoint(endpoint);
        const data = await response;
        if (data.status != undefined) {
            return data;
        }
        else {
            const endpoint1 = `api/catalog_system/pub/products/variations/${data.Id}`;
            const product_variation = this.fetchFromEndpoint(endpoint1);
            const product_variation_response = await product_variation;
            //Cross Sell products:
            let crossSellProducts = [];
            const cross_sell_endpoint = `api/catalog_system/pub/products/crossselling/similars/${pid}`;
            const cross_sell_response = this.fetchFromEndpoint(cross_sell_endpoint);
            const cross_sell_data = await cross_sell_response;
            if (cross_sell_data.length == 0) {
                crossSellProducts;
            }
            else {
                cross_sell_data.map((items) => {
                    let cross_sell_product = {
                        "productId": items.productId,
                        "productName": items.productName,
                        "imageUrl": items.items[0].images[0].imageUrl,
                        "productTitle": items.productTitle,
                        "productPrice": items.items[0].sellers[0].commertialOffer.Price
                    };
                    crossSellProducts.push(cross_sell_product);
                });
            }
            if (product_variation_response.status == undefined) {
                //Product prices and discount:
                (_a = product_variation_response === null || product_variation_response === void 0 ? void 0 : product_variation_response.skus) === null || _a === void 0 ? void 0 : _a.map((items, index) => {
                    delete (items.measures);
                    const specification_data = items.dimensions;
                    if (items.hasOwnProperty("dimensions")) {
                        items["specifications"] = specification_data;
                        delete (items.dimensions);
                    }
                    var dollerAmount_list_price = items.listPriceFormated;
                    var dollerAmount_sell_price = items.bestPriceFormated;
                    var numericValueListPrice = dollerAmount_list_price.replace(/[$,]/g, '');
                    var numericValueSellPrice = dollerAmount_sell_price.replace(/[$,]/g, '');
                    var intValue_list_price = parseInt(numericValueListPrice, 10);
                    var intValue_sell_price = parseInt(numericValueSellPrice);
                    var intValue_discount = Math.round(intValue_list_price - intValue_sell_price);
                    var intValue_discount_percentage = Math.round((intValue_discount / intValue_list_price) * 100);
                    items.discountValue = intValue_discount;
                    items.discountPercentage = intValue_discount_percentage;
                });
                product_variation_response['categoryId'] = data.CategoryId;
                product_variation_response['brandId'] = data.BrandId;
                product_variation_response['description'] = data.Description;
                const transformVtexPdp = this.transformVtexProductDetailPage(product_variation_response, crossSellProducts);
                // console.log("transformVtexPdp",transformVtexPdp);
                return transformVtexPdp;
            }
            else {
                return this.transformVtexProductDetailPage(data, crossSellProducts);
            }
        }
    }
    async getVtexCartDetails(cartId) {
        // a7be4a750c55442a865ca49fd22a4232 cart id
        const endpoint = `api/checkout/pub/orderForm/${cartId}`;
        const response = this.cartFetchFromEndpoint(endpoint);
        const cartData = this.getTransformCartDetails(response);
        return cartData;
    }
    async getTransformCartDetails(cartData) {
        const data = await cartData;
        //For Products:
        const products = [];
        await Promise.all(data.items.map((items, index) => {
            const logisticInfo = data.shippingData.logisticsInfo;
            const itemID = logisticInfo.map((element) => {
                if (element.itemId === items.id) {
                    return element.itemIndex;
                }
            }).filter((index) => index !== null);
            const newIndexId = itemID.length > 0 ? itemID[index] : null;
            const products_data = {
                "itemId": items.id,
                "indexId": newIndexId,
                "productName": items.name,
                "price": items.price / 100,
                "sellingPrice": items.sellingPrice / 100,
                "quantity": items.quantity,
                "imageUrl": items.imageUrl
            };
            products.push(products_data);
        }));
        //For Totals:
        let totalizers = { "CartTotal": (data.value) / 100 };
        const final_result = { "products": products, "totalizers": totalizers };
        return final_result;
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
                    'X-VTEX-API-AppToken': vtexAppToken,
                    'X-VTEX-API-AppKey': vtexAppKey,
                }
            });
            const response_with_rating = await data_with_rating;
            const product_price_response = await this.fetchFromEndpoint(endpoint_two);
            emptyarray.push({
                productId: items.ProductId,
                skuId: items.SkuId,
                productName: items.ProductName,
                skuImageUrl: items.SkuImageUrl,
                basePrice: product_price_response.basePrice,
                listPrice: product_price_response.costPrice,
                rating_avg: response_with_rating.data.average,
                rating_count: response_with_rating.data.totalCount
            });
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
                    'X-VTEX-API-AppToken': vtexAppToken,
                    'X-VTEX-API-AppKey': vtexAppKey,
                }
            });
            const response_with_rating = await data_with_rating;
            const product_price_response = await this.fetchFromEndpoint(endpoint_two);
            emptyarray.push({
                productId: items.ProductId,
                skuId: items.SkuId,
                productName: items.ProductName,
                skuImageUrl: items.SkuImageUrl,
                basePrice: product_price_response.basePrice,
                listPrice: product_price_response.costPrice,
                rating_avg: response_with_rating.data.average,
                rating_count: response_with_rating.data.totalCount
            });
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
    async getVtexProductByCategory(categoryId, color, size, minprice, maxprice, sortbyprice, sortbyname, count, page) {
        let facets_colors;
        let facets_size;
        let prices;
        if (color) {
            facets_colors = color.replace(/,/g, "/color/");
        }
        if (size) {
            facets_size = size.replace(/,/g, "/size/");
        }
        if (minprice && maxprice) {
            prices = true;
        }
        const endpoint = `/api/io/_v/api/intelligent-search/product_search/category-1/${categoryId}/${facets_colors != undefined ? `/color/${facets_colors}` : ""}/${facets_size ? `size/${facets_size}` : ""}/${prices ? `price/${minprice}:${maxprice}` : ""}?${sortbyprice ? `sort=price:${sortbyprice}` : ""}&${sortbyname ? `sort=name:${sortbyname}` : ""}&${count !== undefined ? `count=${count}` : 'count='}&${page !== undefined ? `page=${page}` : 'page='}`;
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
                value: items.values[0].key === "price" ? items.values.map((valueitem) => ({ value: valueitem.range })) : items.values,
            });
        });
        const product_arr = [];
        await Promise.all(data === null || data === void 0 ? void 0 : data.products.map((items) => {
            var _a;
            //For product prices and discount prices:
            const price_data = items.items;
            let list_price = 0;
            let sales_price = 0;
            let new_discount_percentage;
            price_data.map((newItems) => {
                newItems === null || newItems === void 0 ? void 0 : newItems.sellers.map((newNewItem, newIndex) => {
                    var _a, _b, _c, _d, _e;
                    if ((_a = newNewItem === null || newNewItem === void 0 ? void 0 : newNewItem.commertialOffer) === null || _a === void 0 ? void 0 : _a.discountHighlights[0]) {
                        list_price = (_b = newNewItem === null || newNewItem === void 0 ? void 0 : newNewItem.commertialOffer) === null || _b === void 0 ? void 0 : _b.ListPrice;
                        sales_price = (_c = newNewItem === null || newNewItem === void 0 ? void 0 : newNewItem.commertialOffer) === null || _c === void 0 ? void 0 : _c.spotPrice;
                        //@ts-ignore
                        const percentageAsNumber = Number(list_price - sales_price) / Number(list_price) * 100;
                        var discount_percentage = percentageAsNumber.toFixed(2);
                        new_discount_percentage = discount_percentage;
                    }
                    else {
                        list_price = (_d = newNewItem === null || newNewItem === void 0 ? void 0 : newNewItem.commertialOffer) === null || _d === void 0 ? void 0 : _d.ListPrice;
                        sales_price = (_e = newNewItem === null || newNewItem === void 0 ? void 0 : newNewItem.commertialOffer) === null || _e === void 0 ? void 0 : _e.spotPrice;
                        //@ts-ignore
                        const percentageAsNumber = Number(list_price - sales_price) / Number(list_price) * 100;
                        var discount_percentage = percentageAsNumber.toFixed(2);
                        new_discount_percentage = discount_percentage;
                    }
                });
            });
            product_arr.push({
                productId: items === null || items === void 0 ? void 0 : items.productId,
                skuId: items === null || items === void 0 ? void 0 : items.productId,
                productName: items === null || items === void 0 ? void 0 : items.productName,
                productImage: (_a = items === null || items === void 0 ? void 0 : items.items[0]) === null || _a === void 0 ? void 0 : _a.images[0].imageUrl,
                productRating: "",
                //@ts-ignore
                productPrice: { "sellingPrice": sales_price, "listPrice": list_price, "discount": Number(list_price - sales_price), "discountPercentage": new_discount_percentage },
            });
        }));
        let nextIndex;
        let prevIndex;
        if (page < data.pagination.count) {
            //@ts-ignore
            nextIndex = Number(page) + 1;
        }
        else {
            nextIndex = 0;
        }
        //@ts-ignore
        if (page > 1) {
            //@ts-ignore
            prevIndex = page - 1;
        }
        else {
            prevIndex = 0;
        }
        const availablePagination = {
            "totalPages": data.pagination.count,
            "currentIndex": page,
            "perPage": data.pagination.perPage,
            "next": nextIndex,
            "previous": prevIndex
        };
        const finalData = {
            productData: product_arr,
            valueFacets: available_facets,
            pagination: availablePagination
        };
        return finalData;
        // return product_arr;
    }
    async getVtexProductBySubCategory(subCategoryId, color, size, minprice, maxprice, sortbyprice, sortbyname, count, page) {
        let facets_colors;
        let facets_size;
        let prices;
        if (color) {
            facets_colors = color.replace(/,/g, "/color/");
        }
        if (size) {
            facets_size = size.replace(/,/g, "/size/");
        }
        if (minprice && maxprice) {
            prices = true;
        }
        const endpoint = `/api/io/_v/api/intelligent-search/product_search/category-2/${subCategoryId}/${facets_colors != undefined ? `/color/${facets_colors}` : ""}/${facets_size ? `size/${facets_size}` : ""}/${prices ? `price/${minprice}:${maxprice}` : ""}?${sortbyprice ? `sort=price:${sortbyprice}` : ""}&${sortbyname ? `sort=name:${sortbyname}` : ""}&${count !== undefined ? `count=${count}` : 'count='}&${page !== undefined ? `page=${page}` : 'page='}`;
        const response = this.fetchFromEndpoint(endpoint);
        const data = await response;
        const product_arr = [];
        //For available facets:
        const available_facets = [];
        const endpoint_two = `api/io/_v/api/intelligent-search/facets/category-2/${subCategoryId}?hideUnavailableItems=false`;
        const facets_Data = this.fetchFromEndpoint(endpoint_two);
        const new_facets_data = await facets_Data;
        const my_new_data = new_facets_data.facets;
        my_new_data.map((items, index) => {
            available_facets.push({
                name: items.values[0].key,
                value: items.values[0].key === "price" ? items.values.map((valueitem) => ({ value: valueitem.range })) : items.values,
            });
        });
        await Promise.all(data === null || data === void 0 ? void 0 : data.products.map((items) => {
            var _a;
            //For product prices and discount prices:
            const price_data = items.items;
            let list_price = 0;
            let sales_price = 0;
            let new_discount_percentage;
            price_data.map((newItems) => {
                newItems === null || newItems === void 0 ? void 0 : newItems.sellers.map((newNewItem, newIndex) => {
                    var _a, _b, _c, _d, _e;
                    if ((_a = newNewItem === null || newNewItem === void 0 ? void 0 : newNewItem.commertialOffer) === null || _a === void 0 ? void 0 : _a.discountHighlights[0]) {
                        list_price = (_b = newNewItem === null || newNewItem === void 0 ? void 0 : newNewItem.commertialOffer) === null || _b === void 0 ? void 0 : _b.ListPrice;
                        sales_price = (_c = newNewItem === null || newNewItem === void 0 ? void 0 : newNewItem.commertialOffer) === null || _c === void 0 ? void 0 : _c.spotPrice;
                        //@ts-ignore
                        const percentageAsNumber = Number(list_price - sales_price) / Number(list_price) * 100;
                        var discount_percentage = percentageAsNumber.toFixed(2);
                        new_discount_percentage = discount_percentage;
                    }
                    else {
                        list_price = (_d = newNewItem === null || newNewItem === void 0 ? void 0 : newNewItem.commertialOffer) === null || _d === void 0 ? void 0 : _d.ListPrice;
                        sales_price = (_e = newNewItem === null || newNewItem === void 0 ? void 0 : newNewItem.commertialOffer) === null || _e === void 0 ? void 0 : _e.spotPrice;
                        //@ts-ignore
                        const percentageAsNumber = Number(list_price - sales_price) / Number(list_price) * 100;
                        var discount_percentage = percentageAsNumber.toFixed(2);
                        new_discount_percentage = discount_percentage;
                    }
                });
            });
            product_arr.push({
                productId: items === null || items === void 0 ? void 0 : items.productId,
                skuId: items === null || items === void 0 ? void 0 : items.productId,
                productName: items === null || items === void 0 ? void 0 : items.productName,
                productImage: (_a = items === null || items === void 0 ? void 0 : items.items[0]) === null || _a === void 0 ? void 0 : _a.images[0].imageUrl,
                productRating: "",
                productPrice: items === null || items === void 0 ? void 0 : items.priceRange,
                //@ts-ignore
                productPrice: { "sellingPrice": sales_price, "listPrice": list_price, "discount": Number(list_price - sales_price), "discountPercentage": new_discount_percentage },
            });
        }));
        //For Pagination:
        let nextIndex;
        let prevIndex;
        if (page < data.pagination.count) {
            //@ts-ignore
            nextIndex = Number(page) + 1;
        }
        else {
            nextIndex = 0;
        }
        //@ts-ignore
        if (page > 1) {
            //@ts-ignore
            prevIndex = page - 1;
        }
        else {
            prevIndex = 0;
        }
        const availablePagination = {
            "totalPages": data.pagination.count,
            "currentIndex": page,
            "perPage": data.pagination.perPage,
            "next": nextIndex,
            "previous": prevIndex
        };
        const finalData = {
            productData: product_arr,
            valuesFacets: available_facets,
            pagination: availablePagination
        };
        return finalData;
    }
    async getVtexProductByQuery(query, color, size, minprice, maxprice, sortbyprice, sortbyname, count, page) {
        let facets_colors;
        let facets_size;
        let prices;
        if (color) {
            facets_colors = color.replace(/,/g, "/color/");
        }
        if (size) {
            facets_size = size.replace(/,/g, "/size/");
        }
        if (minprice && maxprice) {
            prices = true;
        }
        const endpoint = `/api/io/_v/api/intelligent-search/product_search/${facets_colors != undefined ? `/color/${facets_colors}` : ""}/${facets_size ? `size/${facets_size}` : ""}/${prices ? `price/${minprice}:${maxprice}` : ""}?query=${query}&${sortbyprice ? `sort=price:${sortbyprice}` : ""}&${sortbyname ? `sort=name:${sortbyname}` : ""}&${count !== undefined ? `count=${count}` : 'count='}&${page !== undefined ? `page=${page}` : 'page='}`;
        const response = this.fetchFromEndpoint(endpoint);
        const data = await response;
        //For available facets:
        const available_facets = [];
        const endpoint_two = `/api/io/_v/api/intelligent-search/facets?q=${query}`;
        const facets_Data = this.fetchFromEndpoint(endpoint_two);
        const new_facets_data = await facets_Data;
        const my_new_data = new_facets_data.facets;
        my_new_data.map((items, index) => {
            available_facets.push({
                name: items.values[0].key,
                value: items.values[0].key === "price" ? items.values.map((valueitem) => ({ value: valueitem.range })) : items.values,
            });
        });
        const product_arr = [];
        await Promise.all(data === null || data === void 0 ? void 0 : data.products.map((items) => {
            var _a;
            //For product prices and discount prices:
            const price_data = items.items;
            let list_price = 0;
            let sales_price = 0;
            let new_discount_percentage;
            price_data.map((newItems) => {
                newItems === null || newItems === void 0 ? void 0 : newItems.sellers.map((newNewItem, newIndex) => {
                    var _a, _b, _c, _d, _e;
                    if ((_a = newNewItem === null || newNewItem === void 0 ? void 0 : newNewItem.commertialOffer) === null || _a === void 0 ? void 0 : _a.discountHighlights[0]) {
                        list_price = (_b = newNewItem === null || newNewItem === void 0 ? void 0 : newNewItem.commertialOffer) === null || _b === void 0 ? void 0 : _b.ListPrice;
                        sales_price = (_c = newNewItem === null || newNewItem === void 0 ? void 0 : newNewItem.commertialOffer) === null || _c === void 0 ? void 0 : _c.spotPrice;
                        //@ts-ignore
                        const percentageAsNumber = Number(list_price - sales_price) / Number(list_price) * 100;
                        var discount_percentage = percentageAsNumber.toFixed(2);
                        new_discount_percentage = discount_percentage;
                    }
                    else {
                        list_price = (_d = newNewItem === null || newNewItem === void 0 ? void 0 : newNewItem.commertialOffer) === null || _d === void 0 ? void 0 : _d.ListPrice;
                        sales_price = (_e = newNewItem === null || newNewItem === void 0 ? void 0 : newNewItem.commertialOffer) === null || _e === void 0 ? void 0 : _e.spotPrice;
                        //@ts-ignore
                        const percentageAsNumber = Number(list_price - sales_price) / Number(list_price) * 100;
                        var discount_percentage = percentageAsNumber.toFixed(2);
                        new_discount_percentage = discount_percentage;
                    }
                });
            });
            product_arr.push({
                productId: items === null || items === void 0 ? void 0 : items.productId,
                skuId: items === null || items === void 0 ? void 0 : items.productId,
                productName: items === null || items === void 0 ? void 0 : items.productName,
                productImage: (_a = items === null || items === void 0 ? void 0 : items.items[0]) === null || _a === void 0 ? void 0 : _a.images[0].imageUrl,
                productRating: "",
                //@ts-ignore
                productPrice: { "sellingPrice": sales_price, "listPrice": list_price, "discount": Number(list_price - sales_price), "discountPercentage": new_discount_percentage },
            });
        }));
        //Pagination:
        let nextIndex;
        let prevIndex;
        if (page < data.pagination.count) {
            //@ts-ignore
            nextIndex = Number(page) + 1;
        }
        else {
            nextIndex = 0;
        }
        //@ts-ignore
        if (page > 1) {
            //@ts-ignore
            prevIndex = page - 1;
        }
        else {
            prevIndex = 0;
        }
        const availablePagination = {
            "totalPages": data.pagination.count,
            "currentIndex": page,
            "perPage": data.pagination.perPage,
            "next": nextIndex,
            "previous": prevIndex
        };
        const finalData = {
            productData: product_arr,
            valuesFacets: available_facets,
            pagination: availablePagination
        };
        return finalData;
    }
    //For single product (Updated API)
    async getAProductById(pid) {
        const endpoint = `api/catalog/pvt/product/${pid}`;
        const response = this.fetchFromEndpoint(endpoint);
        const data = await response;
        return data;
    }
    async getOrCreateCartId(token) {
        try {
            const endpoint = `${this.dataSource.settings.baseURL}/api/checkout/pub/orderForm?forceNewCart=true`;
            const response = await axios_1.default.post(endpoint, null, {
                headers: {
                    Cookie: `${token}`,
                }
            });
            const data = await response.data;
            const baskets = [];
            baskets.push({ "basket_id": data.orderFormId });
            // return data;
            return baskets;
        }
        catch (error) {
            return this.handleErrorResponse(error);
        }
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
        const categoryTreemap = [];
        response === null || response === void 0 ? void 0 : response.map(async (item, index) => {
            var childrendata = this.CategroychildrenDataloopback(item.children);
            categoryTreemap.push(childrendata);
        });
        return categoryTreemap;
    }
    CategroychildrenDataloopback(response) {
        const categoryChildren = [];
        response === null || response === void 0 ? void 0 : response.map(async (childitem) => {
            const endpoint = `${this.dataSource.settings.baseURL}/api/io/_v/api/intelligent-search/product_search/category-2/${childitem.name}`;
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
                url: item.url.split('.br').pop(),
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
                url: childitem.url.split('.br').pop(),
                children: this.CategroychildrenData(childitem.children),
            });
        });
        return categoryChildren;
    }
    transformVtexProductDetailPage(response, crossSellProducts) {
        return {
            productId: response.productId == undefined ? response.Id : response.productId,
            productName: response.name == undefined ? response.Name : response.name,
            available: response.available == undefined ? response.Isvisible : response.available,
            description: response.description == undefined ? response.Description : response.description,
            skus: response.skus == undefined ? [] : response.skus,
            crossSellProduct: crossSellProducts
        };
    }
    async startLogin(email, password) {
        try {
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
        catch (error) {
            return this.handleErrorResponse(error);
        }
    }
    async validateLogin(email, password) {
        try {
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
        catch (error) {
            return this.handleErrorResponse(error);
        }
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
            return response;
        }
        catch (error) {
            return this.handleErrorResponse(error);
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
        try {
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
            return response;
        }
        catch (error) {
            return this.handleErrorResponse(error);
        }
    }
    async validateLogins(email, password, auth) {
        try {
            const formData = new FormData();
            formData.append("login", email);
            formData.append("password", password);
            formData.append("recaptcha", "");
            formData.append("fingerprint", "");
            const authToken = "_vss=" + auth;
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
            return response;
        }
        catch (error) {
            return this.handleErrorResponse(error);
        }
    }
    async createSession(response) {
        try {
            const sessionresponse = await axios_1.default.post("https://skillnet.myvtex.com/api/sessions", {
                headers: {
                    cookie: `${(response.accountAuthCookie.Name =
                        response.accountAuthCookie.Value)}+";"+${(response.authCookie.Name =
                        response.accountAuthCookie.Value)}`,
                },
            });
            // const data:any = {
            //   resp:response,
            //   session:sessionresponse.data,
            // };
            // console.log("dataamber", data);
            return sessionresponse;
        }
        catch (error) {
            return this.handleErrorResponse(error);
        }
    }
    async login(email, password) {
        const start = await this.vtexlogin(email);
        const auth = await start.data.authenticationToken;
        const validate = await this.validateLogins(email, password, auth);
        if (await validate.data.authStatus != "Success") {
            return {
                "status": "401",
                "statusText": "Validation failed",
                "message": "cannot create session due to invalid credentials",
            };
        }
        else {
            const session = await this.createSession(validate.data);
            validate.data.authCookie.Name = "VtexIdclientAutCookie_skillnet";
            validate.data.accountAuthCookie.Name = "VtexIdclientAutCookie_13ca6e38-75b0-4070-8cf2-5a61412e4919";
            const finalToken = `${validate.data.authCookie.Name}=` + `${validate.data.authCookie.Value};` + `${validate.data.accountAuthCookie.Name}=` + `${validate.data.accountAuthCookie.Value};` + `sessionToken=` + `${session.data.sessionToken};` + `segmentToken=` + `${session.data.segmentToken}`;
            return { customer_id: "", "bearerToken": finalToken };
            // return {
            //   validation: validate.data,
            //   session: session.data,
            // };
        }
        // const validate = await this.validateLogin(email, password);
    }
    //Function to generate Customer Cart:
    async createCustomerCart(customerId, token) {
        try {
            const endpoint = `${this.dataSource.settings.baseURL}/api/checkout/pub/orderForm`;
            const response = await axios_1.default.post(endpoint, null, {
                headers: {
                    Cookie: `${token}`,
                }
            });
            return { "baskets": [{ "basket_id": response.data.orderFormId }] };
        }
        catch (error) {
            return this.handleErrorResponse(error);
        }
    }
    //Function for adding items in cart:
    async addItems(orderFormId, requestBody) {
        const newBody = { "orderItems": [{ "quantity": `${requestBody.quantity}`, "seller": "1", "id": `${requestBody.itemId}` }] };
        const endpoint = `api/checkout/pub/orderForm/${orderFormId}/items`;
        try {
            const response = await axios_1.default.post(`${this.dataSource.settings.baseURL}/${endpoint}`, newBody, {
                headers: {
                    Accept: 'application/json',
                    'X-VTEX-API-AppToken': vtexAppToken,
                    'X-VTEX-API-AppKey': vtexAppKey,
                }
            });
            return response.data;
        }
        catch (error) {
            return this.handleErrorResponse(error);
        }
    }
    // Function for updating items in cart
    async updateCartItem(orderFormId, requestBody) {
        const newBody = { "orderItems": [{ "quantity": `${requestBody.quantity}`, "index": `${requestBody.indexId}` }] };
        const endpoint = `api/checkout/pub/orderForm/${orderFormId}/items/update`;
        try {
            const url = `${this.dataSource.settings.baseURL}/${endpoint}`;
            const response = await axios_1.default.post(`${this.dataSource.settings.baseURL}/${endpoint}`, newBody, {
                headers: {
                    Accept: 'application/json',
                    'X-VTEX-API-AppToken': vtexAppToken,
                    'X-VTEX-API-AppKey': vtexAppKey,
                }
            });
            return response.data;
        }
        catch (error) {
            return this.handleErrorResponse(error);
        }
    }
    // Function for Deleting items in cart
    async deleteCartItem(orderFormId, index_id) {
        const customBody = { "orderItems": [{ "quantity": '0', "index": `${index_id}` }] };
        const endpoint = `api/checkout/pub/orderForm/${orderFormId}/items/update`;
        try {
            const url = `${this.dataSource.settings.baseURL}/${endpoint}`;
            const response = await axios_1.default.post(`${this.dataSource.settings.baseURL}/${endpoint}`, customBody, {
                headers: {
                    Accept: 'application/json',
                    'X-VTEX-API-AppToken': vtexAppToken,
                    'X-VTEX-API-AppKey': vtexAppKey,
                }
            });
            return response.data;
        }
        catch (error) {
            return this.handleErrorResponse(error);
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
        const data = await response;
        const products = [];
        for (const hit of data.hits) {
            const ProductId = hit.product_id;
            const ProductName = hit.product_name;
            const SkuImageUrl = hit.image.link; // Extract image URL
            const listPrice = hit.price; // Extract the price and name it as listPrice
            const basePrice = hit.price;
            products.push({
                ProductId,
                skuId: ProductId,
                ProductName,
                SkuImageUrl,
                listPrice,
                basePrice
            });
        }
        return products;
    }
    async salesForceProduct(pid) {
        const endpoint = `shop/v23_2/products/${pid}?null=null&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b&expand=images%2Cprices%2Cavailability%2Cvariations%2Cpromotions%2Cset_products&all_images=true`;
        const response = await this.fetchSfFromEndpoint(endpoint);
        const data = await response; // Parse JSON response
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
    //Function for getting products using facets on PLP Page:
    async searchByFacets(category, color, size, minprice, maxprice, sortbyprice, sortbyname, count, page) {
        let filteredData = {};
        let nextIndex;
        let prevIndex;
        let facets_colors;
        let facets_size;
        let prices;
        if (color) {
            facets_colors = color.replace(/,/g, "/color/");
        }
        if (size) {
            facets_size = size.replace(/,/g, "/size/");
        }
        if (minprice && maxprice) {
            prices = true;
        }
        const endpoint = `api/io/_v/api/intelligent-search/product_search/category-2/${category}/${prices ? `price/${minprice}:${maxprice}` : ""}${facets_colors != undefined ? `/color/${facets_colors}` : ""}/${facets_size ? `size/${facets_size}` : ""}?${sortbyprice ? `sort=price:${sortbyprice}` : ""}&${sortbyname ? `sort=name:${sortbyname}` : ""}&${count ? `count=${count}` : ""}&${page ? `page=${page}` : ""}`;
        const response = this.fetchFromEndpoint(endpoint);
        const data = await response;
        filteredData["products"] = data.products;
        filteredData["recordsFiltered"] = data.recordsFiltered;
        if (page < data.pagination.count) {
            //@ts-ignore
            nextIndex = Number(page) + 1;
        }
        else {
            nextIndex = 0;
        }
        //@ts-ignore
        if (page > 1) {
            //@ts-ignore
            prevIndex = page - 1;
        }
        else {
            prevIndex = 0;
        }
        filteredData["pagination"] = { "totalPages": data.pagination.count, "currentIndex": Number(page), "perPage": data.pagination.perPage, "next": nextIndex, "previous": prevIndex };
        // const data = await response;
        return filteredData;
    }
    //Function for getting user Details Or Profile :
    async getUserProfileDetails(email) {
        const endpoint = `api/checkout/pub/profiles/?email=${email}`;
        const response = this.fetchFromEndpoint(endpoint);
        const data = await response;
        const formattedData = {
            userProfile: {
                email: `${data.userProfile.email}`,
                firstName: data.userProfile.firstName,
                lastName: data.userProfile.lastName,
                receiverName: data.availableAddresses[0].receiverName,
                addressId: data.availableAddresses[0].addressId,
                postalCode: data.availableAddresses[0].postalCode,
                city: data.availableAddresses[0].city,
                state: data.availableAddresses[0].state,
                country: data.availableAddresses[0].country,
                street: data.availableAddresses[0].street,
                addressNumber: data.availableAddresses[0].number || "N/A",
                phone: `${data.userProfile.phone}`
            }
        };
        return formattedData;
    }
    //Function for getting filter results for parent categories:
    async facetsResults(parentCategory, color, size, minprice, maxprice, sortbyprice, sortbyname, count, page) {
        let filteredData = {};
        let nextIndex;
        let prevIndex;
        let facets_colors;
        let facets_size;
        let prices;
        if (color) {
            facets_colors = color.replace(/,/g, "/color/");
        }
        if (size) {
            facets_size = size.replace(/,/g, "/size/");
        }
        if (minprice && maxprice) {
            prices = true;
        }
        const endpoint = `api/io/_v/api/intelligent-search/product_search/category-1/${parentCategory}/${prices ? `price/${minprice}:${maxprice}` : ""}${facets_colors != undefined ? `/color/${facets_colors}` : ""}/${facets_size ? `size/${facets_size}` : ""}?${sortbyprice ? `sort=price:${sortbyprice}` : ""}${sortbyname ? `sort=name:${sortbyname}` : ""}${count ? `count=${count}` : ""}${page ? `page=${page}` : ""}`;
        const response = this.fetchFromEndpoint(endpoint);
        const data = await response;
        filteredData["products"] = data.products;
        filteredData["recordsFiltered"] = data.recordsFiltered;
        if (page < data.pagination.count) {
            //@ts-ignore
            nextIndex = Number(page) + 1;
        }
        else {
            nextIndex = 0;
        }
        //@ts-ignore
        if (page > 1) {
            //@ts-ignore
            prevIndex = page - 1;
        }
        else {
            prevIndex = 0;
        }
        filteredData["pagination"] = { "totalPages": data.pagination.count, "currentIndex": Number(page), "perPage": data.pagination.perPage, "next": nextIndex, "previous": prevIndex };
        // const data = await response;
        return filteredData;
        // return response;
    }
    //Function for Placing an Order from existing cart:
    async placeOrder(basketId, requestBody) {
        const endpoint = `api/checkout/pub/orderForm/${basketId}/transaction`;
        try {
            const response = await this.placeOrderEndpoint(endpoint, requestBody);
            return response;
        }
        catch (error) {
            return this.handleErrorResponse(error);
        }
    }
    async placeOrderEndpoint(endpoint, requestBody) {
        try {
            const headers = {
                Accept: 'application/json',
                'X-VTEX-API-AppToken': vtexAppToken,
                'X-VTEX-API-AppKey': vtexAppKey,
            };
            const response = await axios_1.default.post(`${this.dataSource.settings.baseURL}/${endpoint}`, requestBody, { headers });
            return response.data;
        }
        catch (error) {
            return this.handleErrorResponse(error);
        }
    }
    //Function For Approving the Payment:
    async approvePayment(transactionId, requestBody) {
        const endpoint = `api/pub/transactions/${transactionId}/payments`;
        try {
            const response = await this.approvePaymentEndpoint(endpoint, requestBody);
            return { message: "Payment Approved" };
        }
        catch (error) {
            return this.handleErrorResponse(error);
        }
    }
    async approvePaymentEndpoint(endpoint, requestBody) {
        try {
            const headers = {
                'X-VTEX-API-AppToken': vtexAppToken,
                'X-VTEX-API-AppKey': vtexAppKey,
            };
            const response = await axios_1.default.post(`https://skillnet.vtexpayments.com.br/${endpoint}`, [requestBody], { headers });
            return response.data;
        }
        catch (error) {
            return this.handleErrorResponse(error);
        }
    }
};
exports.VtexService = VtexService = tslib_1.__decorate([
    (0, core_1.injectable)(),
    tslib_1.__param(0, (0, core_1.inject)('datasources.vtex')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.VtexDataSource])
], VtexService);
//# sourceMappingURL=vtex.service.js.map