import { Request, ResponseObject } from '@loopback/rest';
import { VtexService } from '../services';
import { Response } from 'express';
export declare class VtexController {
    private vtexService;
    private req;
    constructor(vtexService: VtexService, req: Request);
    getVtexCategoryTree(): Promise<any>;
    getVtexProductDetails(productId: string): Promise<any>;
    getProductById(pid: string): Promise<any>;
    getVtexCollection(collectionId: string): Promise<any>;
    getVtexCartData(cartId: any): Promise<any>;
    gettransformedVtexProductDetails(productId: string): Promise<any>;
    getBestSellingProducts(): Promise<any>;
    getBestSellingProductsrating(): Promise<any>;
    getTopSellingProductsrating(): Promise<any>;
    getVtexPlp(categoryId: string): Promise<any>;
    getVtexCategoryTreeloopback(): Promise<any>;
    getVtexProductByCategory(categoryId: any, color?: any, size?: any, minprice?: any, maxprice?: any, sortbyprice?: any, sortbyname?: any, count?: any, page?: any): Promise<any>;
    getVtexProductBySubCategory(subCategoryId: any, color?: any, size?: any, minprice?: any, maxprice?: any, sortbyprice?: any, sortbyname?: any, count?: any, page?: any): Promise<any>;
    getVtexProductByQuery(query: any, color?: any, size?: any, minprice?: any, maxprice?: any, sortbyprice?: any, sortbyname?: any, count?: any, page?: any): Promise<any>;
    getAProductById(pid: string): Promise<any>;
    getOrCreateCartId(token: string): Promise<any>;
    login(requestBody: {
        email: string;
        password: string;
    }, response: Response): Promise<any>;
    testLogin(requestBody: {
        email: string;
        password: string;
    }, response: Response): Promise<ResponseObject>;
    createCustomerCart(): Promise<any>;
    addItems(requestBody: {
        orderItems: [];
    }, orderFormId: string): Promise<any>;
    updateCartItem(requestBody: {
        orderItems: [];
    }, orderFormId: string): Promise<any>;
    deleteCartItem(requestBody: {
        orderItems: [];
    }, orderFormId: string): Promise<any>;
    getCartItems(orderFormId: string): Promise<any>;
    getSfBestSellingProducts(): Promise<any>;
    salesForceProduct(productId: string): Promise<any>;
    searchByFacets(category: string, color?: any, size?: any, minprice?: any, maxprice?: any, sortbyprice?: any, sortbyname?: any, count?: any, page?: any): Promise<any>;
    getUserProfileDetails(email: string): Promise<any>;
    facetsResults(parentCategory: string, color?: any, size?: any, minprice?: any, maxprice?: any, sortbyprice?: any, sortbyname?: any, count?: any, page?: any): Promise<any>;
    placeOrder(basketId: string, requestBody: {
        body: any;
    }): Promise<any>;
    approvePayment(transactionId: string, requestBody: {
        body: [];
    }): Promise<any>;
}
