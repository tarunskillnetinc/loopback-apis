import { get, patch , del, post, RestBindings, requestBody, Request, response, param, ResponseObject } from '@loopback/rest';
import { inject } from '@loopback/core';
import { VtexService } from '../services';
import axios, { AxiosResponse } from 'axios';
import FormData = require('form-data');
import { Response } from 'express';
import { request } from 'http';
// import axios from 'axios';

export class VtexController {
  constructor(
    @inject('services.VtexService') private vtexService: VtexService,
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private response:any  
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
      if (response?._type=="order") {
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
  @get('/vtex/category-tree')
  @response(200, {
    description: 'Get VTEX category tree from the external API',
  })

  async getVtexCategoryTree(): Promise<any> {
    try {
      const vtexCategoryTree = await this.vtexService.getVtexCategoryTree();
      return this.handlegetResponse(vtexCategoryTree)
    } catch (error) {
      throw error;
    }
  }
  @get('/vtex-product/{productId}')
  @response(200, {
    description: 'Get VTEX product details from the external API',
  })
  async getVtexProductDetails(@param.path.string('productId') productId: string): Promise<any> {
    try {
      const vtexProductDetails = await this.vtexService.getVtexProductDetails(productId);
      return this.handlegetResponse(vtexProductDetails)
    } catch (error) {
      throw error;
    }
  }
  // @get('/vtex-transformed/{productId}')
  // @response(200, {
  //   description: 'Get VTEX product details from the external API',
  // })
  // async gettransformedVtexProductDetails(@param.path.string('productId') productId: string): Promise<any> {
  //   try {
  //     const vtexProductDetails = await this.vtexService.getTransformedVtexProductDetails(productId);
  //     return vtexProductDetails;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // @get('/vtex-best-selling-products')
  // @response(200, {
  //   description: 'Get VTEX best selling products from the external API',
  // })
  // async getBestSellingProducts(): Promise<any> {
  //   try {
  //     const bestSellingProducts = await this.vtexService.getBestSellingProducts();
  //     return bestSellingProducts;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  @get('vtex/product-by-id/{pid}')
  @response(200, {
    description: "Get Vtex Products by their respective Id's",
  })
  async getProductById(@param.path.string('pid') pid: string):Promise<any>{
    try{
      const data = await this.vtexService.getProductById(pid)
      const response = await data;
      console.log('danish',response);
      return this.handlegetResponse(response)
      return response;
    }
    catch(error){
      throw error;
    }
  }


  @get('/vtex-collection/{collectionId}')
      @response(200, {
        description: 'Get VTEX product details from the external API',
      })
      async getVtexCollection(@param.path.string('collectionId') collectionId: string): Promise<any> {
        try {
          const vtexProductDetails = await this.vtexService.getVtexCollection(collectionId);
          return this.handlegetResponse(vtexProductDetails)
        } catch (error) {
          throw error;
        }
      }
      // @get('/vtex-plp')
      // @response(200, {
      //   description: 'Get VTEX product details from the external API',
      // })
      // async getVtexPlp(@param.path.string('categoryId') categoryId: string): Promise<any> {
      //   try {
      //     const vtexProductListingPage = await this.vtexService.getVtexProducListingPage(categoryId);
      //     return vtexProductListingPage;
      //   } catch (error) {
      //     throw error;
      //   }
      // }
      @get('/vtex/cartDetail/{baskets_id}')
      @response(200, {
        description: 'Get VTEX cart details from the external API',
      })
      async getVtexCartData(@param.path.string('baskets_id') baskets_id: any): Promise<any> {
        try {
          const vtexCartDetail = await this.vtexService.getVtexCartDetails(baskets_id);
          return this.handlegetResponse(vtexCartDetail)
        } catch (error) {
          throw error;
        }
      }
  @get('/vtex-transformed/{productId}')
  @response(200, {
    description: 'Get VTEX product details from the external API',
  })
  async gettransformedVtexProductDetails(@param.path.string('productId') productId: string): Promise<any> {
    try {
      const vtexProductDetails = await this.vtexService.getTransformedVtexProductDetails(productId);
      return vtexProductDetails;
    } catch (error) {
      throw error;
    }
  }

  @get('/vtex-best-selling-products-demo')
  @response(200, {
    description: 'Get VTEX best selling products from the external API',
  })
  async getBestSellingProducts(): Promise<any> {
    try {
      const bestSellingProducts = await this.vtexService.getBestSellingProducts();
      return this.handlegetResponse(bestSellingProducts)
    } catch (error) {
      throw error;
    }
  }
  @get('/vtex/best-selling-products')
  @response(200, {
    description: 'Get VTEX best selling products from the external API',
  })
  async getBestSellingProductsrating(): Promise<any> {
    try {
      const bestSellingProducts = await this.vtexService.getBestSellingProductsrating();
      return this.handlegetResponse(bestSellingProducts)
    } catch (error) {
      throw error;
    }
  }
  
  @get('/vtex/new-arrivals')
  @response(200, {
    description: 'Get VTEX best selling products from the external API',
  })
  async getTopSellingProductsrating(): Promise<any> {
    try {
      const bestSellingProducts = await this.vtexService.getTopSellingProductsrating();
      return this.handlegetResponse(bestSellingProducts)
    } catch (error) {
      throw error;
    }
  }
  @get('/vtex-plp/{categoryId}')

      @response(200, {

        description: 'Get VTEX product details from the external API',

      })

      async getVtexPlp(@param.path.string('categoryId') categoryId: string): Promise<any> {

        try {

          console.log("categoryID",categoryId)

          const vtexProductListingPage = await this.vtexService.getVtexProducListingPage(categoryId);
          return this.handlegetResponse(vtexProductListingPage)

        } catch (error) {

          throw error;

        }

      }
      @get('/get-vtex-category-tree-loopback')
      @response(200, {
        description: 'Get VTEX category tree from the external API',
      })
      async getVtexCategoryTreeloopback(): Promise<any> {
        try {
          const vtexCategoryTree = await this.vtexService.getVtexCategoryTreeloopback();
          return vtexCategoryTree;
        } catch (error) {
          throw error;
        }
      }
    // @get('/get-session')
    // @response(200, {
    //   description: 'Get VTEX category tree from the external API',
    // })
    // async getSession(): Promise<any> {
    //   try {
    //     const headers = this.req.headers;
    //     console.log('headers', headers.cookie);
    //     const session = await this.vtexService.getSession(headers.cookie);
    //     console.log('session', session.data);
    //     return session.data;
    //   } catch (error) {
    //     throw error;
    //   }
    // }

    @get('/vtex/products-by-category/{categoryId}')

    @response(200,{

      description: 'Get VTEX Product List by intelegent search',

    })

    async getVtexProductByCategory(
      @param.path.string('categoryId') categoryId: any,
      @param.query.string('color') color?: any,
      @param.query.string('size') size?: any,
      @param.query.string('minprice') minprice?: any,
      @param.query.string('maxprice') maxprice?: any,
      @param.query.string('sortbyprice') sortbyprice?: any,
      @param.query.string('sortbyname') sortbyname?: any,
      @param.query.string('productsPerPage') count?: any,
      @param.query.string('page') page?: any,
      ): Promise<any>{

      try{

        const getVtexProducts = await this.vtexService.getVtexProductByCategory(categoryId,color,size,minprice,maxprice,sortbyprice,sortbyname,count,page);
        return this.handlegetResponse(getVtexProducts)
      }

      catch(error){

        throw error;

      }

    }

    @get('/vtex/products-by-sub-category/{subCategoryId}')
    @response(200,{
      description: 'Get VTEX Product List by intelegent search',
    })
    async getVtexProductBySubCategory(
      @param.path.string('subCategoryId') subCategoryId: any,
      @param.query.string('color') color?: any,
      @param.query.string('size') size?: any,
      @param.query.string('minprice') minprice?: any,
      @param.query.string('maxprice') maxprice?: any,
      @param.query.string('sortbyprice') sortbyprice?: any,
      @param.query.string('sortbyname') sortbyname?: any,
      @param.query.string('productsPerPage') count?: any,
      @param.query.string('page') page?: any,
      ): Promise<any>{
      try{
        const getVtexProducts = await this.vtexService.getVtexProductBySubCategory(subCategoryId,color,size,minprice,maxprice,sortbyprice,sortbyname,count,page);
        return this.handlegetResponse(getVtexProducts)
      }
      catch(error){
        throw error;
      }
    }

    @get('/vtex/-products-by-query/{query}')
    @response(200,{
      description: 'Get VTEX Product List by intelegent search',
    })
    async getVtexProductByQuery(
      @param.path.string('query') query: any,
      @param.query.string('color') color?: any,
      @param.query.string('size') size?: any,
      @param.query.string('minprice') minprice?: any,
      @param.query.string('maxprice') maxprice?: any,
      @param.query.string('sortbyprice') sortbyprice?: any,
      @param.query.string('sortbyname') sortbyname?: any,
      @param.query.string('productsPerPage') count?: any,
      @param.query.string('page') page?: any
      ): Promise<any>{
      try{
        const getVtexProducts = await this.vtexService.getVtexProductByQuery(query,color,size,minprice,maxprice,sortbyprice,sortbyname,count,page);
        return this.handlegetResponse(getVtexProducts)
      }
      catch(error){
        throw error;
      }
    }

    @get('get-a-product-by-id/{pid}')
    @response(200, {
      description: "Get Vtex Products by their respective Id's",
    })
    async getAProductById(@param.path.string('pid') pid: string):Promise<any>{
      try{
        const data = await this.vtexService.getAProductById(pid)
        const response = await data;
        return response;
      }
      catch(error){
        throw error;
      }
    }

    @post('/vtex/createCart')
    @response(200, {
      description: "Get the current cart or create a new one if it doesn't exist yet.",
    })
    async getOrCreateCartId(@param.header.string('token') token: string):Promise<any>{
      try{
        const data = await this.vtexService.getOrCreateCartId(token)
        const response = await data;
        return this.handlepostResponse(response)
      }
      catch(error){
        console.log(error);
        throw error;
      }
    }

  @post('/vtex/login')
  async login(
    @requestBody() requestBody: { email: string; password: string },
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<any> {
    try {
      const { email, password } = requestBody;
      const login = await this.vtexService.login(email, password);
      // const data = login.resp.authCookie.Value;
      // const authCookie = login.validation;
      // const session = login.session;
      // console.log('login', login.validation);
      // console.log('login1', login.session);
      // console.log('amber12',authCookie)
      // console.log('login2', data);
      // console.log('login3', await login.data.resp.authCookie);
      // console.log('login4', await login.data.resp.accountAuthCookie);
      // console.log('login3', await login.data.session.sessionToken);
      // if (authCookie?.authCookie==undefined) {
      //   return login
      // }
      // else{
      //   response.cookie('VtexIdclientAutCookie_skillnet', authCookie.authCookie.Value, {
      //     maxAge: 3600000*24,
      //     httpOnly: true,
      //     secure: true,
      //     sameSite: 'none',
      //     path: '/',
      //   });
      //   response.cookie('VtexIdclientAutCookie_13ca6e38-75b0-4070-8cf2-5a61412e4919', authCookie.accountAuthCookie.Value, {
      //     maxAge: 3600000*24,
      //     httpOnly: true,
      //     secure: true,
      //     sameSite: 'none',
      //     path: '/',
      //   });
      //   response.cookie('sessionToken', session.sessionToken, {
      //     // maxAge: 3600000*24,
      //     httpOnly: true,
      //     secure: true,
      //     sameSite: 'none',
      //     path: '/',
      //   });
      //   response.cookie('segmentToken', session.segmentToken, {
      //     // maxAge: 3600000*24,
      //     httpOnly: true,
      //     secure: true,
      //     sameSite: 'none',
      //     path: '/',
      //   });
      //   console.log("amber",login)
      //   return login
      // }
      return this.handlepostResponse(login)

    } catch (error) {
      console.log("erroramber",error)
      throw error;
    }
  }

  @post('/test-login')
  async testLogin(
    @requestBody() requestBody: { email: string; password: string },
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<ResponseObject> {
    const { email, password } = requestBody;
    const formDataObject = new FormData();  
      formDataObject.append('scope', "skillnet");
      formDataObject.append('accountName', "skillnet");
      formDataObject.append('user', email);
      formDataObject.append('appStart', "true");  
      formDataObject.append('callbackUrl', "https://skillnet.myvtex.com/api/vtexid/oauth/finish");
      const response1: AxiosResponse<any> = await axios.post(
        'https://skillnet.myvtex.com/api/vtexid/pub/authentication/start',
        formDataObject,
        {
          headers: {
            'accept': '*/*',
          },
        }
      );
      // console.log('response1', response1);
      // console.log('response1', response1.data.authenticationToken);
      response.cookie('_vss', 'response1.data.authenticationToken', {
        maxAge: 3600000, // 1 hour in milliseconds
        httpOnly: true,
        secure: true,
        domain: 'skillnet.myvtex.com',
        sameSite: 'none',
        path: '/',
      });
      const responseObject: ResponseObject = {
        statusCode: 200,
        description: 'Login successful',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string' },
              },
            },
            success: { message: 'Login successful' },
          },
        },
      };
      return responseObject;
    
  }

