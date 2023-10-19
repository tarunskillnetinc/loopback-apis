import {inject} from '@loopback/core';
import { SprykerService} from '../services';
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
} from '@loopback/rest';




export class SprykerController {
  constructor(
    @inject('services.SprykerService') private sprykerService: SprykerService,
    @inject(RestBindings.Http.REQUEST) private request: Request,
    @inject(RestBindings.Http.RESPONSE) private response: any,
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

  // @get('/get-spryker-category-trees')
  // @response(200, {
  //   description: 'Get category trees from the external API',
  // })
  // async getSprykerCategoryTree(): Promise<any> {
  //   try {
  //     const categoryTrees = await this.sprykerService.getSprykerCategoryTree();
  //     return categoryTrees;
  //   } catch (error) {
  //     // Handle errors
  //     throw error;
  //   }
  // }

  @get('/spryker/category-tree')
  @response(200, {
    description: 'Get category trees from the external API',
  })
  async getSprykerCategoryTree(): Promise<any> {
    try {
      const categoryTrees = await this.sprykerService.getSprykerCategoryTree();
      return this.handlegetResponse(categoryTrees)
    } catch (error) {
      // Handle errors
      throw error;
    }
  }

  @get('/spryker/products-by-category/{categoryId}')
  @response(200,{
    description: 'Get Spryker Product List by search category',
  })
  async getSprykerProductByCategory(
    @param.path.string('categoryId') categoryId: any,
    @param.query.string('productsPerPage') count?: any,
    @param.query.string('page') page?: any,
    ): Promise<any>{
    try{
      const getSprykerProducts = await this.sprykerService.getSprykerProductByCategory(categoryId,count,page);
      return this.handlegetResponse(getSprykerProducts)
    }

    catch(error){
      throw error;
    }

  }
  @get('/spryker/products-by-label/{labelId}')
  @response(200,{
    description: 'Get Spryker Product List by search category',
  })
  async getSprykerProductByLabels(@param.path.string('labelId') labelId: any): Promise<any>{
    try{
      const getSprykerProducts = await this.sprykerService.getSprykerProductByLabels(labelId);
      return this.handlegetResponse(getSprykerProducts)
    }

    catch(error){
      throw error;
    }

  }

  @get('/spryker/new-arrivals')
  @response(200,{
    description: 'Get Spryker Product List by search category',
  })
  async getSprykerNewArrivalProducts(): Promise<any>{
    try{
      const getSprykerProducts = await this.sprykerService.getSprykerNewArrivalProducts();
      return this.handlegetResponse(getSprykerProducts)
    }

    catch(error){
      throw error;
    }

  }

  @get('/spryker/best-selling-products')
  @response(200,{
    description: 'Get Spryker Product List by search category',
  })
  async getSprykerSellingProducts(): Promise<any>{
    try{
      const getSprykerProducts = await this.sprykerService.getSprykerSellingProducts();
      return this.handlegetResponse(getSprykerProducts)
      
    }

    catch(error){
      throw error;
    }

  }
  @get('/spryker/products-by-sub-category/{subCategoryId}')
  @response(200,{
    description: 'Get VTEX Product List by intelegent search',
  })

  async getSprykerProductBySubCategory(
    @param.path.string('subCategoryId') subCategoryId: any,
    @param.query.string('productsPerPage') count?: any,
    @param.query.string('page') page?: any,
    ): Promise<any>{
    try{
      const getSprykerProducts = await this.sprykerService.getSprykerProductBySubCategory(subCategoryId,count,page);
      return this.handlegetResponse(getSprykerProducts)
    }
    catch(error){
      throw error;
    }
  }


  @get('/spryker/product-by-id/{productId}')
  @response(200, {
    description: 'Get Plp details from the external API',
  })
  async getProductDetail(@param.path.string('productId') productId: string): Promise<any> {
    try {
      const productDetails = await this.sprykerService.getSprykerProductDetails(productId);
      return this.handlegetResponse(productDetails)
    } catch (error) {
      // Handle errors
      throw error;
    }
  }



  @get('/spryker/products-by-query/{query}')
  @response(200,{
    description: 'Get Spryker Product List by search query',
  })

  async getSprykerProductByQuery(@param.path.string('query') query: any): Promise<any>{
    try{
      const getSprkerProducts = await this.sprykerService.getSprykerProductByQuery(query);
      return this.handlegetResponse(getSprkerProducts)

    }
    catch(error){
      throw error;
    }
  }

  @get('/spryker/all-products')
  @response(200,{
    description: 'Get Spryker Product List by search query',
  })

  async getAllSprykerProducts(
    @param.query.string('color') color?: any,
    @param.query.string('minprice') minprice?: any,
    @param.query.string('maxprice') maxprice?: any,
    @param.query.string('sort') sort?: any,
    @param.query.string('page') page?: any,
    @param.query.string('productsPerPage') count?: any,
  ): Promise<any>{
    try{
      const getSprkerProducts = await this.sprykerService.getAllSprykerProducts(color,minprice,maxprice,sort,count,page);
      return this.handlegetResponse(getSprkerProducts)
    }
    catch(error){
      throw error;
    }
  }

  @post('/spryker/login')
  async login(
    @requestBody() requestBody: { email: string; password: string; },
  ): Promise<any> {
    try {
      const { email, password } = requestBody;
      const login = await this.sprykerService.login(email==undefined?"":email, password==undefined?"":password);
      return this.handlepostResponse(login)
    } catch (error) {
      console.log('error controller', error)
      throw error;
    }
  }


  @get('/spryker/getCustomerCart/{customerId}')
    @response(200, {
      description: "Get the current cart.",
    })

    async getCartId( 
      @param.header.string('bearer') bearer: string,
      @param.query.string('customerId') customerId: any,
      // @param.query.string('authorization') authorization: string,
      ):Promise<any>{
        try{
       const headers = this.request.headers.bearer;
      console.log('Authorization Header:', headers);
        const data = await this.sprykerService.getCartId(headers);
        console.log("response12356",data)

        const response = data;
        return this.handlepostResponse(response)
      }
      catch(error){
        console.log(error);
        throw error;
        
      }
    }

    @post('/spryker/createCart')
    @response(200, {
      description: "Get the current cart.",
    })

    async createCart( 
      @param.header.string('bearer') bearer: string,
      // @requestBody() requestBody: { data:any }
      ):Promise<any>{
        try{
          const header = this.request.headers.token;
          var requestBody = {
            "data": {
              "type": "carts",
              "attributes": {
                "priceMode": "NET_MODE",
                "currency": "USD",
                "store": "US",
                "name": "aafreen Cart"
              }
            }
          }
        const data = await this.sprykerService.creteCart(header,requestBody);
        const response = data;
        return this.handlepostResponse(response)
      }
      catch(error){
        console.log(error);
        throw error;
      }
    }

    @get('/spryker/cartDetail/{cartId}')
    @response(200, {
      description: 'Get VTEX cart details from the external API',
    })

    async getSprykerCartData(
      @param.path.string('cartId') cartId: any,
      @param.header.string('token') token: string,
      ): Promise<any> {
      try {
        const header = this.request.headers.token;
        const sprykerCartDetail = await this.sprykerService.getSprykerCartDetails(cartId,header);
        return this.handlegetResponse(sprykerCartDetail)
      } catch (error) {
        throw error;
      }
    }

    @del('spryker/delete-cart/{cartId}')
    @response(200,{
      description:"Updating Cart details based on Form Id",
    })
    async deleteCart(
      @param.path.string('cartId') cartId: any,
      @param.header.string('bearer') bearer: string,
      ):Promise<any>{
      try{
        const header = this.request.headers.bearer;
        const data = await this.sprykerService.deleteCart(cartId,header)
        const response = await data;
        return this.handledeleteResponse(response)
      }
      catch(error){
        console.log(error);
        throw error;
      }
    }

    @post('/spryker/addItem/{basket_id}')
    @response(200, {
      description: "Add Item in the current cart.",
    })

    async postAddCartItem(
      @param.path.string('basket_id') basket_id: string,
      @requestBody() requestBody:{data:any},
      @param.header.string('token') token: string,
      ):Promise<any>{
        try{
          const header = this.request.headers.token;
        const data = await this.sprykerService.postAddCartItems(basket_id,requestBody,header);
        const response = data;
        return this.handlepostResponse(response)    
      }
      catch(error){
        console.log("error1234",error);
        return error.response.data
        throw error;
      }
    }

@del('/spryker/removeItem/{basket_Id}/items/{item_Id}')
    @response(200, {
      description: "Delete Item in the current cart.",
    })

 async postDeleteCartItem(
      @param.path.string('basket_id') basket_id: string,
      @param.path.string('itemId') itemId: string,
      @param.header.string('token') token: string,
      ):Promise<any>{
        try{
          console.log("cartID",basket_id)
        console.log("itemID",itemId)
        const header = this.request.headers.token;
        const data = await this.sprykerService.postDeleteCartItems(basket_id,itemId,header);
        const response = data;
        return this.handledeleteResponse(response)
      }
      catch(error){
        console.log("error1234",error.response.data);
        return error.response
        throw error;
      }
    }

    @patch('/spryker/updateItem/{basket_id}')
    @response(200, {
      description: "Delete Item in the current cart.",
    })

    async postUpdateCartItem(
      @param.path.string('basket_id') basket_id: string,
      // @param.path.string('itemId') itemId: string,
      @param.header.string('token') token: string,
      @requestBody() requestBody:{data:any},
      ):Promise<any>{
        try{
          console.log("cartID",basket_id)
        const header = this.request.headers.token;
        const data = await this.sprykerService.postUpdateCartItems(basket_id,requestBody,header);
        const response = data;
        return this.handlepatchResponse(response)
      }
      catch(error){
        console.log("error1234",error.response.data);
        return error.response
        throw error;
      }
     }
     @get('/spryker/usersDetail/customers/{customerId}/addresses')
     @response(200, {
       description: 'Get VTEX user details from the external API',
     })
     async getSprykerUsersData(
       @param.path.string('customerId') customerId: any,
       @param.header.string('bearer') bearer: string,
       ): Promise<any> {
       try {
         const header = this.request.headers.bearer;
         console.log("header",header)
         const sprykerUserDetail = await this.sprykerService.getSprykerUsersData(customerId,header);
         console.log("sprykerUserDetail",sprykerUserDetail)
         return this.handlegetResponse(sprykerUserDetail)
       } catch (error) {
         throw error;
       }
     }


     
@post('/spryker/post-checkout-data')
@response(200, {
  description: "For checkout data.",
})
async postCheckoutData( 
  @requestBody() requestBody:{data:any},
  @param.header.string('bearer') bearer: string,

  ):Promise<any>{
    try{
    const header = this.request.headers.bearer;
    const data = await this.sprykerService.postCheckoutData(requestBody,header);
    const response = data;
    return this.handlepostResponse(response)
  }
  catch(error){
    console.log("error1234",error);
    return error.response.data
    throw error;
  }
} 

@post('/spryker/post-checkout-order')
@response(200, {
  description: "For checkout order.",
})
async postCheckoutOrder( 
  @requestBody() requestBody:{data:any},
  @param.header.string('bearer') bearer: string,

  ):Promise<any>{
    try{
    const header = this.request.headers.bearer;
    const data = await this.sprykerService.postCheckoutorder(requestBody,header);
    const response = data;
    return this.handlepostResponse(response)
  }
  catch(error){
    console.log("error1234",error);
    return error.response.data
    throw error;
  }
}   
}