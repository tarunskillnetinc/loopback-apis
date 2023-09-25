import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import axios from 'axios';
import {SprykerDataSource} from '../datasources';
import {SprykerController} from '../controllers';
import FormData = require('form-data');
import { promises } from 'dns';


export class SprykerService  {
  constructor(
    // spryker must match the name property in the datasource json file
    @inject('datasources.spryker')
    protected dataSource: SprykerDataSource 
  ) {}

  async fetchFromEndpoint(endpoint: string): Promise<any> {
    try {
      const response = await axios.get(`${this.dataSource.settings.baseURL}/${endpoint}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getSprykerCategoryTree(): Promise<any> {
    const response = await this.fetchFromEndpoint('category-trees');
    const categoryTree = response.data[0];
    const data = response.data;
    const categoryNode = categoryTree.attributes.categoryNodesStorage;
    const myArray = [];
    const categoryTreemap: any = [];
    for (const categoryNode of categoryTree.attributes.categoryNodesStorage) {
      if (categoryNode.children.length > 0) {
        for (const childNode of categoryNode.children) {
          myArray.push(childNode);
        }
      }
    }
            await Promise.all( categoryTree.attributes.categoryNodesStorage?.map(async(item: any) => {
              console.log(item.nodeId);
      const endpoint = `catalog-search?category=${item.nodeId}&include=Concrete-products`;
      const responseData = await this.fetchFromEndpoint(endpoint);
      // console.log("response", responseData);
      await categoryTreemap.push({
        id: item.nodeId,
        title: item.name,
        data: await this.functionSprykerCategoryTreeLoopbackForData(responseData),
      });
    }));
  
    // console.log('transformCategoryTree', categoryTreemap);
    return categoryTreemap;
  }

  async functionSprykerCategoryTreeLoopbackForData(responseData:any){
    var data = responseData.data;
    console.log('aaf',responseData);
    var dataArr:any = [];

   await data[0]?.attributes?.abstractProducts?.map(async(responseitem:any,index:any)=>{
    console.log('ashu' , responseitem);
    const FinalData = await {
      attributes:{
        "sku": responseitem?.abstractSku,
        "Name": responseitem?.abstractName,
        "Price": responseitem?.price,
        "product_image":responseitem?.images[0].externalUrlLarge,
        
      //   "discontinuedNote": null,
      //   "averageRating": null,
      //   "reviewCount": 0,
      //   "productAbstractSku": "232",
      //   "name": responseitem?.productName,
      //   "description": responseitem?.description,
        "product_price": {
          "grossAmount": responseitem?.prices[0].grossAmount,
          "DEFAULT": responseitem?.prices[0].DEFAULT,
        },
      //   "superAttributesDefinition": [
          
      //   ],
      //   "metaTitle": null,
      //   "metaKeywords": null,
      //   "metaDescription": null,
        // "attributeNames": [
          
        // ],
      //   "productConfigurationInstance": null,
      //   "abstractSku": "232",
      //   "url":responseitem?.link,
      //   "price": responseitem.priceRange.sellingPrice.highPrice,
      //   "abstractName": responseitem?.productName,
      //   "prices": responseitem?.priceRange,
      //   "images": responseitem?.images
      },
    }

    await dataArr.push(FinalData);
      
    })
    return dataArr;
  }

  async getSprykerProductByCategory(categoryId: any): Promise<any>{
    
    const endpoint = `catalog-search?category=${categoryId}&include=Concrete-products`;
    const response = await this.fetchFromEndpoint(endpoint);
    const data =  response.data[0];
    const value = response.data[0].attributes.valueFacets;
    console.log('data',data)
    const product_arr:any[] = [];
    const valueFacets =
    this.getvalueFacets(value);
    await Promise.all(
      data?.attributes?.abstractProducts?.map((items:any)=>{
        product_arr.push({
        product_id:items?.abstractSku,
        sku_id:items?.abstractSku,
        product_name:items?.abstractName,
        product_image:items?.images[0].externalUrlLarge,
        product_price: {
          "grossAmount": items?.prices[0].grossAmount,
          "DEFAULT": items?.prices[0].DEFAULT,
        },
        product_category:categoryId,
        })
      })
    )

    return {"ProductData":product_arr,
            "valueFacets": valueFacets};
    // return response;
  }

  
  // newonw
  async getSprykerProductDetails(abstractId: string): Promise<any> {
    const product_arr: any[] = [];
    const endpoint = `abstract-products/${abstractId}?include=abstract-product-image-sets%2Cabstract-product-prices%2Cconcrete-product-availabilities%2Cproduct-labels%2Cproduct-options%2Cproduct-reviews%2Cproduct-measurement-units%2Csales-units%2Cbundled-products%2Cproduct-offers`;
    // return this.fetchFromEndpoint(endpoint);
    const response = await this.fetchFromEndpoint(endpoint);
    console.log("abstract",response)
    await Promise.all(
      response.data.attributes.attributeMap.product_concrete_ids?.map(
        async (item: any) => {
          var id = item;
          const newendpoint = `concrete-products/${id}?include=concrete-product-image-sets%2Cconcrete-product-prices%2Cconcrete-product-availabilities%2Cproduct-labels%2Cproduct-options%2Cproduct-reviews%2Cproduct-measurement-units%2cproduct-offer-prices`;
          const concreteresponse = await this.fetchFromEndpoint(newendpoint);
          product_arr.push(concreteresponse);
        }
      )
    );
    const finalresponse = product_arr;
    // console.log("finalresponse",finalresponse)
    const transformedResponse =
      this.sprykertransformProductDetailPage(finalresponse);
    // return finalresponse
    return {
    "productId":response.data.id,
    "name":response.data.attributes.name,
    "available":" ",
    "description":response.data.attributes.description,
    "skus": transformedResponse
  };
    // return response;
  }


  private sprykertransformProductDetailPage(response: any): any {
    var price: any[] = [];
    var availability: any[] = [];
    var images: any[] = [];
    response.map((item: any) => {
      item?.included?.map(async (item: any) => {
        if (item?.type === "concrete-product-prices") {
          price.push(item);
        } else if (item?.type == "concrete-product-availabilities") {
          availability.push(item);
        } else if (item?.type == "concrete-product-image-sets") {
          images.push(item);
        }
      });
    });
    const dataresponse: any[] = [];
    const skuresponse: any[] = [];
    response.map(async (item: any, index: any) => {
      if (
        item.data.id === price[index].id &&
        item.data.id === availability[index].id &&
        item.data.id === images[index].id
      ) {
        dataresponse.push({
          ...item?.data,
          price: price[index],
          image: images[index],
          availability: availability[index],
        });
      }
    });

    console.log("dataresponse12345567", dataresponse);
    dataresponse.map(async (item: any) => {
      skuresponse.push({
        sku: item?.attributes?.sku,
        skuname: item?.attributes?.name,
        dimensions: " ",
        available: item?.availability?.attributes?.availability,
        availablequantity: item?.availability?.attributes?.quantity,
        listPriceFormated: "$0.00",
        listPrice: item.price.length,
        bestPriceFormated: item?.price?.attributes?.prices[0].currency.symbol+ item?.price?.attributes?.price,
        disocountPercent: 23,
        bestPrice: item?.price?.attributes?.price,
        spotPrice: 2684,
        images: {
          image1:
            // "https://skillnet.vteximg.com.br/arquivos/ids/156198-292-292/x8u1i946.png?v=638294985271830000",
            item?.image?.attributes?.imageSets[0]?.images[0]?.externalUrlSmall,
        },
        measures: " ",
        unitMultiplier: " ",
      });
    });
    return  skuresponse ;
  }

  async getSprykerProductBySubCategory(subCategoryId: any): Promise<any>{
    
    const endpoint = `catalog-search?${subCategoryId}&include=Concrete-products`;
    const response = await this.fetchFromEndpoint(endpoint);
    const data =  response.data[0];
    console.log('data',data)
    const product_arr:any[] = [];
    await Promise.all(
      data?.attributes?.abstractProducts?.map((items:any)=>{
        product_arr.push({
          sku_id:items?.abstractSku,
         product_name:items?.abstractName,
        product_image:items?.images[0].externalUrlLarge,
        product_price: {
          "grossAmount": items?.prices[0].grossAmount,
          "DEFAULT": items?.prices[0].DEFAULT,
        },
        product_category:subCategoryId,

        })

      })

    )

    return product_arr;
    // return response;
  }


  async getSprykerProductByQuery(query: any): Promise<any>{
    const endpoint = `catalog-search-suggestions?q=${query}`;
    const response =  await this.fetchFromEndpoint(endpoint);
    const data = response.data;
    const modifyData = data[0]?.attributes?.abstractProducts?.map((item: any) => {
      return {
        
        sku_id: item.abstractSku,
        ProductName: item.abstractName,
        product_price: item.price,
        url: item.url,
        product_image: item.images[0]?.externalUrlLarge || null,
      };
    }) || [];
  
    return modifyData;
  }

  async login(username: string, password: string, type: string): Promise<any>{ 
    try{
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('grant_type',type );
    // formData.append('client_id',"" );
    console.log(' form datA' , formData)
    const response =  await axios.post('http://103.113.36.20:9003/token',
    formData,
    {
      headers: {
        "Content-Type":"application/x-www-form-urlencoded",
      },
    }
    );
    const token = response.data.access_token;
    console.log(' respnser  datA' , response)
    return token;
  }
  catch (error) {
    console.log('err' ,error);
    throw error;
  }
    
  }


  async getCartId(authorizationHeader: any): Promise<any> {
    console.log('afren',authorizationHeader);
    const endpoint = `/carts`;
    const response = this.cartFetchFromEndpoint(endpoint,authorizationHeader);
    const data = await response;
    return data;
  }

  async getSprykerCartDetails(cartId: any,authorizationHeader:any): Promise<any> {
    const endpoint = `/carts/${cartId}`;
    return this.cartFetchFromEndpoint(endpoint,authorizationHeader);
  }

  async creteCart(authorizationHeader:any,data:any): Promise<any> {
    try {
      const formData = new FormData();
    // formData.append('data', data);
      const response = await axios.post(
        `http://103.113.36.20:9003/carts`,
      data,
        {
          headers: {
            'Authorization':`Bearer ${authorizationHeader}`,
          },
        },
      );
      console.log(response);
      return response.data;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  async cartFetchFromEndpoint(endpoint: string, authorization:string): Promise<any> {
    try {
      console.log(endpoint);
      const response = await axios.get(
        `http://103.113.36.20:9003${endpoint}`,
        {
          headers: {
            'Authorization':`Bearer ${authorization}`,
          },
        },
      ); 
      console.log('afreeee',response.data);
      return response.data;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  async deleteCart(cartId: string, authorization:any): Promise<any> {
    try {
      const response = await axios.delete(
        `http://103.113.36.20:9003/carts/${cartId}`,
        {
          headers: {
            'Authorization':`Bearer ${authorization}`,
          },
        },
      ); 
      console.log('aaffff',response.data);
      console.log('deleted');
      return response.data;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  async postAddCartItems(cartId: any, reqBody: any, authorization:any): Promise<any> {
    console.log('afren', reqBody);
    const endpoint = `carts/${cartId}/items`;
    const response = this.postCartFetchFromEndpoint(endpoint, reqBody,authorization);
    const data = await response;
    return data;
  }

  async postDeleteCartItems(
    cartId: any,
    itemId: any,
    reqBody: any,
  ): Promise<any> {
    console.log('afren', reqBody);
    const endpoint = `carts/${cartId}/items/${itemId}`;
    const response = this.cartDeleteFetchFromEndpoint(endpoint, reqBody);
    const data = await response;
    return data;
  }

  async postUpdateCartItems(cartId: any,itemId:any, reqBody: any, authorization:any): Promise<any> {
    console.log('afren', reqBody);
    const endpoint = `carts/${cartId}/items/${itemId}`;
    const response = this.patchCartFetchFromEndpoint(endpoint,reqBody,authorization);
    const data = await response;
    return data;
  }

  async postCartFetchFromEndpoint(
    endpoint: string,
    reqBody: string,
    authorization:any,
  ): Promise<any> {
    try {
      console.log("url123",`http://103.113.36.20:9003/${endpoint}`)
      const response = await axios.post(
        `http://103.113.36.20:9003/${endpoint}`,
        reqBody,
        {
          headers: {
            Authorization: `Bearer ${authorization}`
          },
        },
      );

      console.log('postcartresponse', response);
      return response.data;
    } catch (error) {
      console.log('error', error);
      throw error;
    }

  }

  async cartDeleteFetchFromEndpoint(
    endpoint: string,
    authorization: string,
  ): Promise<any> {

    try {
      console.log("url123",`http://103.113.36.20:9003/${endpoint}`)
      const response = await axios.delete(
        `http://103.113.36.20:9003/${endpoint}`,
        {
          headers: {
            Authorization:
              `Bearer ${authorization} `,
          },
        },
      );
      console.log('postcartresponse', response);
      return response.statusText;

    } catch (error) {

      console.log('error', error);
      throw error;
    }
  }
  
  async patchCartFetchFromEndpoint(
    endpoint: string,
    reqBody: any,
    authorization:any,
  ): Promise<any> {
    try {
      console.log("url123",`http://103.113.36.20:9003/${endpoint}`)
      const response = await axios.patch(
        `http://103.113.36.20:9003/${endpoint}`,
        reqBody,
        {
          headers: {
            Authorization: `Bearer ${authorization}`
          },
        },
      );

      console.log('postcartresponse', response);
      return response.data;
    } catch (error) {
      console.log('error', error);
      throw error;
    }

  }
  

  private getvalueFacets(response: any): any {
    const value_arr:any[] = [];
  console.log("aafreeee",response);
    response?.map((item: any) => {
      value_arr.push({
         name: item.name,
         value: item.values.map((valueObj:any) => {
          // Create a new object without the "doc_count" property
          const { doc_count, ...newValueObj } = valueObj;
          return newValueObj;
        }),
    });
  });
  return value_arr;

} 
}