  //For Creating customer cart:
  @get('/vtex/getCustomerCart/{customerId}')
  @response(200, {
    description: "Create Customer Cart",
  })
  async createCustomerCart(
    @param.header.string('token') token: string,
    @param.query.string('customerId') customerId?: any,
    ):Promise<any>{
    try{
      const data = await this.vtexService.createCustomerCart(customerId,token);
      const response = await data;
      return this.handlegetResponse(response)
    }
    catch(error){
      throw error;
    }
  }

  //For adding items in cart:
  @post('vtex/addItem/{basket_Id}')
  @response(200, {
    description: "Add items in cart using order form id",
  })
  async addItems(
    @requestBody() requestBody:{ customBody: any },
    @param.path.string('basket_Id') basket_Id: string
    ):Promise<any>{
    try{
      console.log(requestBody);
      const data = await this.vtexService.addItems(basket_Id,requestBody);
      const response = await data;
      return this.handlepostResponse(response)
    }
    catch(error){
      console.log(error);
      throw error;
    }
  }

  // For updating Cart details and cart items
  @patch('vtex/updateItem/{basket_id}')
  @response(200,{
    description:"Updating Cart details based on Form Id",
  })
  async updateCartItem(
    @requestBody() requestBody:{orderItems:any},
    @param.path.string('basket_id') basket_id:string):Promise<any>{
    try{
      const data = await this.vtexService.updateCartItem(basket_id,requestBody)
      const response = await data;
      return this.handlepatchResponse(response)
    }
    catch(error){
      console.log(error);
      throw error;
    }
  }

