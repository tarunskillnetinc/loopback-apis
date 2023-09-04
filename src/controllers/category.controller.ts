// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import { TreesService} from '../services';
import {
  Request,
  RestBindings,
  get,
  response,
  param,
  ResponseObject,
} from '@loopback/rest';


export class CategoryController {
  constructor(
    @inject('services.TreesService') private treesService: TreesService,
  ) {}

  @get('/get-category-trees')
  @response(200, {
    description: 'Get category trees from the external API',
  })
  async getCategoryTrees(): Promise<any> {
    try {
      const categoryTrees = await this.treesService.fetchFromEndpoint('category-trees');
      return categoryTrees;
    } catch (error) {
      // Handle errors
      throw error;
    }
  }

  @get('/spryker-product/{productId}')
  @response(200, {
    description: 'Get concrete product details from the external API',
  })
  async getConcreteProductDetails(@param.path.string('productId') productId: string): Promise<any> {
    try {
      const productDetails = await this.treesService.getConcreteProductDetails(productId);
      return productDetails;
    } catch (error) {
      // Handle errors
      throw error;
    }
  }

  @get('/spryker-best-selling-products')
  @response(200, {
    description: 'Get best selling products from the external API',
  })
  async getBestSellingProducts(): Promise<any> {
    try {
      const bestSellingProducts = await this.treesService.getBestSellingProduct();
      return bestSellingProducts;
    } catch (error) {
      // Handle errors
      throw error;
    }
  }

  @get('/spryker-best-selling/{query}')
  @response(200, {
    description: 'Get VTEX catalog search suggestions from the external API',
  })
  async getCatalogSearchSuggestions(@param.path.string('query') query: string): Promise<any[]> {
    try {
      const catalogSearchSuggestions = await this.treesService.getCatalogSearchSuggestions(query);
      return catalogSearchSuggestions;
    } catch (error) {
      // Handle errors
      throw error;
    }
  }

}