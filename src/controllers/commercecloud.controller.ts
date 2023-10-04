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
    private sfccService: CommercecloudService,
    @inject(RestBindings.Http.REQUEST) private request: Request
  ) {}

  @get('/sfcc/new-arrivals')
  @response(200, {
    description: 'Get VTEX best selling products from the external API',
  })
  async getSfBestSellingProducts(): Promise<any> {
    try {
      const bestSellingProducts = await this.sfccService.sfBestSelling();
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
        await this.sfccService.getSalesforceProductByCategory(categoryId);
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
      const data = await this.sfccService.searchByFacets(category,color,size,minprice,maxprice,sortbyprice,sortbyname);
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
      const data = await this.sfccService.searchByFacets(category,color,size,minprice,maxprice,sortbyprice,sortbyname);
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
        await this.sfccService.getsalesForceProductById(productId);
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
        await this.sfccService.postsalesForceLogin(requestBody);
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
      const salesforceProductDetails = await this.sfccService.getSalesForceCategory();
      console.log('salesforceProductDetails', salesforceProductDetails);
      return salesforceProductDetails;
    } catch (error) {
      throw error;
    }
  }

  @post('/sfcc/add-items/{baskets_id}')
  @response(200,{
    description: 'Add Products in Cart',
  })
  async addItems(
    @param.path.string('baskets_id') baskets_id: any,
    @param.header.string('token') token: string,
    @requestBody() requestBody:{orderItems:[]},
  ): Promise<any>{
    try{
      const header = this.request.headers.token;
      const items = await this.sfccService.addItems(baskets_id, requestBody, header);
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
    @param.header.string('token') token: string,
    ): Promise<any>{
    try{
      const header = this.request.headers.token;
      const getSalesForceProducts = await this.sfccService.getSalesforceProductItems(baskets_id,header);
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
    @param.header.string('token') token: string,
    @requestBody() requestBody:{quantity:any}
    ): Promise<any>{
    try{
      console.log('aaaaa');
      const header = this.request.headers.token;
      const getSalesForceProducts = await this.sfccService.updateSalesforceProductItems(baskets_id,items_id,requestBody,header);
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
    @param.header.string('token') token: any,
    @param.path.string('cart_Id') cart_Id : any
  ): Promise<any>{
    try{
      const data = await this.sfccService.removeItem(cart_Id,requestBody,token);
      return data;
    }
    catch(error){
      throw error;
    }
  }

  //Create Cart:
  @post('/sfcc/createCart')
  @response(200,{
    message: "API for creating Cart"
  })
  async createCart(
    @param.header.string('token') token: any,
  ): Promise<any>{
    try{
      const data = await this.sfccService.createCart(token);
      return data;
    }
    catch(error){
      throw error;
    }
  }


  @post('/sfcc/confirmPayment/{clientId}/{basketId}')
  @response(200,{
    message: "API for confirm Payment"
  })
  async confirmPayment(
    @param.path.string('clientId') clientId: any,
    @param.path.string('basketId') basketId: any,
    @param.header.string('token') token: any,
    @requestBody() requestBody:any,
  ): Promise<any>{
    try{
      const headers = this.request.headers.token;
      const data = await this.sfccService.confirmPayment(clientId,basketId,headers,requestBody);
      return data;
    }
    catch(error){
      throw error;
    }
  }



  //Get Basket Details based on Customer ID:
  @get('/sfcc/getCustomerCart/{customerId}')
  @response(200,{
    message: "API for getting customer cart on belhaf of customer id"
  })
  async customerCart(
    @param.path.string('customerId') customerId: any,
    @param.header.string('token') token: any,
  ): Promise<any>{
    try{
      const data = await this.sfccService.customerCart(customerId,token);
      return data;
    }
    catch(error){
      throw error;
    }
  }

  //Get Customer User Details:
  @get('/sfcc/user-Details/{customers_id}')
  @response(200,{
    description: 'Get Salesforce user-details addresses using customers api',
  })
  async getUserDetails(
    @param.path.string('customers_id') customers_id: any,
    @param.header.string('token') token: string,
    ): Promise<any>{
    try{
      const header = this.request.headers.token;
      const getSalesForceProducts = await this.sfccService.getUserDetails(customers_id,header);
      return getSalesForceProducts;
    }
    catch(error){
      throw error;
    }
  }

  //Controller to get Order Details:
  @get('/sfcc/order-Details/{customers_id}/orders')
  @response(200,{
    description: 'Get user order details',
  })
  async getOrderDetails(
    @param.path.string('customers_id') customers_id: any,
    @param.header.string('token') token: string,
    ): Promise<any>{
    try{
      const header = this.request.headers.token;
      const getSalesForceProducts = await this.sfccService.getOrderDetails(customers_id,header);
      return getSalesForceProducts;
    }
    catch(error){
      throw error;
    }
  }

  //To get Payment Methods:
  @get('/sfcc/getPaymentMethodDetails/{baskets_id}')
  @response(200,{
    description: 'Get Salesforce Payment Methods',
  })
  async getSaleforcePaymentMethodDetails(
    @param.path.string('baskets_id') baskets_id: any,
    @param.header.string('token') token: string,
    ): Promise<any>{
    try{
      const header = this.request.headers.token;
      const getSalesForceProducts = await this.sfccService.getSaleforcePaymentMethodDetails(baskets_id,header);
      return getSalesForceProducts;
    }
    catch(error){
      throw error;
    }
  }

}