   // For deleting cart item
   @del('vtex/removeItem/{basket_Id}/items/{index_id}')
   @response(200,{
     description:"Updating Cart details based on Form Id",
   })
   async deleteCartItem(
     @param.path.string('basket_Id') basket_Id:string,
     @param.path.string('index_id') index_id:string
     ):Promise<any>{
     try{
       const data = await this.vtexService.deleteCartItem(basket_Id,index_id)
       const response = await data;
       return this.handledeleteResponse(response)
     }
     catch(error){
       console.log(error);
       throw error;
     }
   }

   //For getting Cart Details or Cart Items:
    @get('vtex-get-cart-items/{orderFormId}')
    @response(200, {
      description: "Getting Cart details based on Order Form Id",
    })
    async getCartItems(@param.path.string('orderFormId') orderFormId: string):Promise<any>{
      try{
        const data = await this.vtexService.getCartItems(orderFormId);
        const response = await data;
        return this.handlegetResponse(response)
      }
      catch(error){
        console.log(error);
        throw error;
      }
    }

    @get('/sf-best-selling')
  @response(200, {
    description: 'Get VTEX best selling products from the external API',
  })
  async getSfBestSellingProducts(): Promise<any> {
    try {
      const bestSellingProducts = await this.vtexService.sfBestSelling();
      return bestSellingProducts;
    } catch (error) {
      throw error;
    }
  }
  @get('/sf-pdp/{productId}')
  @response(200, {
    description: 'Get VTEX product details from the external API',
  })
  async salesForceProduct(@param.path.string('productId') productId: string): Promise<any> {
    try {
      const vtexProductDetails = await this.vtexService.salesForceProduct(productId);
      console.log('vtexProductDetails', vtexProductDetails);
      return vtexProductDetails;
    } catch (error) {
      throw error;
    }
  }

