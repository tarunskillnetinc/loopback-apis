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
} from '@loopback/rest';




export class SprykerController {
  constructor(
    @inject('services.SprykerService') private sprykerService: SprykerService,
    @inject(RestBindings.Http.REQUEST) private request: Request,
  ) {}



  @get('/get-spryker-category-trees')
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

  @get('/demo-spryker-plp-by-category/{categoryId}')
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

  @get('/demo-spryker-plp-by-subcategory/{subCategoryId}')
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


  @get('/demo-spryker-plp-by-query/{query}')
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

  @post('/demo-spryker-login')
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


  @get('/demo-spryker-get-cart-id')
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


    @post('/demo-spryker-create-cart')
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

    @get('/demo-spryker-cartDetail/{cartId}')
    @response(200, {
      description: 'Get VTEX cart details from the external API',
    })

    async getVtexCartData(
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

    @del('spryker-delete-cart-items/{cartId}')
    @response(200,{
      description:"Updating Cart details based on Form Id",
    })
    async deleteCartItem(
      @param.path.string('cartId') cartId: any,
      @param.header.string('bearer') bearer: string,
      ):Promise<any>{
      try{
        const header = this.request.headers.bearer;
        const data = await this.sprykerService.deleteCartItem(cartId,header)
        const response = await data;
        return response;
      }
      catch(error){
        console.log(error);
        throw error;
      }
    }

}