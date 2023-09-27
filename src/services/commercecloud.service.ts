import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import axios from 'axios';
import {CommercecloudDataSource} from '../datasources';
import currencySymbol from "currency-symbol-map";

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
    const product_arr:any[] = [];
    const endpoint = `/s/Ref-VinodCSQT/dw/shop/v23_2/product_search?refine=cgid=${refine}&expand=images,prices&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
    const response = await this.fetchFromEndpoint(endpoint);
    const value = response.refinements;
    console.log(value);
    const valueFacets = this.getRefinementValue(value)
    const data =  response;
    response?.hits?.map((items:any) =>{
      product_arr.push({
        product_id:items?.product_id,
        sku_id:items?.product_id,
        product_name:items?.product_name,
        product_image:items?.image.dis_base_link,
        product_price: {
          listPrice:items?.price,
          sellingPrice:null,
          discount:null,
        }
      })
    })
    console.log('data',product_arr);

    // return product_arr;
    return {"ProductData":product_arr,
            "valueFacets": valueFacets};
  }

  private getRefinementValue(response: any): any {
    const value_arr:any[] = [];
  console.log("aafreeee",response);     
    response?.map((item: any) => {
      value_arr.push({
         name: item.label,
         value: item.values.map((valueObj:any) => {
          // Create a new object without the "doc_count" property
          // const { doc_count, ...newValueObj } = valueObj;
         const newValueObj =valueObj.label;
          return newValueObj;
        }),
    });
  });
  return value_arr;

} 

async getsalesForceProductById(pid: any): Promise<any> {
  const endpoint = `/s/Ref-VinodCSQT/dw/shop/v23_2/products/${pid}?null=null&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b&expand=images%2Cprices%2Cavailability%2Cvariations%2Cpromotions%2Cset_products`;
  const response = await this.fetchFromEndpoint(endpoint);
  const data = await response; // Parse JSON response
  const variantProductsData = await this.getVariationData(data?.variants);
  return {
    productId: data?.id,
    name: data?.name,
    available: data?.inventory?.orderable,
    description: data?.long_description,
    skus: variantProductsData,
  };

  // return data;
}
private async getVariationData(response: any): Promise<any[]> {
  const skuData: any = [];

  await Promise.all(
    response?.map(async (variantProducts: any) => {
      const endpoint = `/s/Ref-VinodCSQT/dw/shop/v23_2/products/${variantProducts?.product_id}?null=null&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b&expand=images%2Cprices%2Cavailability%2Cvariations%2Cpromotions%2Cset_products`;
      const response = await this.fetchFromEndpoint(endpoint);
      skuData.push({
        sku: response?.id,
        skuname: response?.name,
        dimensions: " ",
        available: response?.inventory?.orderable,
        availablequantity: response?.inventory?.ats,
        listPriceFormated:
          currencySymbol(response?.currency) + response?.price,
        listPrice: response?.price,
        bestPriceFormated:
          currencySymbol(response?.currency) + response?.price_per_unit,
        discountPercent: "",
        bestPrice: response?.price_per_unit,
        spotPrice: "",
        images: {
          image1: response?.image_groups[0]?.images[0]?.link,
        },
      });
    })

  );
  return skuData;
}
  
}