  //Search for products with filter:

  @get('vtex-search-by-facets/{category}')

  @response(200, {

    description: "Search for products using facets",

  })

  async searchByFacets(

    @param.path.string('category') category: string,

    @param.query.string('color') color?: any,

    @param.query.string('size') size?: any,

    @param.query.string('minprice') minprice?: any,

    @param.query.string('maxprice') maxprice?: any,

    @param.query.string('sortbyprice') sortbyprice?: any,

    @param.query.string('sortbyname') sortbyname?: any,

    @param.query.string('productsperpage') count?: any,

    @param.query.string('page') page?: any,

    ):Promise<any>{

     

    try{

      const data = await this.vtexService.searchByFacets(category,color,size,minprice,maxprice,sortbyprice,sortbyname,count,page);

      const response = await data;

      return response;

    }

    catch(error){

      console.log(error);

      throw error;

    }

  }

  // Get the user-details or profile
  @get('/user-details/{email}')
  @response(200, {
    description: 'Get VTEX user details from the external API',
  })
  async getUserProfileDetails(@param.path.string('email') email: string): Promise < any > {
    try {
      const userProfile = await this.vtexService.getUserProfileDetails(email);
      console.log(userProfile, "userProfile")
      return this.handlegetResponse(userProfile)
    } catch (error) {
        throw error;
    }
  }

