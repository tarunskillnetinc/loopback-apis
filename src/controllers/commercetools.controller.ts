import { inject } from "@loopback/core";
import { CommercetoolsProvider } from "../services";
import {
  Request,
  RestBindings,
  get,
  post,
  del,
  response,
  param,
  requestBody,
  ResponseObject,
  patch,
  put,
} from "@loopback/rest";


export class CommercetoolsController {
  constructor(
    @inject("services.CommercetoolsProvider")
    private commercetools: CommercetoolsProvider,
    @inject(RestBindings.Http.REQUEST) private request: Request,
    @inject(RestBindings.Http.RESPONSE) private response: any) {}

  @get("/commercetools/allProducts")
  @response(200, {
    description: "Search for products using facets",
  })
  async ctByFacets(): Promise<any> {
    try {
      const data = await this.commercetools.searchByFacets();
      console.log('data', data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  @get("/commercetools/products-by-category/{categoryId}")
  @response(200, {
    description: "Search for products using facets",
  })
  async ctByCategory(
    @param.path.string("categoryId") categoryId: string
    ): Promise<any> {
    try {
      const data = await this.commercetools.productsByCategory(categoryId);
      console.log('data', data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  @get("/commercetools/product-by-id/{productId}")
  @response(200, {
    description: "Get CommerceTools product details from the external API",
  })
  async commerceToolsProduct(
    @param.path.string("productId") productId: string
    ): Promise<any> {
    try {
      const commerceToolsProductDetails =
        await this.commercetools.getCommerceToolsProductById(productId);
      console.log("salesforceProductDetails", commerceToolsProductDetails);
      return commerceToolsProductDetails;
    } catch (error) {
      throw error;
    }
  }

  @get("/commercetools/createCart")
  @response(200, {
    description: "Get CommerceTools cart details from the external API",
  })
  async commerceToolsCart(): Promise<any> {
    try {
      const commerceToolsProductDetails = {
        baskets: [
          {
            basket_id: "270db930-3ca4-4f70-8e47-c1d367f18d0b",
          },
        ],
      };

      return commerceToolsProductDetails;
    } catch (error) {
      throw error;
    }
  }

  @post('/commercetools/addItem/{baskets_id}')
  @response(200,{
    description: 'Add Products in Cart',
  })
  async addItems(
    @param.path.string('baskets_id') baskets_id: any,
    // @param.header.string('token') token: string,
    @requestBody() requestBody:{orderItems:[]},
  ): Promise<any>{
    try{
      // const header = this.request.headers.token;
      const items = await this.commercetools.addItems(baskets_id, requestBody);
      return items;
    }
    catch(error){
      throw error;
    }
  }

  @post('/commercetools/updateItem/{baskets_id}')
  @response(200,{
    description: 'Add Products in Cart',
  })
  async updateItems(
    @param.path.string('baskets_id') baskets_id: any,
    // @param.header.string('token') token: string,
    @requestBody() requestBody:{orderItems:[]},
  ): Promise<any>{
    try{
      // const header = this.request.headers.token;
      const items = await this.commercetools.updateItems(baskets_id, requestBody);
      return items;
    }
    catch(error){
      throw error;
    }
  }

  @del('/commercetools/removeItem/{baskets_id}/items/{indexId}')
  @response(200,{
    description: 'Add Products in Cart',
  })
  async removeItem(
    @param.path.string('baskets_id') baskets_id: any,
    @param.path.string('indexId') indexId: any,
    // @param.header.string('token') token: string,
  ): Promise<any>{
    try{
      // const header = this.request.headers.token;
      const items = await this.commercetools.removeItems(baskets_id, indexId);
      return items;
    }
    catch(error){
      throw error;
    }
  }

  @get("/commercetools/category-tree")
  @response(200, {
    description: "Get CommerceTools cart details from the external API",
  })
  async commerceToolsCategoryTree(): Promise<any> {
    try {
      const categoryTree = await this.commercetools.commerceToolsCategory();

      return categoryTree;
    } catch (error) {
      throw error;
    }
  }
  @get("/commercetools/best-selling-products")
  @response(200, {
    description: "Get CommerceTools best selling from the external API",
  })
  async commerceToolsBestSelling(): Promise<any> {
    try {
      const collectionId = "38080ee5-1be2-444a-a8be-aa28b25bb7c6"
      const categoryTree = await this.commercetools.commerceToolsCollection(collectionId);

      return categoryTree;
    } catch (error) {
      throw error;
    }
  }
  @get("/commercetools/new-arrivals")
  @response(200, {
    description: "Get CommerceTools new arrivals from the external API",
  })
  async commerceToolsNewArrivals(): Promise<any> {
    try {
      const collectionId = "451c8eb0-2572-46b0-a631-60891f2ebc30"
      const categoryTree = await this.commercetools.commerceToolsCollection(collectionId);

      return categoryTree;
    } catch (error) {
      throw error;
    }
  }
  @get('/commercetools/cartDetail/{baskets_id}')
  @response(200,{
    description: 'get Cart',
  })
  async cartDetail(
    @param.path.string('baskets_id') baskets_id: any,
  ): Promise<any>{
    try{
      const items = await this.commercetools.commerceToolCartDetail(baskets_id);
      return items;
    }
    catch(error){
      throw error;
    }
  }
}
