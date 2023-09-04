import { TreesService } from '../services';
export declare class CategoryController {
    private treesService;
    constructor(treesService: TreesService);
    getCategoryTrees(): Promise<any>;
    getConcreteProductDetails(productId: string): Promise<any>;
    getBestSellingProducts(): Promise<any>;
    getCatalogSearchSuggestions(query: string): Promise<any[]>;
}
