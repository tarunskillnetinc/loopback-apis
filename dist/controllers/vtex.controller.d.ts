import { VtexService } from '../services';
export declare class VtexController {
    private vtexService;
    constructor(vtexService: VtexService);
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
    getVtexProductByCategory(categoryId: any): Promise<any>;
    getVtexProductBySubCategory(subCategoryId: any): Promise<any>;
    getVtexProductByQuery(query: any): Promise<any>;
    getAProductById(pid: string): Promise<any>;
    getOrCreateCartId(): Promise<any>;
}
