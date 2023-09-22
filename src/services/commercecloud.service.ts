import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import axios from 'axios';
import {CommercecloudDataSource} from '../datasources';


export class CommercecloudService {
  constructor(
    // commercecloud must match the name property in the datasource json file
    @inject('datasources.commercecloud')
    protected dataSource: CommercecloudDataSource 
  ) {}

  async fetchFromEndpoint(endpoint: string): Promise<any> {
    try {
      const response = await axios.get(`${this.dataSource.settings.baseURL}/${endpoint}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async getSalesforceProductByCategory(refine: any): Promise<any>{
    
    const endpoint = `/s/Ref-VinodCSQT/dw/shop/v23_2/product_search?refine=cgid=${refine}&expand=images,prices&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
    console.log(endpoint);
    const response = await this.fetchFromEndpoint(endpoint);
    const data =  response;
    console.log('data',data);

    return response;
    // return response;
  }
  
}
