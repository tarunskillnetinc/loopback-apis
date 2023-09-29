import { inject } from "@loopback/core";
import { CommercecloudService } from "../services";
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
} from "@loopback/rest";

export class CommercecloudController {
  constructor(
    @inject("services.CommercecloudService")
    private sprykerService: CommercecloudService,
    @inject(RestBindings.Http.REQUEST) private request: Request
  ) {}

  @get('/sfcc/new-arrivals')
  @response(200, {
    description: 'Get VTEX best selling products from the external API',
  })
  async getSfBestSellingProducts(): Promise<any> {
    try {
      const bestSellingProducts = await this.sprykerService.sfBestSelling();
      return bestSellingProducts;
    } catch (error) {
      throw error;
    }
  }
  @get("/sfcc/demo-products-by-category/{categoryId}")
  @response(200, {
    description: "Get Salesforce Product List by search category",
  })
  async getSalesforceProductByCategory(
    @param.path.string("categoryId") categoryId: any
  ): Promise<any> {
    try {
      console.log("aaff");
      const getSalesForceProducts =
        await this.sprykerService.getSalesforceProductByCategory(categoryId);
      console.log("aashh");
      return getSalesForceProducts;
    } catch (error) {
      throw error;
    }
  }

  @get("/sfcc/products-by-category/{category}")
  @response(200, {
    description: "Search for products using facets",
  })
  async SalesforceByFacets(
    @param.path.string('category') category: string,

    @param.query.string('color') color?: any,

    @param.query.string('size') size?: any,
    
    @param.query.string('minprice') minprice?: any,

    @param.query.string('maxprice') maxprice?: any,

    @param.query.string('sortbyprice') sortbyprice?: any,

    @param.query.string('sortbyname') sortbyname?: any,

  ): Promise<any> {
    try {
      const data = await this.sprykerService.searchByFacets(category,color,size,minprice,maxprice,sortbyprice,sortbyname);
      const response = await data;
      return response;
    } catch (error) {
      throw error;
    }
  }

  @get("/sfcc/products-by-sub-category/{category}")
  @response(200, {
    description: "Search for products using facets",
  })
  async SalesforceByCategory(
    @param.path.string('category') category: string,

    @param.query.string('color') color?: any,

    @param.query.string('size') size?: any,
    
    @param.query.string('minprice') minprice?: any,

    @param.query.string('maxprice') maxprice?: any,

    @param.query.string('sortbyprice') sortbyprice?: any,

    @param.query.string('sortbyname') sortbyname?: any,

  ): Promise<any> {
    try {
      const data = await this.sprykerService.searchByFacets(category,color,size,minprice,maxprice,sortbyprice,sortbyname);
      const response = await data;
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  @get("/sfcc/product-by-id/{productId}")
  @response(200, {
    description: "Get Salesforce product details from the external API",
  })
  async salesForceProduct(
    @param.path.string("productId") productId: string
  ): Promise<any> {
    try {
      const salesforceProductDetails =
        await this.sprykerService.getsalesForceProductById(productId);
      console.log("salesforceProductDetails", salesforceProductDetails);
      return salesforceProductDetails;
    } catch (error) {
      throw error;
    }
  }

  @post("/sfcc/login")
  @response(200, {
    description: "Get Salesforce product details from the external API",
  })
  async salesForceLogin(
    @requestBody() requestBody: { email: string; password: string }
  ): Promise<any> {
    try {
      const salesforceloginDetails =
        await this.sprykerService.postsalesForceLogin(requestBody);
      console.log("salesforceloginDetails", salesforceloginDetails);
      return salesforceloginDetails;
    } catch (error) {
      console.log("errorcontroller", error);
      throw error;
    }
  }
  @get('/sfcc/category-tree')
  @response(200, {
    description: 'Get Salesforce product details from the external API',
  })
  async salesForceCategory(): Promise<any> {
    try {
      const salesforceProductDetails = await this.sprykerService.getSalesForceCategory();
      console.log('salesforceProductDetails', salesforceProductDetails);
      return salesforceProductDetails;
    } catch (error) {
      throw error;
    }
  }

  @post('/sfcc/add-items/{cartId}')
  @response(200,{
    description: 'Add Products in Cart',
  })
  async addItems(
    @param.path.string('cartId') cartId: any,
    @param.header.string('bearer') bearer: string,
    @requestBody() requestBody:{orderItems:[]},
  ): Promise<any>{
    try{
      const header = this.request.headers.bearer;
      const items = await this.sprykerService.addItems(cartId, requestBody, header);
      return items;
    }
    catch(error){
      throw error;
    }
  }

  @get('/sfcc/getCartDetails/{baskets_id}')
  @response(200,{
    description: 'Get Salesforce Product Items using customers api',
  })
  async getSalesforceProductItems(
    @param.path.string('baskets_id') baskets_id: any,
    @param.header.string('bearer') bearer: string,
    ): Promise<any>{
    try{
      console.log('aamir');
      const header = this.request.headers.bearer;
      const getSalesForceProducts = await this.sprykerService.getSalesforceProductItems(baskets_id,header);
      return getSalesForceProducts;
    }
    catch(error){
      throw error;
    }
  }

  @patch('/sfcc/update-cart/{baskets_id}/items/{items_id}')

  @response(200,{

    description: 'patch Salesforce Product Items using baskets api',

  })
  async updateSalesforceProductItems(
    @param.path.string('baskets_id') baskets_id: any,
    @param.path.string('items_id') items_id:any,
    @param.header.string('bearer') bearer: string,
    @requestBody() requestBody:{quantity:any}
    ): Promise<any>{
    try{
      console.log('aaaaa');
      const header = this.request.headers.bearer;
      const getSalesForceProducts = await this.sprykerService.updateSalesforceProductItems(baskets_id,items_id,requestBody,header);
      console.log('getSalesForceProductsbbbb',getSalesForceProducts);
      return getSalesForceProducts;
    } 
    catch(error){
      throw error;
    }
  }

  //Deleting Cart Items:
  @post('/sfcc/removeItem/{cart_Id}')
  @response(200,{
    message: "API to remove product from cart"
  })
  async removeItem(
    @requestBody() requestBody:{itemId:[]},
    @param.header.string('bearer') bearer: any,
    @param.path.string('cart_Id') cart_Id : any
  ): Promise<any>{
    try{
      const data = await this.sprykerService.removeItem(cart_Id,requestBody,bearer);
      return data;
    }
    catch(error){
      throw error;
    }
  }
}