  //Search for product with filter for parent categories:
  @get('vtex-facets-results/{parentCategory}')
  @response(200, {
    description: "Search for parent category products using facets",
  })

  async facetsResults(
    @param.path.string('parentCategory') parentCategory: string,
    @param.query.string('color') color?: any,
    @param.query.string('size') size?: any,
    @param.query.string('minprice') minprice?: any,
    @param.query.string('maxprice') maxprice?: any,
    @param.query.string('sortbyprice') sortbyprice?: any,
    @param.query.string('sortbyname') sortbyname?: any,
    @param.query.string('productsperpage') count?: any,
    @param.query.string('page') page?: any,
    ):Promise<any>{

    try{
      console.log("myparentcat",parentCategory);
      const data = await this.vtexService.facetsResults(parentCategory,color,size,minprice,maxprice,sortbyprice,sortbyname,count,page);
      const response = await data;
      return this.handlegetResponse(response);
    }
    catch(error){
      console.log(error);
      throw error;
    }
  }

  //For Placing Order From An Existing Cart:
  @post('vtex-placeOrder/{basketId}')
  @response(200,{
    description: "Place Order API",
  })
  async placeOrder(
    @param.path.string('basketId') basketId: string,
    @requestBody() requestBody: { body:any },
  ): Promise<any>{
    try{
      const data = await this.vtexService.placeOrder(basketId,requestBody);
      console.log("danishresponseis",data);
      return this.handlepostResponse(data)
    }
    catch(error){
      return error;
    }
  }

  //For Approving The Payment:
  @post('vtex-payment-approve/{transactionId}')
  @response(200,{
    description: 'Approve payment after placeorder api'
  })
  async approvePayment(
    @param.path.string('transactionId') transactionId : string,
    @requestBody() requestBody: { body:[] }
  ): Promise <any>{
    try{
      const data = await this.vtexService.approvePayment(transactionId,requestBody);
      return data;
    }
    catch(error){
      return error;
    }
  }

}
