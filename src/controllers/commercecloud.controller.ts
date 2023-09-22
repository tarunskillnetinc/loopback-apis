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

}
