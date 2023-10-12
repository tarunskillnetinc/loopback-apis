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
  ) {}



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
      return categoryTrees;
    } catch (error) {
      // Handle errors
      throw error;
    }
  }

  @get('/spryker/products-by-category/{categoryId}')
  @response(200,{
    description: 'Get Spryker Product List by search category',
  })
  async getSprykerProductByCategory(@param.path.string('categoryId') categoryId: any): Promise<any>{
    try{
      const getSprykerProducts = await this.sprykerService.getSprykerProductByCategory(categoryId);
      return getSprykerProducts;
    }

    catch(error){
      throw error;
    }

  }

  @get('/spryker/products-by-sub-category/{subCategoryId}')
  @response(200,{
    description: 'Get VTEX Product List by intelegent search',
  })

  async getSprykerProductBySubCategory(@param.path.string('subCategoryId') subCategoryId: any): Promise<any>{
    try{
      const getSprykerProducts = await this.sprykerService.getSprykerProductBySubCategory(subCategoryId);
      return getSprykerProducts;
    }
    catch(error){
      throw error;
    }
  }


  @get('/spryker/products-by-id/{productId}')
  @response(200, {
    description: 'Get Plp details from the external API',
  })
  async getProductDetail(@param.path.string('productId') productId: string): Promise<any> {
    try {
      const productDetails = await this.sprykerService.getSprykerProductDetails(productId);
      return productDetails;
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
      return getSprkerProducts;
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
      return getSprkerProducts;
    }
    catch(error){
      throw error;
    }
  }

  @post('/spryker/login')
  async login(
    @requestBody() requestBody: { username: string; password: string; type:string },
  ): Promise<any> {
    try {
      const { username, password,type } = requestBody;
      const login = await this.sprykerService.login(username, password,type);
      return login
    } catch (error) {
      console.log('error controller', error)
      throw error;
    }
  }


  @get('/spryker/get-cart-id')
    @response(200, {
      description: "Get the current cart.",
    })

    async getCartId( 
      @param.header.string('bearer') bearer: string,
      // @param.query.string('authorization') authorization: string,
      ):Promise<any>{
        try{
       const headers = this.request.headers.bearer;
      console.log('Authorization Header:', headers);
        const data = await this.sprykerService.getCartId(headers);

        const response = data;
        return response;
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
      @requestBody() requestBody: { data:any },
      ):Promise<any>{
        try{
        const header = this.request.headers.bearer;
        const data = await this.sprykerService.creteCart(header,requestBody);
        const response = data;
        return response;
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
      @param.header.string('bearer') bearer: string,
      ): Promise<any> {
      try {
        const header = this.request.headers.bearer;
        const sprykerCartDetail = await this.sprykerService.getSprykerCartDetails(cartId,header);
        return sprykerCartDetail;
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
        return response;
      }
      catch(error){
        console.log(error);
        throw error;
      }
    }

    @post('/spryker/post-add-item-cart/{cartId}')
    @response(200, {
      description: "Add Item in the current cart.",
    })

    async postAddCartItem(
      @param.path.string('cartId') CartId: string,
      @requestBody() requestBody:{data:any},
      @param.header.string('bearer') bearer: string,
      ):Promise<any>{
        try{
          const header = this.request.headers.bearer;
        const data = await this.sprykerService.postAddCartItems(CartId,requestBody,header);
        const response = data;
        return response;
        
      }
      catch(error){
        console.log("error1234",error);
        return error.response.data
        throw error;
      }
    }

@del('/spryker/post-delete-item-cart/{cartId}/{itemId}')
    @response(200, {
      description: "Delete Item in the current cart.",
    })

 async postDeleteCartItem(
      @param.path.string('cartId') CartId: string,
      @param.path.string('itemId') itemId: string,
      @param.header.string('bearer') bearer: string,
      ):Promise<any>{
        try{
          console.log("cartID",CartId)
        console.log("itemID",itemId)
        const header = this.request.headers.bearer;
        const data = await this.sprykerService.postDeleteCartItems(CartId,itemId,header);
        const response = data;
        return response;
      }
      catch(error){
        console.log("error1234",error.response.data);
        return error.response
        throw error;
      }
    }

    @patch('/spryker/post-update-item-cart/{cartId}/{itemId}')
    @response(200, {
      description: "Delete Item in the current cart.",
    })

    async postUpdateCartItem(
      @param.path.string('cartId') CartId: string,
      @param.path.string('itemId') itemId: string,
      @param.header.string('bearer') bearer: string,
      @requestBody() requestBody:{data:any},
      ):Promise<any>{
        try{
          console.log("cartID",CartId)
        console.log("itemID",itemId)
        const header = this.request.headers.bearer;
        const data = await this.sprykerService.postUpdateCartItems(CartId,itemId,header,requestBody);
        const response = data;
        return response;
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
         return sprykerUserDetail;
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
    return response;
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
    return response;
  }
  catch(error){
    console.log("error1234",error);
    return error.response.data
    throw error;
  }
}
    
}