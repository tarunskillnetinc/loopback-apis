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
  put,
} from "@loopback/rest";

export class CommercecloudController {
  constructor(
    @inject("services.CommercecloudService")
    private sfccService: CommercecloudService,
    @inject(RestBindings.Http.REQUEST) private request: Request,
    @inject(RestBindings.Http.RESPONSE) private response: any
    
  ) {}
  
  handlegetResponse(response:any):any{
    console.log("response12345667",response?.status)
    if(response?.status!=undefined)
    {
      return this.response.status(response?.status).json(response)
    }
    else{
      console.log("else")
      return this.response.status(200).json(response);
    }
  }
  handlepostResponse(response:any):any{
    console.log("response123",response)
    if(response?.status!=undefined)
    {
      return this.response.status(response?.status).json(response)
    }
    else{
      if (response._type=="order") {
        return this.response.status(200).json(response)
      }
      else{
      return this.response.status(201).json(response);
      }
    }
  }
  handlepatchResponse(response:any):any{
    if(response?.status!=undefined)
    {
      return this.response.status(response?.status).json(response)
    }
    else{
      console.log("else")
      return this.response.status(200).json(response);
    }
  }
  handledeleteResponse(response:any):any{
    if(response?.status!=undefined)
    {
      return this.response.status(response?.status).json(response)
    }
    else{
      console.log("else")
      return this.response.status(204).json(response);
    }
  }
  @get('/sfcc/new-arrivals')
  @response(200, {
    description: 'Get sfcc new arrivals products from the external API',
  })
  async getSfBestSellingProducts(): Promise<any> {
    try {
      const bestSellingProducts = await this.sfccService.sfBestSelling();
      return this.handlegetResponse(bestSellingProducts);
    } catch (error) {
      throw error;
    }
  }

