import { AxiosResponse } from 'axios';
import { VtexDataSource } from '../datasources';
export declare class VtexService {
    protected dataSource: VtexDataSource;
    constructor(dataSource: VtexDataSource);
    fetchFromEndpoint(endpoint: string): Promise<any>;
    cartFetchFromEndpoint(endpoint: string): Promise<any>;
    fetchSfFromEndpoint(endpoint: string): Promise<any>;
    vtexCategoryTreeLoopbackFetchFromEndpoint(endpoint: string): Promise<any>;
    getVtexCategoryTree(): Promise<any>;
    getVtexCategoryTreeloopback(): Promise<any>;
    functionVtexCategoryTreeLoopbackForData(responseData: any): Promise<any>;
    getVtexCollection(collectionId: string): Promise<any>;
    getVtexProducListingPage(categoryId: String): Promise<any>;
    getVtexProductDetails(productId: string): Promise<any>;
    getProductById(pid: string): Promise<any>;
    getVtexCartDetails(cartId: any): Promise<any>;
    getTransformedVtexProductDetails(productId: string): Promise<any>;
    getBestSellingProducts(): Promise<any>;
    getBestSellingProductsrating(): Promise<any>;
    getTopSellingProductsrating(): Promise<any>;
    getNewSellingProducts(): Promise<any>;
    getVtexProductByCategory(categoryId: any): Promise<any>;
    getVtexProductBySubCategory(subCategoryId: any): Promise<any>;
    getVtexProductByQuery(query: any): Promise<any>;
    getAProductById(pid: string): Promise<any>;
    getOrCreateCartId(): Promise<any>;
    private transformProductDetails;
    private vtextransformCategoryTreeloopback;
    private CategroychildrenDataloopback;
    private vtextransformCategoryTree;
    private CategroychildrenData;
    private transformVtexProductDetailPage;
    startLogin(email: string, password: string): Promise<any>;
    validateLogin(email: string, password: string): Promise<any>;
    startLogins(email: string): Promise<AxiosResponse<any>>;
    vtexlogin(email: string): Promise<AxiosResponse<any>>;
    validateLogins(email: string, password: string, auth: any): Promise<AxiosResponse<any>>;
    createSession(response: any): Promise<AxiosResponse<any, any>>;
    login(email: any, password: any): Promise<{
        validation: any;
        session: any;
    }>;
    createCustomerCart(): Promise<any>;
    addItems(orderFormId: any, requestBody: any): Promise<any>;
    updateCartItem(orderFormId: any, requestBody: any): Promise<any>;
    deleteCartItem(orderFormId: any, requestBody: any): Promise<any>;
    getCartItems(orderFormId: any): Promise<any>;
    sfBestSelling(): Promise<any>;
    salesForceProduct(pid: any): Promise<any>;
    searchByFacets(category: string, color: any, size: any, minprice: any, maxprice: any, sortbyprice: any, sortbyname: any): Promise<any>;
}
