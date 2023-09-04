import { VtexDataSource } from '../datasources';
export declare class VtexService {
    protected dataSource: VtexDataSource;
    constructor(dataSource: VtexDataSource);
    fetchFromEndpoint(endpoint: string): Promise<any>;
    getTransformedVtexProductDetails(productId: string): Promise<any>;
    private transformProductDetails;
    getVtexCategoryTree(): Promise<any>;
    getVtexCollection(collectionId: string): Promise<any>;
    getVtexProducListingPage(categoryId: String): Promise<any>;
    getVtexProductDetails(productId: string): Promise<any>;
    getProductById(pid: string): Promise<any>;
    getVtexCartDetails(): Promise<any>;
    getBestSellingProducts(): Promise<any>;
    private vtextransformCategoryTree;
    private CategroychildrenData;
    private transformVtexProductDetailPage;
    private filterSubcategories;
    getVtexCategoryTreeloopback(): Promise<any>;
    getProductsByCategory(categoryId: any): Promise<any[]>;
    private vtextransformCategoryTreeloopback;
    private CategroychildrenDataloopback;
    vtexCategoryTreeLoopbackFetchFromEndpoint(endpoint: string): Promise<any>;
}
