import { CategoryDataSource } from '../datasources';
export declare class TreesService {
    protected dataSource: CategoryDataSource;
    constructor(dataSource: CategoryDataSource);
    fetchFromEndpoint(endpoint: string): Promise<any>;
    getConcreteProductDetails(productId: string): Promise<any>;
    getBestSellingProduct(): Promise<any>;
    private extractDesiredFields;
    getCatalogSearchSuggestions(query: string): Promise<any[]>;
    private transformCatalogSearchSuggestions;
}
