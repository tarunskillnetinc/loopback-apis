import {inject} from '@loopback/core';
import { CommercecloudService} from '../services';
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


export class CommercecloudController {
  constructor(
    @inject('services.CommercecloudService') private sprykerService: CommercecloudService,
    @inject(RestBindings.Http.REQUEST) private request: Request,
  ) {}

  @get('/demo-salesforce-plp-by-category/{refine}')
  @response(200,{
    description: 'Get Salesforce Product List by search category',
  })
  async getSalesforceProductByCategory(
    @param.path.string('refine') refine: any,
    ): Promise<any>{
    try{
      console.log('aaff');
      const getSalesForceProducts = await this.sprykerService.getSalesforceProductByCategory(refine);
      console.log('aashh');
      return getSalesForceProducts;
    }

    catch(error){
      throw error;
    }

  }

  @get('/salesforce-pdp/{productId}')
  @response(200, {
    description: 'Get Salesforce product details from the external API',
  })
  async salesForceProduct(@param.path.string('productId') productId: string): Promise<any> {
    try {
      const salesforceProductDetails = await this.sprykerService.getsalesForceProductById(productId);
      console.log('salesforceProductDetails', salesforceProductDetails);
      return salesforceProductDetails;
    } catch (error) {
      throw error;
    }
  }
  @get('/salesforce-category-tree')
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

  @post('/cloudcommerce-add-items/{cartId}')
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

}
