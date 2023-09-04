import {inject, Provider, injectable} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import axios from 'axios';
import {CategoryDataSource} from '../datasources';

@injectable()
export class TreesService {
  constructor(
    @inject('datasources.category') protected dataSource: CategoryDataSource,
  ) {}

  async fetchFromEndpoint(endpoint: string): Promise<any> {
    try {
      const response = await axios.get(`${this.dataSource.settings.baseURL}/${endpoint}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getConcreteProductDetails(productId: string): Promise<any> {
    const endpoint = `concrete-products/${productId}?include=concrete-product-image-sets%252cconcrete-product-availabilities`;
    return this.fetchFromEndpoint(endpoint);
  }

  async getBestSellingProduct(): Promise<any> {
    const endpoint = `concrete-products/099_27207215?include=concrete-product-availabilities%2Cconcrete-product-image-sets%2Cconcrete-product-prices`;
    const response = await this.fetchFromEndpoint(endpoint);
    const transformedResponse = this.extractDesiredFields(response);
    return transformedResponse;
  }

  private extractDesiredFields(response: any): any {
    // Extract desired fields from the API response
    const data = response.data;
    const attributes = data.attributes;
    const imageSet = response.included.find((item: any) => item.type === 'concrete-product-image-sets');
    const largeImageUrl = imageSet?.attributes?.imageSets[0]?.images[0]?.externalUrlLarge;

    // Create a new response with the desired information
    return {
      productId: attributes.sku,
      skuId: attributes.sku,
      name: attributes.name,
      largeImageUrl: largeImageUrl,
    };
  }

  async getCatalogSearchSuggestions(query: string): Promise<any[]> {
    const endpoint = `catalog-search-suggestions?q=${query}`;
    const response = await this.fetchFromEndpoint(endpoint);

    // Extract and transform the desired fields from the response
    // const transformedResponse = this.transformCatalogSearchSuggestions(response);

    return response;
  }

  private transformCatalogSearchSuggestions(response: any): any[] {
    const data = response.data;
  const transformedSuggestions = data[0]?.attributes?.abstractProducts?.map((item: any) => {
    return {
      ProductId: item.abstractSku,
      SkuId: item.abstractSku,
      ProductName: item.abstractName,
      price: item.price,
      SkuImageUrl: item.images[0]?.externalUrlLarge || null,
    };
  }) || [];

  return transformedSuggestions;
  }

}