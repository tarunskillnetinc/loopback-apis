"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VtexController = void 0;
const tslib_1 = require("tslib");
const rest_1 = require("@loopback/rest");
const core_1 = require("@loopback/core");
const services_1 = require("../services");
const axios_1 = tslib_1.__importDefault(require("axios"));
const FormData = require("form-data");
// import axios from 'axios';
let VtexController = exports.VtexController = class VtexController {
    constructor(vtexService, req) {
        this.vtexService = vtexService;
        this.req = req;
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
    async getVtexCartData(baskets_id) {
        try {
            const vtexCartDetail = await this.vtexService.getVtexCartDetails(baskets_id);
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
    async getBestSellingProductsrating() {
        try {
            const bestSellingProducts = await this.vtexService.getBestSellingProductsrating();
            return bestSellingProducts;
        }
        catch (error) {
            throw error;
        }
    }
    async getTopSellingProductsrating() {
        try {
            const bestSellingProducts = await this.vtexService.getTopSellingProductsrating();
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
    // @get('/get-session')
    // @response(200, {
    //   description: 'Get VTEX category tree from the external API',
    // })
    // async getSession(): Promise<any> {
    //   try {
    //     const headers = this.req.headers;
    //     console.log('headers', headers.cookie);
    //     const session = await this.vtexService.getSession(headers.cookie);
    //     console.log('session', session.data);
    //     return session.data;
    //   } catch (error) {
    //     throw error;
    //   }
    // }
    async getVtexProductByCategory(categoryId, color, size, minprice, maxprice, sortbyprice, sortbyname, count, page) {
        try {
            const getVtexProducts = await this.vtexService.getVtexProductByCategory(categoryId, color, size, minprice, maxprice, sortbyprice, sortbyname, count, page);
            return getVtexProducts;
        }
        catch (error) {
            throw error;
        }
    }
    async getVtexProductBySubCategory(subCategoryId, color, size, minprice, maxprice, sortbyprice, sortbyname, count, page) {
        try {
            const getVtexProducts = await this.vtexService.getVtexProductBySubCategory(subCategoryId, color, size, minprice, maxprice, sortbyprice, sortbyname, count, page);
            return getVtexProducts;
        }
        catch (error) {
            throw error;
        }
    }
    async getVtexProductByQuery(query, color, size, minprice, maxprice, sortbyprice, sortbyname, count, page) {
        try {
            const getVtexProducts = await this.vtexService.getVtexProductByQuery(query, color, size, minprice, maxprice, sortbyprice, sortbyname, count, page);
            return getVtexProducts;
        }
        catch (error) {
            throw error;
        }
    }
    async getAProductById(pid) {
        try {
            const data = await this.vtexService.getAProductById(pid);
            const response = await data;
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    async getOrCreateCartId(token) {
        try {
            const data = await this.vtexService.getOrCreateCartId(token);
            const response = await data;
            return response;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async login(requestBody, response) {
        try {
            const { email, password } = requestBody;
            const login = await this.vtexService.login(email, password);
            // const data = login.resp.authCookie.Value;
            // const authCookie = login.validation;
            // const session = login.session;
            // console.log('login', login.validation);
            // console.log('login1', login.session);
            // console.log('amber12',authCookie)
            // console.log('login2', data);
            // console.log('login3', await login.data.resp.authCookie);
            // console.log('login4', await login.data.resp.accountAuthCookie);
            // console.log('login3', await login.data.session.sessionToken);
            // if (authCookie?.authCookie==undefined) {
            //   return login
            // }
            // else{
            //   response.cookie('VtexIdclientAutCookie_skillnet', authCookie.authCookie.Value, {
            //     maxAge: 3600000*24,
            //     httpOnly: true,
            //     secure: true,
            //     sameSite: 'none',
            //     path: '/',
            //   });
            //   response.cookie('VtexIdclientAutCookie_13ca6e38-75b0-4070-8cf2-5a61412e4919', authCookie.accountAuthCookie.Value, {
            //     maxAge: 3600000*24,
            //     httpOnly: true,
            //     secure: true,
            //     sameSite: 'none',
            //     path: '/',
            //   });
            //   response.cookie('sessionToken', session.sessionToken, {
            //     // maxAge: 3600000*24,
            //     httpOnly: true,
            //     secure: true,
            //     sameSite: 'none',
            //     path: '/',
            //   });
            //   response.cookie('segmentToken', session.segmentToken, {
            //     // maxAge: 3600000*24,
            //     httpOnly: true,
            //     secure: true,
            //     sameSite: 'none',
            //     path: '/',
            //   });
            //   console.log("amber",login)
            //   return login
            // }
            return login;
        }
        catch (error) {
            console.log("erroramber", error);
            throw error;
        }
    }
    async testLogin(requestBody, response) {
        const { email, password } = requestBody;
        const formDataObject = new FormData();
        formDataObject.append('scope', "skillnet");
        formDataObject.append('accountName', "skillnet");
        formDataObject.append('user', email);
        formDataObject.append('appStart', "true");
        formDataObject.append('callbackUrl', "https://skillnet.myvtex.com/api/vtexid/oauth/finish");
        const response1 = await axios_1.default.post('https://skillnet.myvtex.com/api/vtexid/pub/authentication/start', formDataObject, {
            headers: {
                'accept': '*/*',
            },
        });
        // console.log('response1', response1);
        // console.log('response1', response1.data.authenticationToken);
        response.cookie('_vss', 'response1.data.authenticationToken', {
            maxAge: 3600000,
            httpOnly: true,
            secure: true,
            domain: 'skillnet.myvtex.com',
            sameSite: 'none',
            path: '/',
        });
        const responseObject = {
            statusCode: 200,
            description: 'Login successful',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            message: { type: 'string' },
                        },
                    },
                    success: { message: 'Login successful' },
                },
            },
        };
        return responseObject;
    }
    //For Creating customer cart:
    async createCustomerCart(token, customerId) {
        try {
            const data = await this.vtexService.createCustomerCart(customerId, token);
            const response = await data;
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    //For adding items in cart:
    async addItems(requestBody, basket_Id) {
        try {
            console.log(requestBody);
            const data = await this.vtexService.addItems(basket_Id, requestBody);
            const response = await data;
            return response;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    // For updating Cart details and cart items
    async updateCartItem(requestBody, basket_id) {
        try {
            const data = await this.vtexService.updateCartItem(basket_id, requestBody);
            const response = await data;
            return response;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    // For deleting cart item
    async deleteCartItem(basket_Id, item_id) {
        try {
            const data = await this.vtexService.deleteCartItem(basket_Id, item_id);
            const response = await data;
            return response;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    //For getting Cart Details or Cart Items:
    async getCartItems(orderFormId) {
        try {
            const data = await this.vtexService.getCartItems(orderFormId);
            const response = await data;
            return response;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async getSfBestSellingProducts() {
        try {
            const bestSellingProducts = await this.vtexService.sfBestSelling();
            return bestSellingProducts;
        }
        catch (error) {
            throw error;
        }
    }
    async salesForceProduct(productId) {
        try {
            const vtexProductDetails = await this.vtexService.salesForceProduct(productId);
            console.log('vtexProductDetails', vtexProductDetails);
            return vtexProductDetails;
        }
        catch (error) {
            throw error;
        }
    }
    //Search for products with filter:
    async searchByFacets(category, color, size, minprice, maxprice, sortbyprice, sortbyname, count, page) {
        try {
            const data = await this.vtexService.searchByFacets(category, color, size, minprice, maxprice, sortbyprice, sortbyname, count, page);
            const response = await data;
            return response;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    // Get the user-details or profile
    async getUserProfileDetails(email) {
        try {
            const userProfile = await this.vtexService.getUserProfileDetails(email);
            console.log(userProfile, "userProfile");
            return userProfile;
        }
        catch (error) {
            throw error;
        }
    }
    //Search for product with filter for parent categories:
    async facetsResults(parentCategory, color, size, minprice, maxprice, sortbyprice, sortbyname, count, page) {
        try {
            console.log("myparentcat", parentCategory);
            const data = await this.vtexService.facetsResults(parentCategory, color, size, minprice, maxprice, sortbyprice, sortbyname, count, page);
            const response = await data;
            return response;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    //For Placing Order From An Existing Cart:
    async placeOrder(basketId, requestBody) {
        try {
            const data = await this.vtexService.placeOrder(basketId, requestBody);
            console.log("danishresponseis", data);
            return data;
        }
        catch (error) {
            return error;
        }
    }
    //For Approving The Payment:
    async approvePayment(transactionId, requestBody) {
        try {
            const data = await this.vtexService.approvePayment(transactionId, requestBody);
            return data;
        }
        catch (error) {
            return error;
        }
    }
};
tslib_1.__decorate([
    (0, rest_1.get)('/vtex/category-tree'),
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
    (0, rest_1.get)('vtex/product-by-id/{pid}'),
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
    (0, rest_1.get)('/vtex/cartDetail/{baskets_id}'),
    (0, rest_1.response)(200, {
        description: 'Get VTEX cart details from the external API',
    }),
    tslib_1.__param(0, rest_1.param.path.string('baskets_id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
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
    (0, rest_1.get)('/vtex-best-selling-products-demo'),
    (0, rest_1.response)(200, {
        description: 'Get VTEX best selling products from the external API',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "getBestSellingProducts", null);
tslib_1.__decorate([
    (0, rest_1.get)('/vtex/best-selling-products'),
    (0, rest_1.response)(200, {
        description: 'Get VTEX best selling products from the external API',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "getBestSellingProductsrating", null);
tslib_1.__decorate([
    (0, rest_1.get)('/vtex/new-arrivals'),
    (0, rest_1.response)(200, {
        description: 'Get VTEX best selling products from the external API',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "getTopSellingProductsrating", null);
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
tslib_1.__decorate([
    (0, rest_1.get)('/vtex/products-by-category/{categoryId}'),
    (0, rest_1.response)(200, {
        description: 'Get VTEX Product List by intelegent search',
    }),
    tslib_1.__param(0, rest_1.param.path.string('categoryId')),
    tslib_1.__param(1, rest_1.param.query.string('color')),
    tslib_1.__param(2, rest_1.param.query.string('size')),
    tslib_1.__param(3, rest_1.param.query.string('minprice')),
    tslib_1.__param(4, rest_1.param.query.string('maxprice')),
    tslib_1.__param(5, rest_1.param.query.string('sortbyprice')),
    tslib_1.__param(6, rest_1.param.query.string('sortbyname')),
    tslib_1.__param(7, rest_1.param.query.string('productsPerPage')),
    tslib_1.__param(8, rest_1.param.query.string('page')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "getVtexProductByCategory", null);
tslib_1.__decorate([
    (0, rest_1.get)('/vtex/products-by-sub-category/{subCategoryId}'),
    (0, rest_1.response)(200, {
        description: 'Get VTEX Product List by intelegent search',
    }),
    tslib_1.__param(0, rest_1.param.path.string('subCategoryId')),
    tslib_1.__param(1, rest_1.param.query.string('color')),
    tslib_1.__param(2, rest_1.param.query.string('size')),
    tslib_1.__param(3, rest_1.param.query.string('minprice')),
    tslib_1.__param(4, rest_1.param.query.string('maxprice')),
    tslib_1.__param(5, rest_1.param.query.string('sortbyprice')),
    tslib_1.__param(6, rest_1.param.query.string('sortbyname')),
    tslib_1.__param(7, rest_1.param.query.string('productsPerPage')),
    tslib_1.__param(8, rest_1.param.query.string('page')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "getVtexProductBySubCategory", null);
tslib_1.__decorate([
    (0, rest_1.get)('/vtex/-products-by-query/{query}'),
    (0, rest_1.response)(200, {
        description: 'Get VTEX Product List by intelegent search',
    }),
    tslib_1.__param(0, rest_1.param.path.string('query')),
    tslib_1.__param(1, rest_1.param.query.string('color')),
    tslib_1.__param(2, rest_1.param.query.string('size')),
    tslib_1.__param(3, rest_1.param.query.string('minprice')),
    tslib_1.__param(4, rest_1.param.query.string('maxprice')),
    tslib_1.__param(5, rest_1.param.query.string('sortbyprice')),
    tslib_1.__param(6, rest_1.param.query.string('sortbyname')),
    tslib_1.__param(7, rest_1.param.query.string('productsPerPage')),
    tslib_1.__param(8, rest_1.param.query.string('page')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "getVtexProductByQuery", null);
tslib_1.__decorate([
    (0, rest_1.get)('get-a-product-by-id/{pid}'),
    (0, rest_1.response)(200, {
        description: "Get Vtex Products by their respective Id's",
    }),
    tslib_1.__param(0, rest_1.param.path.string('pid')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "getAProductById", null);
tslib_1.__decorate([
    (0, rest_1.post)('/vtex/createCart'),
    (0, rest_1.response)(200, {
        description: "Get the current cart or create a new one if it doesn't exist yet.",
    }),
    tslib_1.__param(0, rest_1.param.header.string('token')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "getOrCreateCartId", null);
tslib_1.__decorate([
    (0, rest_1.post)('/vtex/login'),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__param(1, (0, core_1.inject)(rest_1.RestBindings.Http.RESPONSE)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "login", null);
tslib_1.__decorate([
    (0, rest_1.post)('/test-login'),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__param(1, (0, core_1.inject)(rest_1.RestBindings.Http.RESPONSE)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "testLogin", null);
tslib_1.__decorate([
    (0, rest_1.get)('/vtex/getCustomerCart/{customerId}'),
    (0, rest_1.response)(200, {
        description: "Create Customer Cart",
    }),
    tslib_1.__param(0, rest_1.param.header.string('token')),
    tslib_1.__param(1, rest_1.param.query.string('customerId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "createCustomerCart", null);
tslib_1.__decorate([
    (0, rest_1.post)('vtex/addItem/{basket_Id}'),
    (0, rest_1.response)(200, {
        description: "Add items in cart using order form id",
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__param(1, rest_1.param.path.string('basket_Id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "addItems", null);
tslib_1.__decorate([
    (0, rest_1.patch)('vtex/updateItem/{basket_id}'),
    (0, rest_1.response)(200, {
        description: "Updating Cart details based on Form Id",
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__param(1, rest_1.param.path.string('basket_id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "updateCartItem", null);
tslib_1.__decorate([
    (0, rest_1.del)('vtex/removeItem/{basket_Id}/items/{item_id}'),
    (0, rest_1.response)(200, {
        description: "Updating Cart details based on Form Id",
    }),
    tslib_1.__param(0, rest_1.param.path.string('basket_Id')),
    tslib_1.__param(1, rest_1.param.path.string('item_id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "deleteCartItem", null);
tslib_1.__decorate([
    (0, rest_1.get)('vtex-get-cart-items/{orderFormId}'),
    (0, rest_1.response)(200, {
        description: "Getting Cart details based on Order Form Id",
    }),
    tslib_1.__param(0, rest_1.param.path.string('orderFormId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "getCartItems", null);
tslib_1.__decorate([
    (0, rest_1.get)('/sf-best-selling'),
    (0, rest_1.response)(200, {
        description: 'Get VTEX best selling products from the external API',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "getSfBestSellingProducts", null);
tslib_1.__decorate([
    (0, rest_1.get)('/sf-pdp/{productId}'),
    (0, rest_1.response)(200, {
        description: 'Get VTEX product details from the external API',
    }),
    tslib_1.__param(0, rest_1.param.path.string('productId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "salesForceProduct", null);
tslib_1.__decorate([
    (0, rest_1.get)('vtex-search-by-facets/{category}'),
    (0, rest_1.response)(200, {
        description: "Search for products using facets",
    }),
    tslib_1.__param(0, rest_1.param.path.string('category')),
    tslib_1.__param(1, rest_1.param.query.string('color')),
    tslib_1.__param(2, rest_1.param.query.string('size')),
    tslib_1.__param(3, rest_1.param.query.string('minprice')),
    tslib_1.__param(4, rest_1.param.query.string('maxprice')),
    tslib_1.__param(5, rest_1.param.query.string('sortbyprice')),
    tslib_1.__param(6, rest_1.param.query.string('sortbyname')),
    tslib_1.__param(7, rest_1.param.query.string('productsperpage')),
    tslib_1.__param(8, rest_1.param.query.string('page')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object, Object, Object, Object, Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "searchByFacets", null);
tslib_1.__decorate([
    (0, rest_1.get)('/user-details/{email}'),
    (0, rest_1.response)(200, {
        description: 'Get VTEX user details from the external API',
    }),
    tslib_1.__param(0, rest_1.param.path.string('email')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "getUserProfileDetails", null);
tslib_1.__decorate([
    (0, rest_1.get)('vtex-facets-results/{parentCategory}'),
    (0, rest_1.response)(200, {
        description: "Search for parent category products using facets",
    }),
    tslib_1.__param(0, rest_1.param.path.string('parentCategory')),
    tslib_1.__param(1, rest_1.param.query.string('color')),
    tslib_1.__param(2, rest_1.param.query.string('size')),
    tslib_1.__param(3, rest_1.param.query.string('minprice')),
    tslib_1.__param(4, rest_1.param.query.string('maxprice')),
    tslib_1.__param(5, rest_1.param.query.string('sortbyprice')),
    tslib_1.__param(6, rest_1.param.query.string('sortbyname')),
    tslib_1.__param(7, rest_1.param.query.string('productsperpage')),
    tslib_1.__param(8, rest_1.param.query.string('page')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object, Object, Object, Object, Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "facetsResults", null);
tslib_1.__decorate([
    (0, rest_1.post)('vtex-placeOrder/{basketId}'),
    (0, rest_1.response)(200, {
        description: "Place Order API",
    }),
    tslib_1.__param(0, rest_1.param.path.string('basketId')),
    tslib_1.__param(1, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "placeOrder", null);
tslib_1.__decorate([
    (0, rest_1.post)('vtex-payment-approve/{transactionId}'),
    (0, rest_1.response)(200, {
        description: 'Approve payment after placeorder api'
    }),
    tslib_1.__param(0, rest_1.param.path.string('transactionId')),
    tslib_1.__param(1, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VtexController.prototype, "approvePayment", null);
exports.VtexController = VtexController = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('services.VtexService')),
    tslib_1.__param(1, (0, core_1.inject)(rest_1.RestBindings.Http.REQUEST)),
    tslib_1.__metadata("design:paramtypes", [services_1.VtexService, Object])
], VtexController);
//# sourceMappingURL=vtex.controller.js.map