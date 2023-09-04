import { VtexDataSource } from '../datasources';
export declare class VtexService {
    protected dataSource: VtexDataSource;
    constructor(dataSource: VtexDataSource);
    fetchFromEndpoint(endpoint: string): Promise<any>;
    cartFetchFromEndpoint(endpoint: string): Promise<any>;
    vtexCategoryTreeLoopbackFetchFromEndpoint(endpoint: string): Promise<any>;
    getVtexCategoryTree(): Promise<any>;
    getVtexCategoryTreeloopback(): Promise<any>;
    functionVtexCategoryTreeLoopbackForData(responseData: any): Promise<any>;
    getVtexCollection(collectionId: string): Promise<any>;
    getVtexProducListingPage(categoryId: String): Promise<any>;
    getVtexProductDetails(productId: string): Promise<any>;
    getProductById(pid: string): Promise<any>;
    getVtexCartDetails(): Promise<any>;
    getTransformedVtexProductDetails(productId: string): Promise<any>;
    getBestSellingProducts(): Promise<any>;
    getNewSellingProducts(): Promise<any>;
    getVtexProductByCategory(categoryId: any): Promise<any>;
    getVtexProductBySubCategory(subCategoryId: any): Promise<any>;
    getVtexProductByQuery(query: any): Promise<any>;
    private transformProductDetails;
    private vtextransformCategoryTreeloopback;
    private CategroychildrenDataloopback;
    private vtextransformCategoryTree;
    private CategroychildrenData;
    private transformVtexProductDetailPage;
}