  @get('/sfcc/best-selling-products')
  @response(200, {
    description: 'Get sfcc best selling products from the external API',
  })
  async getSfbestsellingproducts(): Promise<any> {
    try {
      const bestSellingProducts = await this.sfccService.sfBestSelling();
      return this.handlegetResponse(bestSellingProducts);
    } catch (error) {
      throw error;
    }
  }
  // @get("/sfcc/products-by-category/{categoryId}")
  // @response(200, {
  //   description: "Get Salesforce Product List by search category",
  // })
  // async getSalesforceProductByCategory(
  //   @param.path.string("categoryId") categoryId: any
  // ): Promise<any> {
  //   try {
  //     console.log("aaff");
  //     const getSalesForceProducts =
  //       await this.sfccService.getSalesforceProductByCategory(categoryId);
  //       return this.handlegetResponse(getSalesForceProducts);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

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
    @param.query.string('productsPerPage') productsPerPage?: any,
    @param.query.string('page') page?: any,

  ): Promise<any> {
    try {
      const data = await this.sfccService.searchByFacets(category,color,size,minprice,maxprice,sortbyprice,sortbyname,productsPerPage,page);
      const response = await data;
      return this.handlegetResponse(response)
    } catch (error) {
      throw error;
    }
  }

  @get("/sfcc/products-by-sub-category/{category}")
  @response(200, {
    description: "Search for products using sub category",
  })
  async SalesforceByCategory(
    @param.path.string('category') category: string,
    @param.query.string('color') color?: any,
    @param.query.string('size') size?: any,
    @param.query.string('minprice') minprice?: any,
    @param.query.string('maxprice') maxprice?: any,
    @param.query.string('sortbyprice') sortbyprice?: any,
    @param.query.string('sortbyname') sortbyname?: any,
    @param.query.string('productsPerPage') productsPerPage?: any,
    @param.query.string('page') page?: any,
  ): Promise<any> {
    try {
      const data = await this.sfccService.searchByFacets(category,color,size,minprice,maxprice,sortbyprice,sortbyname,productsPerPage,page);
      const response = await data;
      return this.handlegetResponse(response)
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
      return this.handlegetResponse(salesforceProductDetails)
    } catch (error) {
      throw error;
    }
  }

  @post("/sfcc/login")
  @response(200, {
    description: "Login user from the external API",
  })
  async salesForceLogin(
    @requestBody() requestBody: { email: string; password: string }
  ): Promise<any> {
    try {
      const salesforceloginDetails =
        await this.sfccService.postsalesForceLogin(requestBody);
      console.log("salesforceloginDetails", salesforceloginDetails);
      return this.handlepostResponse(salesforceloginDetails)
    } catch (error) {
      console.log("errorcontroller", error);
      throw error;
    }
  }

  @get('/sfcc/category-tree')
  @response(200, {
    description: 'Get Salesforce category tree from the external API',
  })
  async salesForceCategory(): Promise<any> {
    try {
      const salesforceProductDetails = await this.sfccService.getSalesForceCategory();
      console.log('salesforceProductDetails', salesforceProductDetails);
      return this.handlegetResponse(salesforceProductDetails)
    } catch (error) {
      throw error;
    }
  }

  @post('/sfcc/addItem/{baskets_id}')
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
      return this.handlepostResponse(items)
    }
    catch(error){
      throw error;
    }
  }

  @get('/sfcc/cartDetail/{baskets_id}')
  @response(200,{
    description: 'Get Cart Details using basket id',
  })
  async getSalesforceProductItems(
    @param.path.string('baskets_id') baskets_id: any,
    @param.header.string('token') token: string,
    ): Promise<any>{
    try{
      const header = this.request.headers.token;
      const getSalesForceProducts = await this.sfccService.getSalesforceProductItems(baskets_id,header);
      return this.handlegetResponse(getSalesForceProducts)
    }
    catch(error){
      throw error;
    }
  }

  @patch('/sfcc/updateItem/{baskets_id}')
  @response(200,{
    description: 'patch update cart using baskets api',
  })
  async updateSalesforceProductItems(
    @param.path.string('baskets_id') baskets_id: any,
    // @param.path.string('items_id') items_id:any,
    @param.header.string('token') token: string,
    @requestBody() requestBody:{quantity:any}
    ): Promise<any>{
    try{
      console.log('afreen');
      const header = this.request.headers.token;
      const getSalesForceProducts = await this.sfccService.updateSalesforceProductItems(baskets_id,requestBody,header);
      console.log('getSalesForceProductsbbbb',getSalesForceProducts);
      return this.handlepatchResponse(getSalesForceProducts)
    } 
    catch(error){
      throw error;
    }
  }

  //Deleting Cart Items:
  @del('/sfcc/removeItem/{basket_Id}')
  @response(200,{
    message: "API to remove product from cart"
  })
  async removeItem(
    @requestBody() requestBody:{itemId:[]},
    @param.header.string('token') token: any,
    @param.path.string('basket_Id') basket_Id : any
  ): Promise<any>{
    try{
      const data = await this.sfccService.removeItem(basket_Id,requestBody,token);
      return this.handledeleteResponse(data)
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
      return this.handlepostResponse(data)
    }
    catch(error){
      throw error;
    }
  }

  // shipment method put 
  @put('/sfcc/shippment_method/{baskets_id}')
  @response(200,{
    description: 'put shipping method api',
  })
  async updateSalesforceshippingmehtod(
    @param.path.string('baskets_id') baskets_id: any,
    @param.header.string('token') token: string,
    ): Promise<any>{
    try{
      const header = this.request.headers.token;
      const updateSalesForceshippment = await this.sfccService.updateSalesForceshippment(baskets_id,header);
      console.log('getSalesForceProductsbbbb',updateSalesForceshippment);
      return this.handlepatchResponse(updateSalesForceshippment)
    } 
    catch(error){
      throw error;
    }
  }

  @put('/sfcc/new_shippment_method/{baskets_id}')
  @response(200,{
    description: 'put dynamic shipping method api',
  })
  async newupdateSalesforceshippingmehtod(
    @param.path.string('baskets_id') baskets_id: any,
    @param.query.string('shipment_id') shipment_id: any,
    @param.header.string('token') token: string,
    @requestBody() requestBody:{},

    ): Promise<any>{
    try{
      const header = this.request.headers.token;
      const updateSalesForceshippment = await this.sfccService.newupdateSalesForceshippment(baskets_id,shipment_id,requestBody,header);
      console.log('getSalesForceProductsbbbb',updateSalesForceshippment);
      return this.handlepatchResponse(updateSalesForceshippment)
    } 
    catch(error){
      throw error;
    }
  }
  // shippment method end

  
  // shipping address method put 
  @put('/sfcc/shipping_address/{baskets_id}')
  @response(200,{
    description: 'patch shipping method api',
  })
  async updateSalesForceaddress(
    @param.path.string('baskets_id') baskets_id: any,
    @param.header.string('token') token: string,
    ): Promise<any>{
    try{
      const header = this.request.headers.token;
      const updateSalesForceshippment = await this.sfccService.updateSalesForceaddress(baskets_id,header);
      console.log('getSalesForceProductsbbbb',updateSalesForceshippment);
      return this.handlepatchResponse(updateSalesForceshippment)
    } 
    catch(error){
      throw error;
    }
  }

  @put('/sfcc/new_shipping_address/{baskets_id}')
  @response(200,{
    description: 'patch shipping method api',
  })
  async newupdateSalesForceaddress(
    @param.path.string('baskets_id') baskets_id: any,
    @param.query.string('shipment_id')shipment_id:string,
    @param.header.string('token') token: string,
    @requestBody() requestBody:{},
    ): Promise<any>{
    try{
      const header = this.request.headers.token;
      const updateSalesForceshippment = await this.sfccService.newupdateSalesForceaddress(baskets_id,shipment_id,requestBody,header);
      console.log('getSalesForceProductsbbbb',updateSalesForceshippment);
      return this.handlepatchResponse(updateSalesForceshippment)
    } 
    catch(error){
      throw error;
    }
  }
  // shipping address method end

  
  // billing address method put 
  @put('/sfcc/billing_address/{baskets_id}')
  @response(200,{
    description: 'patch shipping method api',
  })
  async updateSalesForcebillingaddress(
    @param.path.string('baskets_id') baskets_id: any,
    @param.header.string('token') token: string,
    ): Promise<any>{
    try{
      const header = this.request.headers.token;
      const updateSalesForcebillingaddress = await this.sfccService.updateSalesForcebillingaddress(baskets_id,header);
      console.log('getSalesForceProductsbbbb',updateSalesForcebillingaddress);
      return this.handlepatchResponse(updateSalesForcebillingaddress)
    } 
    catch(error){
      throw error;
    }
  }

  @put('/sfcc/new_billing_address/{baskets_id}')
  @response(200,{
    description: 'patch shipping method api',
  })
  async newupdateSalesForcebillingaddress(
    @param.path.string('baskets_id') baskets_id: any,
    @param.header.string('token') token: string,
    @requestBody() requestBody:any,

    ): Promise<any>{
    try{
      const header = this.request.headers.token;
      const updateSalesForcebillingaddress = await this.sfccService.newupdateSalesForcebillingaddress(baskets_id,requestBody,header);
      console.log('getSalesForceProductsbbbb',updateSalesForcebillingaddress);
      return this.handlepatchResponse(updateSalesForcebillingaddress)
    } 
    catch(error){
      throw error;
    }
  }
  // billing address method end

  @post('/sfcc/confirmPayment/{basketId}')
  @response(200,{
    message: "API for confirm Payment"
  })
  async confirmPayment(
    @param.path.string('basketId') basketId: any,
    @param.header.string('token') token: any,
    @requestBody() requestBody:any,
  ): Promise<any>{
    try{
      const headers = this.request.headers.token;
      const data = await this.sfccService.confirmPayment(basketId,headers,requestBody);
      return this.handlepostResponse(data)
    }
    catch(error){
      throw error;
    }
  }

  @post('/sfcc/placeOrder')
  @response(200,{
    message: "API for placing Order "
  })
  async placeOrder(
    @param.header.string('token') token: any,
    @requestBody() requestBody:any,
  ): Promise<any>{
    try{
      const headers = this.request.headers.token;
      const data = await this.sfccService.placeOrder(headers,requestBody);
      return data
      return this.handlepostResponse(data) 
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
      return this.handlegetResponse(data)
    }
    catch(error){
      throw error;
    }
  }

  //Get Customer User Details:
  @get('/sfcc/user-details/{customers_id}')
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
      return this.handlegetResponse(getSalesForceProducts)
    }
    catch(error){
      throw error;
    }
  }


  //crud customer address start
  @post('/sfcc/addCustomerAddress/{customerId}')
  @response(200,{
    message: "API for addCustomerAddress"
  })
  async addCustomerAddress(
    @param.path.string('customerId') customerId: any,
    @param.header.string('token') token: any,

    @requestBody() requestBody:any,
  ): Promise<any>{
    try{
      const headers = this.request.headers.token;
      const data = await this.sfccService.addCustomerAddress(headers,customerId,requestBody);
      return this.handlepostResponse(data)
    }
    catch(error){
      throw error;
    }
  }

  @del('/sfcc/removeCustomerAddress/{customerId}/address/{address_name}')
  @response(200,{
    message: "API for removeCustomerAddress"
  })
  async removeCustomerAddress(
    @param.path.string('customerId') customerId: any,
    @param.path.string('address_name') address_name: any,
    @param.header.string('token') token: any,
  ): Promise<any>{
    try{
      const headers = this.request.headers.token;
      const data = await this.sfccService.removeCustomerAddress(headers,customerId,address_name);
      return this.handledeleteResponse(data)
    }
    catch(error){
      throw error;
    }
  }
 
  @patch('/sfcc/updateCustomerAddress/{customerId}/address/{address_name}')
  @response(200,{
    message: "API for updateCustomerAddress"
  })
  async updateCustomerAddress(
    @param.path.string('customerId') customerId: any,
    @param.path.string('address_name') address_name: any,
    @param.header.string('token') token: any,
    @requestBody() requestBody:any,

  ): Promise<any>{
    try{
      const headers = this.request.headers.token;
      const data = await this.sfccService.updateCustomerAddress(headers,requestBody,customerId,address_name);
      return this.handlepatchResponse(data)
    }
    catch(error){
      throw error;
    }
  }

  //crud customer address end

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
      return this.handlegetResponse(getSalesForceProducts)
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
      return this.handlegetResponse(getSalesForceProducts)
    }
    catch(error){
      throw error;
    }
  }


  @get('/sfcc/shipping_method/{baskets_id}/{shipment_id}')
  @response(200,{
    description: 'patch shipping method api',
  })
  async getShiipingmethod(
    @param.path.string('baskets_id') baskets_id: any,
    @param.path.string('shipment_id') shipment_id: any,
    @param.header.string('token') token: string,
    ): Promise<any>{
    try{
      const header = this.request.headers.token;
      const shipping_method = await this.sfccService.getShiipingmethod(baskets_id,shipment_id,header);
      console.log('getshippingmethod',shipping_method);
      return this.handlegetResponse(shipping_method)
    } 
    catch(error){
      throw error;
    }
  }

   // by query controller:
   @get("/sfcc/products-by-query/{query}")
   @response(200, {
     description: "Search for products using facets",
   })
   async SalesforceByQuery(
     @param.path.string('query') query: string,
     @param.query.string('color') color?: any,
     @param.query.string('size') size?: any,
     @param.query.string('minprice') minprice?: any,
     @param.query.string('maxprice') maxprice?: any,
     @param.query.string('sortbyprice') sortbyprice?: any,
     @param.query.string('sortbyname') sortbyname?: any,
   ): Promise<any> {
     try {
       const data = await this.sfccService.searchByQuery(query,color,size,minprice,maxprice,sortbyname);
       const response = await data;
       return this.handlegetResponse(response)
     } catch (error) {
       throw error;
     }
   }
}
