import {injectable, inject} from '@loopback/core';
import axios, { AxiosResponse } from 'axios';
import {VtexDataSource} from '../datasources';
import FormData = require('form-data');
import {response} from '@loopback/rest';
import { CountSchema } from '@loopback/repository';
require('dotenv').config();
const vtexAppToken=process.env.VTEX_APP_TOKEN
const vtexAppKey=process.env.VTEX_APP_KEY
@injectable()
export class VtexService {
  constructor(
    @inject('datasources.vtex') protected dataSource: VtexDataSource,
  ) {}

  async fetchFromEndpoint(endpoint: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.dataSource.settings.baseURL}/${endpoint}`,
        {
          headers: {
            Accept: 'application/json',
            'X-VTEX-API-AppToken':
            vtexAppToken,
            'X-VTEX-API-AppKey': vtexAppKey,
          },
        },
      );
      return response.data;
    } catch (error) {
        return this.handleErrorResponse(error);
    }
  }

  //For handling Errors:
  handleErrorResponse(error: any): any {
    return {
      "status": error?.response.status,
      "statusText": error?.response?.statusText,
      "message": error?.response?.data
    };
  }

  //for cartapi
  async cartFetchFromEndpoint(endpoint: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://hometest--skillnet.myvtex.com/${endpoint}`,
        {
          headers: {
            Accept: 'application/json',
            'X-VTEX-API-AppToken':
            vtexAppToken,
            'X-VTEX-API-AppKey': vtexAppKey,
          },
        },
      );
      return response.data;
    } catch (error) {
        return this.handleErrorResponse(error);
    }
  }
  async fetchSfFromEndpoint(endpoint: string): Promise<any> {
    try {
      const response = await axios.get(`https://zzkd-004.dx.commercecloud.salesforce.com/s/RefArch/dw/${endpoint}`, {
        headers: {
          Accept: '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Cookie': 'BrowserId=cZTU7kWFEe6BcxsRNxYQ0g'
          },
        });
    return response.data;
    } catch (error) {
      return this.handleErrorResponse(error);
    }
  }
  async vtexCategoryTreeLoopbackFetchFromEndpoint(
    endpoint: string,
  ): Promise<any> {
    try {
      const response = await axios.get(`${endpoint}`, { timeout: 100000, 
        headers: {
          Accept: 'application/json',
          'X-VTEX-API-AppToken':
            vtexAppToken,
            'X-VTEX-API-AppKey': vtexAppKey,
        },
      });
      return response.data;
    } catch (error) {
        return this.handleErrorResponse(error);
    }
  }
  async getVtexCategoryTree(): Promise<any> {
    const endpoint = 'api/catalog_system/pub/category/tree/2';
    const response = await this.fetchFromEndpoint(endpoint);
    const transformCategoryTree = this.vtextransformCategoryTree(response);
    return transformCategoryTree;
  }

  // async getVtexCategoryTreeloopback(): Promise<any> {
  //   const endpoint = 'api/catalog_system/pub/category/tree/2';
  //   const response = await this.fetchFromEndpoint(endpoint);
  //   const categoryTreemap: any = [];
  //   // const result=this.vtextransformCategoryTree1(response)
  //   const transformCategoryTree =this.vtextransformCategoryTreeloopback(response);
  //   Promise.all(response?.map(async (item: any, index: any) => {
  //     const endpoint = `https://skillnet.vtexcommercestable.com.br/api/io/_v/api/intelligent-search/product_search/category-1/${item.name}`;
  //     const response = await this.vtexCategoryTreeLoopbackFetchFromEndpoint(endpoint)
  //     console.log("response",response)
  //     categoryTreemap.push({
  //       id: item.id,
  //       title: item.name,
  //       data: response.products,
  //     });  
  //   }));
  //   console.log('transformCategoryTree', categoryTreemap);
  //   return categoryTreemap;
  // }
  async getVtexCategoryTreeloopback(): Promise<any> {
    const endpoint = 'api/catalog_system/pub/category/tree/2';
    const response = await this.fetchFromEndpoint(endpoint);
    const categoryTreemap: any = [];
    
    await Promise.all(response?.map(async (item: any, index: any) => {
      const endpoint = `https://skillnet.vtexcommercestable.com.br/api/io/_v/api/intelligent-search/product_search/category-1/${item.name}`;
      const responseData = await this.vtexCategoryTreeLoopbackFetchFromEndpoint(endpoint);
      await categoryTreemap.push({
        id: item.id,
        title: item.name,
        data: await this.functionVtexCategoryTreeLoopbackForData(responseData),
      });
    }));
    return categoryTreemap;
  }
  async functionVtexCategoryTreeLoopbackForData(responseData:any){
    const dataArr:any = [];
   await responseData?.products.map(async(responseitem:any,index:any)=>{
    const Ddatavar = await {
      attributes:{
        "sku": responseitem?.productId,
        "isDiscontinued": false,
        "discontinuedNote": null,
        "averageRating": null,
        "reviewCount": 0,
        "productAbstractSku": "232",
        "name": responseitem?.productName,
        "description": responseitem?.description,
        "attributes": [
          
        ],
        "superAttributesDefinition": [
          
        ],
        "metaTitle": null,
        "metaKeywords": null,
        "metaDescription": null,
        "attributeNames": [
          
        ],
        "productConfigurationInstance": null,
        "abstractSku": "232",
        "url":responseitem?.link,
        "price": responseitem.priceRange.sellingPrice.highPrice,
        "abstractName": responseitem?.productName,
        "prices": responseitem?.priceRange,
        "images": responseitem?.images
      },
    }

    await dataArr.push(Ddatavar);
      
    })
    return dataArr;
  }
  
  // private vtextransformCategoryTree1(response: any): any {

  //   console.log("response1234",response)

  //   const categoryTreemap: any = [];

  //   response?.map(async (item: any, index: any) => {

  //     // item.children.map(async (childitem: any) => {

  //     //   categoryChildren.push({

  //     //     Id: childitem.id,

  //     //     name: childitem.name,

  //     //     hasChildren: childitem.hasChildren,

  //     //     url: childitem.url,

  //     //   });

  //     // });
  //     const endpoint = `https://skillnet.vtexcommercestable.com.br/api/io/_v/api/intelligent-search/product_search/category-1/${item.name}`;
  //     const response = await this.vtexCategoryTreeLoopbackFetchFromEndpoint(endpoint)
  //     // console.log("response",response)

  //     categoryTreemap.push({

  //       parent_Id: item.id,

  //       name: item.name,
  //       data: response.products,

  //       hasChildren: item.hasChildren,

  //       url: item.url

  //     });

  //   });

  //   return categoryTreemap;

  // }
  async getVtexCollection(collectionId: string): Promise<any> {
    const endpoint = `api/catalog/pvt/collection/${collectionId}/products`;
    var endpointresponse = await this.fetchFromEndpoint(endpoint);
    var collectionPrice: any[] = [];
    await Promise.all(
      endpointresponse.Data.map(async (item: any, index: any) => {
        const collectionPriceEndpoint = `api/pricing/prices/${item.SkuId}`;
        var collectionPriceResponse = await this.fetchFromEndpoint(
          collectionPriceEndpoint,
        );
        if (collectionPriceResponse?.statusCode == 404) {
          collectionPrice.push({...item, price: ''});
        } else {
          collectionPrice.push({
            ...item,
            price: collectionPriceResponse?.costPrice,
          });
        }
      }),
    );
    return collectionPrice;
  }

  async getVtexProducListingPage(categoryId: String): Promise<any> {
    const childrenendpoint = `api/catalog_system/pub/products/search?fq=C:/${categoryId}/`;
    return await this.fetchFromEndpoint(childrenendpoint);
  }

  async getVtexProductDetails(productId: string): Promise<any> {
    const endpoint = `api/catalog/pvt/product/${productId}`;
    return this.fetchFromEndpoint(endpoint);
  }

  async getProductById(pid: string): Promise<any> {
    const endpoint = `api/catalog/pvt/product/${pid}`;
    const response = this.fetchFromEndpoint(endpoint);
    const data = await response;
    if(data.status != undefined){
      return data;
    }
    else{
      const endpoint1 = `api/catalog_system/pub/products/variations/${data.Id}`;
    const product_variation = this.fetchFromEndpoint(endpoint1);
    const product_variation_response = await product_variation;
    //Cross Sell products:
    let crossSellProducts:any[] = [];
    const cross_sell_endpoint = `api/catalog_system/pub/products/crossselling/similars/${pid}`;
    const cross_sell_response = this.fetchFromEndpoint(cross_sell_endpoint);
    const cross_sell_data = await cross_sell_response;
    if(cross_sell_data.length == 0){
      crossSellProducts
    }
    else{
      cross_sell_data.map((items:any)=>{
        let cross_sell_product = {
          "productId":items.productId,
          "productName":items.productName,
          "imageUrl":items.items[0].images[0].imageUrl,
          "productTitle":items.productTitle,
          "productPrice":items.items[0].sellers[0].commertialOffer.Price
        }
        crossSellProducts.push(cross_sell_product)
      });
    }

    if(product_variation_response.status==undefined){
      //Product prices and discount:
    product_variation_response?.skus?.map((items:any,index:any)=>{
      delete(items.measures);
      const specification_data = items.dimensions;
      if(items.hasOwnProperty("dimensions")){
        items["specifications"] = specification_data;
        delete(items.dimensions);
      }
      var dollerAmount_list_price = items.listPriceFormated;
      var dollerAmount_sell_price = items.bestPriceFormated;

      var numericValueListPrice = dollerAmount_list_price.replace(/[$,]/g,'');
      var numericValueSellPrice = dollerAmount_sell_price.replace(/[$,]/g,'');

      var intValue_list_price = parseInt(numericValueListPrice,10);
      var intValue_sell_price = parseInt(numericValueSellPrice);

      var intValue_discount = Math.round(intValue_list_price - intValue_sell_price);
      var intValue_discount_percentage = Math.round((intValue_discount/intValue_list_price)*100);
      items.discountValue = intValue_discount;
      items.discountPercentage = intValue_discount_percentage;
    })

    product_variation_response['categoryId'] = data.CategoryId;
    product_variation_response['brandId'] = data.BrandId;
    product_variation_response['description'] = data.Description;
    const transformVtexPdp = this.transformVtexProductDetailPage(
      product_variation_response,crossSellProducts
    );
    // console.log("transformVtexPdp",transformVtexPdp);
    return transformVtexPdp;
    }
    else{
      return this.transformVtexProductDetailPage(data,crossSellProducts)
    }
    
    }
  }

  async getVtexCartDetails(cartId: any): Promise<any> {
    // a7be4a750c55442a865ca49fd22a4232 cart id
    const endpoint = `api/checkout/pub/orderForm/${cartId}`;
    const response = this.cartFetchFromEndpoint(endpoint);
    const cartData = this.getTransformCartDetails(response);
    return cartData;
  }

  async getTransformCartDetails(cartData:any){
    const data = await cartData;
    //For Products:
    const products : any[] = [];
    await Promise.all(
      data.items.map((items:any,index:any)=>{
        const logisticInfo = data.shippingData.logisticsInfo
        const itemID = logisticInfo.map((element:any)=>{
          if(element.itemId === items.id){
            return element.itemIndex;
          }
        }).filter((index:any) => index !== null);
        const newIndexId = itemID.length > 0 ? itemID[index] : null

        const products_data = {
          "itemId":items.id,
          "indexId":newIndexId,
          "productName":items.name,
          "price":items.price/100,
          "sellingPrice":items.sellingPrice/100,
          "quantity":items.quantity,
          "imageUrl":items.imageUrl
        };
        products.push(products_data);
      })
    );

    //For Totals:
    let totalizers :any = {"CartTotal":(data.value)/100};

    const final_result = {"products":products,"totalizers":totalizers}
    return final_result;
  }

  async getTransformedVtexProductDetails(productId: string): Promise<any> {
    const endpoint = `api/catalog/pvt/product/${productId}`;

    const response = await this.fetchFromEndpoint(endpoint);
    // return this.fetchFromEndpoint(endpoint);
    const transformedResponse = this.transformProductDetails(response);
    return transformedResponse;
  }

  async getBestSellingProducts(): Promise<any> {
    const endpoint = `api/catalog/pvt/collection/143/products`;
    const response =  this.fetchFromEndpoint(endpoint);
    const data = await response;
    var emptyarray:any[]=[]

    await Promise.all(
      data.Data.map(async (items: any, index: any) => {
        const endpoint_two = `api/pricing/prices/${items.SkuId}`;
        const product_price_response = await this.fetchFromEndpoint(endpoint_two);
        items.basePrice = product_price_response.basePrice;
        items.listPrice = product_price_response.costPrice;
        items.rating_avg = 3.2;
        items.rating_count = 7;
        emptyarray.push({ ...items });
        return items;
      })
    );
    return emptyarray;
  }
  async getBestSellingProductsrating(): Promise<any> {

    const endpoint = `api/catalog/pvt/collection/143/products`;

    const response =  this.fetchFromEndpoint(endpoint);

    const data = await response;

    var emptyarray:any[]=[]

 

    await Promise.all(

      data.Data.map(async (items: any) => {

        const endpoint_two = `api/pricing/prices/${items.SkuId}`;

        const endpoint_three = `https://skillnet.myvtex.com/reviews-and-ratings/api/rating/${items.ProductId}`;

        const data_with_rating = await axios.get(endpoint_three,{

          headers:{

            'Content-Type':'application/json',

            'X-VTEX-API-AppToken':
            vtexAppToken,
            'X-VTEX-API-AppKey': vtexAppKey,

          }

        });

        const response_with_rating = await data_with_rating;

        const product_price_response = await this.fetchFromEndpoint(endpoint_two);

        items.basePrice = product_price_response.basePrice;

        items.listPrice = product_price_response.costPrice;

        items.rating_avg = response_with_rating.data.average;

        items.rating_count = response_with_rating.data.totalCount;

        emptyarray.push({ ...items });

        return items; // Return the updated item

      })

    );

    // return this.fetchFromEndpoint(endpoint);

    return emptyarray;

  }
  async getTopSellingProductsrating(): Promise<any> {
    const endpoint = `api/catalog/pvt/collection/147/products`;
    const response =  this.fetchFromEndpoint(endpoint);
    const data = await response;
    var emptyarray:any[]=[]

    await Promise.all(
      data.Data.map(async (items: any) => {
        const endpoint_two = `api/pricing/prices/${items.SkuId}`;
        const endpoint_three = `https://skillnet.myvtex.com/reviews-and-ratings/api/rating/${items.ProductId}`;
        const data_with_rating = await axios.get(endpoint_three,{
          headers:{
            'Content-Type':'application/json',
            'X-VTEX-API-AppToken':
            vtexAppToken,
            'X-VTEX-API-AppKey': vtexAppKey,
          }
        });

        const response_with_rating = await data_with_rating;
        const product_price_response = await this.fetchFromEndpoint(endpoint_two);

        emptyarray.push({
          productId: items.ProductId,
          skuId: items.SkuId,
          productName: items.ProductName,
          skuImageUrl: items.SkuImageUrl,
          basePrice : product_price_response.basePrice,
          listPrice : product_price_response.costPrice,
          rating_avg : response_with_rating.data.average,
          rating_count : response_with_rating.data.totalCount
        })
        return items; // Return the updated item
      })
    );
    // return this.fetchFromEndpoint(endpoint);
    return emptyarray;
  }
  
  async getNewSellingProducts(): Promise<any> {
    const endpoint = `api/catalog/pvt/collection/137/products`;
    const response =  this.fetchFromEndpoint(endpoint);
    const data = await response;
    var emptyarray:any[]=[]

    await Promise.all(
      data.Data.map(async (items: any, index: any) => {
        const endpoint_two = `api/pricing/prices/${items.SkuId}`;
        const product_price_response = await this.fetchFromEndpoint(endpoint_two);
        items.basePrice = product_price_response.basePrice;
        items.listPrice = product_price_response.costPrice;
        emptyarray.push({ ...items });
        return items;
      })
    );
    return emptyarray;
  }

  async getVtexProductByCategory(categoryId: any, color:any, size:any, minprice:any, maxprice:any, sortbyprice:any, sortbyname:any, count:any, page: any): Promise<any>{

    let facets_colors;
    let facets_size;
    let prices;

    if (color) {
      facets_colors = color.replace(/,/g, "/color/");
    }

    if (size) {
      facets_size = size.replace(/,/g, "/size/");
    }

    if(minprice && maxprice){
      prices = true;
    }

    const endpoint = `/api/io/_v/api/intelligent-search/product_search/category-1/${categoryId}/${facets_colors != undefined ? `/color/${facets_colors}` : ""}/${facets_size ? `size/${facets_size}` : ""}/${prices ? `price/${minprice}:${maxprice}`:""}?${sortbyprice ? `sort=price:${sortbyprice}`:""}&${sortbyname ? `sort=name:${sortbyname}`:""}&${count!==undefined ? `count=${count}`: 'count='}&${page!==undefined ? `page=${page}`: 'page='}`;

    const response = this.fetchFromEndpoint(endpoint);

    const data = await response;

    const available_facets: any[] = [];
    const endpoint_two = `api/io/_v/api/intelligent-search/facets/category-1/${categoryId}?hideUnavailableItems=false`;
    const facets_Data = this.fetchFromEndpoint(endpoint_two);
    const new_facets_data = await facets_Data;
    const my_new_data = new_facets_data.facets;
    my_new_data.map((items: any, index: any) => {
      available_facets.push({
        name: items.values[0].key,
        value: items.values,
      });
    });

    const product_arr:any[] = [];

    await Promise.all(

      data?.products.map((items:any)=>{

        //For product prices and discount prices:
        const price_data = items.items;
        let list_price:Number =0;
        let sales_price:Number = 0;
        let new_discount_percentage:any;
        price_data.map((newItems:any)=>{
          newItems?.sellers.map((newNewItem:any,newIndex:any)=>{
            if(newNewItem?.commertialOffer?.discountHighlights[0]){
              list_price = newNewItem?.commertialOffer?.ListPrice;
              sales_price = newNewItem?.commertialOffer?.spotPrice;
              //@ts-ignore
              const percentageAsNumber = Number(list_price - sales_price) / Number(list_price) * 100;
              var discount_percentage = percentageAsNumber.toFixed(2);
              new_discount_percentage = discount_percentage;
            }
            else{
              list_price = newNewItem?.commertialOffer?.ListPrice;
              sales_price = newNewItem?.commertialOffer?.spotPrice;
              //@ts-ignore
              const percentageAsNumber = Number(list_price - sales_price) / Number(list_price) * 100;
              var discount_percentage = percentageAsNumber.toFixed(2);
              new_discount_percentage = discount_percentage;
            }
          });
        });

        product_arr.push({

          product_id:items?.productId,

          sku_id:items?.productId,

         product_name:items?.productName,

        product_image:items?.items[0]?.images[0].imageUrl,

        product_rating:"",

        //@ts-ignore
        product_price:{"sellingPrice":sales_price,"listPrice":list_price,"discount":Number(list_price-sales_price),"discountPercentage":new_discount_percentage},

        })

      })

    )

    let nextIndex:any;
    let prevIndex:any;

    if(page<data.pagination.count){
      //@ts-ignore
      nextIndex = Number(page) + 1;
    }else{nextIndex = 0}

    //@ts-ignore
    if(page>1){
      //@ts-ignore
      prevIndex = page-1;
    }else{prevIndex = 0}

    const availablePagination:any ={
      "totalPages": data.pagination.count,
      "currentIndex": page,
      "perPage": data.pagination.perPage,
      "next":nextIndex,
      "previous":prevIndex
    }

    const finalData:any = {
      productData:product_arr,
      valueFacets:available_facets,
      pagination:availablePagination
    }

    return finalData;
    // return product_arr;

  }

  async getVtexProductBySubCategory(subCategoryId: any, color:any, size:any, minprice:any, maxprice:any, sortbyprice:any, sortbyname:any, count:any, page: any): Promise<any>{
    let facets_colors;
    let facets_size;
    let prices;

    if (color) {
      facets_colors = color.replace(/,/g, "/color/");
    }

    if (size) {
      facets_size = size.replace(/,/g, "/size/");
    }

    if(minprice && maxprice){
      prices = true;
    }

    const endpoint = `/api/io/_v/api/intelligent-search/product_search/category-2/${subCategoryId}/${facets_colors != undefined ? `/color/${facets_colors}` : ""}/${facets_size ? `size/${facets_size}` : ""}/${prices ? `price/${minprice}:${maxprice}`:""}?${sortbyprice ? `sort=price:${sortbyprice}`:""}&${sortbyname ? `sort=name:${sortbyname}`:""}&${count!==undefined ? `count=${count}`: 'count='}&${page!==undefined ? `page=${page}`: 'page='}`;
    const response = this.fetchFromEndpoint(endpoint);
    const data = await response;
    const product_arr:any[] = [];

    //For available facets:
    const available_facets: any[] = [];
    const endpoint_two = `api/io/_v/api/intelligent-search/facets/category-2/${subCategoryId}?hideUnavailableItems=false`;
    const facets_Data = this.fetchFromEndpoint(endpoint_two);
    const new_facets_data = await facets_Data;
    const my_new_data = new_facets_data.facets;
    my_new_data.map((items: any, index: any) => {
      available_facets.push({
        name: items.values[0].key,
        value: items.values,
      });
    });

    await Promise.all(
      data?.products.map((items:any)=>{
        //For product prices and discount prices:
        const price_data = items.items;
        let list_price:Number =0;
        let sales_price:Number = 0;
        let new_discount_percentage:any;
        price_data.map((newItems:any)=>{
          newItems?.sellers.map((newNewItem:any,newIndex:any)=>{
            if(newNewItem?.commertialOffer?.discountHighlights[0]){
              list_price = newNewItem?.commertialOffer?.ListPrice;
              sales_price = newNewItem?.commertialOffer?.spotPrice;
              //@ts-ignore
              const percentageAsNumber = Number(list_price - sales_price) / Number(list_price) * 100;
              var discount_percentage = percentageAsNumber.toFixed(2);
              new_discount_percentage = discount_percentage;
            }
            else{
              list_price = newNewItem?.commertialOffer?.ListPrice;
              sales_price = newNewItem?.commertialOffer?.spotPrice;
              //@ts-ignore
              const percentageAsNumber = Number(list_price - sales_price) / Number(list_price) * 100;
              var discount_percentage = percentageAsNumber.toFixed(2);
              new_discount_percentage = discount_percentage;
            }
          });
        })

        product_arr.push({
          product_id:items?.productId,
          sku_id:items?.productId,
          product_name:items?.productName,
          product_image:items?.items[0]?.images[0].imageUrl,
          product_rating:"",
          product_price:items?.priceRange,
          //@ts-ignore
          product_price:{"sellingPrice":sales_price,"listPrice":list_price,"discount":Number(list_price-sales_price),"discountPercentage":new_discount_percentage},
        })
      })
    )

    //For Pagination:
    let nextIndex:any;
    let prevIndex:any;

    if(page<data.pagination.count){
      //@ts-ignore
      nextIndex = Number(page) + 1;
    }else{nextIndex = 0}

    //@ts-ignore
    if(page>1){
      //@ts-ignore
      prevIndex = page-1;
    }else{prevIndex = 0}

    const availablePagination:any ={
      "totalPages": data.pagination.count,
      "currentIndex": page,
      "perPage": data.pagination.perPage,
      "next":nextIndex,
      "previous":prevIndex
    }

    const finalData:any = {
      productData:product_arr,
      valuesFacets:available_facets,
      pagination:availablePagination
    }

    return finalData;

  }

  async getVtexProductByQuery(query: any, color:any, size:any, minprice:any, maxprice:any, sortbyprice:any, sortbyname:any, count:any, page: any): Promise<any>{
    let facets_colors;
    let facets_size;
    let prices;

    if (color) {
      facets_colors = color.replace(/,/g, "/color/");
    }

    if (size) {
      facets_size = size.replace(/,/g, "/size/");
    }

    if(minprice && maxprice){
      prices = true;
    }

    const endpoint = `/api/io/_v/api/intelligent-search/product_search/${facets_colors != undefined ? `/color/${facets_colors}`:""}/${facets_size ? `size/${facets_size}` : ""}/${prices ? `price/${minprice}:${maxprice}`:""}?query=${query}&${sortbyprice ? `sort=price:${sortbyprice}`:""}&${sortbyname ? `sort=name:${sortbyname}`:""}&${count!==undefined ? `count=${count}`: 'count='}&${page!==undefined ? `page=${page}`: 'page='}`;
    const response = this.fetchFromEndpoint(endpoint);
    const data = await response;

    //For available facets:
    const available_facets: any[] = [];
    const endpoint_two = `/api/io/_v/api/intelligent-search/facets?q=${query}`;
    const facets_Data = this.fetchFromEndpoint(endpoint_two);
    const new_facets_data = await facets_Data;
    const my_new_data = new_facets_data.facets;
    my_new_data.map((items: any, index: any) => {
      available_facets.push({
        name: items.values[0].key,
        value: items.values,
      });
    });

    const product_arr:any[] = [];

    await Promise.all(
      data?.products.map((items:any)=>{
        //For product prices and discount prices:
        const price_data = items.items;
        let list_price:Number =0;
        let sales_price:Number = 0;
        let new_discount_percentage:any;
        price_data.map((newItems:any)=>{
          newItems?.sellers.map((newNewItem:any,newIndex:any)=>{
            if(newNewItem?.commertialOffer?.discountHighlights[0]){
              list_price = newNewItem?.commertialOffer?.ListPrice;
              sales_price = newNewItem?.commertialOffer?.spotPrice;
              //@ts-ignore
              const percentageAsNumber = Number(list_price - sales_price) / Number(list_price) * 100;
              var discount_percentage = percentageAsNumber.toFixed(2);
              new_discount_percentage = discount_percentage;
            }
            else{
              list_price = newNewItem?.commertialOffer?.ListPrice;
              sales_price = newNewItem?.commertialOffer?.spotPrice;
              //@ts-ignore
              const percentageAsNumber = Number(list_price - sales_price) / Number(list_price) * 100;
              var discount_percentage = percentageAsNumber.toFixed(2);
              new_discount_percentage = discount_percentage;
            }
          });
        })

        product_arr.push({
          product_id:items?.productId,
          sku_id:items?.productId,
          product_name:items?.productName,
          product_image:items?.items[0]?.images[0].imageUrl,
          product_rating:"",
          //@ts-ignore
          product_price:{"sellingPrice":sales_price,"listPrice":list_price,"discount":Number(list_price-sales_price),"discountPercentage":new_discount_percentage},
        })
      })
    )

    //Pagination:
    let nextIndex:any;
    let prevIndex:any;

    if(page<data.pagination.count){
      //@ts-ignore
      nextIndex = Number(page) + 1;
    }else{nextIndex = 0}

    //@ts-ignore
    if(page>1){
      //@ts-ignore
      prevIndex = page-1;
    }else{prevIndex = 0}

    const availablePagination:any ={
      "totalPages": data.pagination.count,
      "currentIndex": page,
      "perPage": data.pagination.perPage,
      "next":nextIndex,
      "previous":prevIndex
    }

    const finalData:any = {
      productData:product_arr,
      valuesFacets:available_facets,
      pagination:availablePagination
    }

    return finalData;
  }

  //For single product (Updated API)
  async getAProductById(pid:string): Promise<any> {
    const endpoint = `api/catalog/pvt/product/${pid}`;
    const response = this.fetchFromEndpoint(endpoint);
    const data = await response;
    return data;
  }

  async getOrCreateCartId(token:any): Promise<any> {
    try{
      const endpoint = `${this.dataSource.settings.baseURL}/api/checkout/pub/orderForm?forceNewCart=true`;
      const response = await axios.post(endpoint,null,{
        headers:{
          Cookie: `${token}`,
        }
      });
      const data = await response.data;
      const baskets : any[] = [];
      baskets.push({"basket_id":data.orderFormId});
      // return data;
      return baskets;
    }
    catch(error){
      return this.handleErrorResponse(error);
    }
  }

  private transformProductDetails(response: any): any {
    return {
      productId: response.Id,
      productName: response.Name,
      category: {
        departmentId: response.DepartmentId,
        categoryId: response.CategoryId,
      },
    };
  }
  private vtextransformCategoryTreeloopback(response: any): any {
    const categoryTreemap: any = [];
    response?.map(async (item: any, index: any) => {
      var childrendata = this.CategroychildrenDataloopback(item.children);
      categoryTreemap.push(childrendata);
    });
    return categoryTreemap;
  }
  private CategroychildrenDataloopback(response: any): any {
    const categoryChildren: any = [];
    response?.map(async (childitem: any) => {
      const endpoint = `${this.dataSource.settings.baseURL}/api/io/_v/api/intelligent-search/product_search/category-2/${childitem.name}`;
      const response = await this.vtexCategoryTreeLoopbackFetchFromEndpoint(
        endpoint,
      );
      if (response) {
        categoryChildren.push({
          id: childitem.id,
          title: childitem.name,
          data: response,
        });
      }
    });
    return categoryChildren;
  }
  private vtextransformCategoryTree(response: any): any {
    const categoryTreemap: any = [];
    response?.map(async (item: any, index: any) => {
      // item.children.map(async (childitem: any) => {
      //   categoryChildren.push({
      //     Id: childitem.id,
      //     name: childitem.name,
      //     hasChildren: childitem.hasChildren,
      //     url: childitem.url,
      //   });
      // });
      categoryTreemap.push({
        parent_Id: item.id,
        name: item.name,
        hasChildren: item.hasChildren,
        url: item.url,
        children: this.CategroychildrenData(item.children),
      });
    });
    return categoryTreemap;
  }
  private CategroychildrenData(response: any): any {
    const categoryChildren: any = [];
    response?.map(async (childitem: any) => {
      categoryChildren.push({
        Id: childitem.id,
        name: childitem.name,
        hasChildren: childitem.hasChildren,
        url: childitem.url,
        children: this.CategroychildrenData(childitem.children),
      });
    });
    return categoryChildren;
  }
  private transformVtexProductDetailPage(response: any,crossSellProducts:any): any {
    return {
      productId: response.productId==undefined?response.Id:response.productId,
      productName: response.name==undefined?response.Name:response.name,
      available: response.available==undefined?response.Isvisible:response.available,
      description: response.description==undefined?response.Description:response.description,
      skus: response.skus==undefined?[]:response.skus,
      crossSellProduct: crossSellProducts
    };
  }

  async startLogin(email: string, password: string) {
    try{
        const formData = new FormData();
        formData.append('accountName', 'skillnet');
        formData.append('scope', 'skillnet');
        formData.append('returnUrl', 'https://skillnet.myvtex.com/');
        formData.append('callbackUrl', 'https://skillnet.myvtex.com/api/vtexid/oauth/finish?popup=false'); 
        formData.append('user', email);
        formData.append('fingerprint', '');
        const response = await axios({
          method: 'post',
          url: 'https://skillnet.myvtex.com/api/vtexid/pub/authentication/startlogin',
          data: formData
        });
        return response.data;
    }
    catch(error){
      return this.handleErrorResponse(error);
    }
  }

  async validateLogin(email: string, password: string) {
    try{
      const formData = new FormData();
      formData.append('login', email);
      formData.append('password', password);
      formData.append('recaptcha', '');
      formData.append('fingerprint', '');
      const response = await axios({
        method: 'post',
        url: 'https://skillnet.myvtex.com/api/vtexid/pub/authentication/classic/validate', 
        headers: {
          ...formData.getHeaders(),
        },
        data: formData
      });
      return response.data;
    }
    catch(error){
      return this.handleErrorResponse(error);
    }
  }

  async startLogins(email: string): Promise<AxiosResponse<any>> {
    const formData = new FormData();
    formData.append('accountName', 'skillnet');
    formData.append('scope', 'skillnet');
    formData.append('returnUrl', 'https://skillnet.myvtex.com/');
    formData.append(
      'callbackUrl',
      'https://skillnet.myvtex.com/api/vtexid/oauth/finish?popup=false'
    );
    formData.append('user', email);

    try {
      const response = await axios.post(
        'https://skillnet.myvtex.com/api/vtexid/pub/authentication/startlogin',
        formData
      );
      return response;
    } catch (error) {
      return this.handleErrorResponse(error);
    }
  }
    // async getSession(cookie : any): Promise<AxiosResponse<any>> {
    //   const response = await axios.get(
    //     'https://skillnet.myvtex.com/api/sessions?items=*',
    //     {
    //       headers: {
    //         Cookie: cookie,
    //       },
    //     }
    //   );
    //   console.log('response', response.data);
    //   return response;   
    // }
  async vtexlogin(email: string): Promise<AxiosResponse<any>> {
    try{
      const formDataObject = new FormData();  
      formDataObject.append('scope', "skillnet");
      formDataObject.append('accountName', "skillnet");
      formDataObject.append('user', email);
      formDataObject.append('appStart', "true");  
      formDataObject.append('callbackUrl', "https://skillnet.myvtex.com/api/vtexid/oauth/finish");
      const response: AxiosResponse<any> = await axios.post(
        'https://skillnet.myvtex.com/api/vtexid/pub/authentication/start',
        formDataObject,
        {
          headers: {
            'accept': '*/*',
          },
        }
      );
      const token = response.data.authenticationToken;
      return response;
    }
    catch(error){
      return this.handleErrorResponse(error);
    }
  }

  async validateLogins(
    email: string,
    password: string,
    auth: any
  ): Promise<AxiosResponse<any>> {
    try {
      const formData = new FormData();
      formData.append("login", email);
      formData.append("password", password);
      formData.append("recaptcha", "");
      formData.append("fingerprint", "");
      const authToken = "_vss=" + auth;

      const response: AxiosResponse<any> = await axios.post(
        "https://skillnet.myvtex.com/api/vtexid/pub/authentication/classic/validate",
        formData,
        {
          headers: {
            accept: "*/*",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "sec-gpc": "1",
            Cookie: authToken,
          },
        }
      );
      return response;
    } catch (error) {
      return this.handleErrorResponse(error);
    }
  }

  async createSession(response: any) {
    try{
      const sessionresponse: AxiosResponse<any> = await axios.post(
        "https://skillnet.myvtex.com/api/sessions",
        {
          headers: {
            cookie: `${(response.accountAuthCookie.Name =
              response.accountAuthCookie.Value)}+";"+${(response.authCookie.Name =
              response.accountAuthCookie.Value)}`,
          },
        }
      );
      // const data:any = {
      //   resp:response,
      //   session:sessionresponse.data,
      // };
      // console.log("dataamber", data);
      return sessionresponse;
    }
    catch(error){
      return this.handleErrorResponse(error);
    }
  }

  async login(email: any, password: any) {
    const start = await this.vtexlogin(email);
    const auth = await start.data.authenticationToken;
    const validate = await this.validateLogins(email, password, auth);
    if (await validate.data.authStatus != "Success") {
      return {
        "status": "401",
        "statusText":"Validation failed" ,
        "message": "cannot create session due to invalid credentials",
      };
    }
    else{
    const session = await this.createSession(validate.data);
    validate.data.authCookie.Name = "VtexIdclientAutCookie_skillnet"
    validate.data.accountAuthCookie.Name = "VtexIdclientAutCookie_13ca6e38-75b0-4070-8cf2-5a61412e4919"
    const finalToken = `${validate.data.authCookie.Name}=`+`${validate.data.authCookie.Value};`+`${validate.data.accountAuthCookie.Name}=`+`${validate.data.accountAuthCookie.Value};`+`sessionToken=`+`${session.data.sessionToken};`+`segmentToken=`+`${session.data.segmentToken}`

    return{customer_id:"","bearerToken":finalToken}
    // return {
    //   validation: validate.data,
    //   session: session.data,
    // };
  }
    // const validate = await this.validateLogin(email, password);
  }

    //Function to generate Customer Cart:
    async createCustomerCart(customerId:any,token:any): Promise<any>{
      try{
        const endpoint = `${this.dataSource.settings.baseURL}/api/checkout/pub/orderForm`;
        const response = await axios.post(endpoint,null,{
          headers:{
            Cookie: `${token}`,
          }
        });
        return  {"baskets":[{"basket_id": response.data.orderFormId}]};
      }
      catch(error){
        return this.handleErrorResponse(error)
      }
    }

    //Function for adding items in cart:
    async addItems(orderFormId:any , requestBody:any): Promise<any> {
      const newBody = {"orderItems":[{"quantity":`${requestBody.quantity}`,"seller":"1","id":`${requestBody.itemId}`}]}
      const endpoint = `api/checkout/pub/orderForm/${orderFormId}/items`;
      try{
        const response : AxiosResponse<any> = await axios.post(`${this.dataSource.settings.baseURL}/${endpoint}`,
        newBody,
        {
          headers: {
            Accept: 'application/json',
            'X-VTEX-API-AppToken':
            vtexAppToken,
            'X-VTEX-API-AppKey': vtexAppKey,
          }
        }
        );
        return response.data;
      }
      catch(error){
        return this.handleErrorResponse(error);
      }
    }

    // Function for updating items in cart
    async updateCartItem(orderFormId:any,requestBody:any):Promise<any>{
      const newBody = {"orderItems":[{"quantity":`${requestBody.quantity}`,"index":`${requestBody.indexId}`}]}
      const endpoint = `api/checkout/pub/orderForm/${orderFormId}/items/update`;
      try{
        const url = `${this.dataSource.settings.baseURL}/${endpoint}`;
        const response : AxiosResponse<any> = await axios.post(`${this.dataSource.settings.baseURL}/${endpoint}`,
        newBody,
          {
            headers: {
              Accept: 'application/json',
              'X-VTEX-API-AppToken':
            vtexAppToken,
            'X-VTEX-API-AppKey': vtexAppKey,
            }
          }
        );
        return response.data;
      }
      catch(error){
        return this.handleErrorResponse(error);
      }
    }

    // Function for Deleting items in cart
    async deleteCartItem(orderFormId:any,index_id:any):Promise<any>{
      const customBody = {"orderItems":[{"quantity":'0',"index":`${index_id}`}]};
      const endpoint = `api/checkout/pub/orderForm/${orderFormId}/items/update`;
      try{
        const url = `${this.dataSource.settings.baseURL}/${endpoint}`;
        const response : AxiosResponse<any> = await axios.post(`${this.dataSource.settings.baseURL}/${endpoint}`,
        customBody,
          {
            headers: {
              Accept: 'application/json',
              'X-VTEX-API-AppToken':
            vtexAppToken,
            'X-VTEX-API-AppKey': vtexAppKey,
            }
          }
        );
        return response.data;
      }
      catch(error){
        return this.handleErrorResponse(error);
      }
    }

    //Function for getting Cart Details Or Cart Items:
    async getCartItems(orderFormId:any): Promise<any>{
      const endpoint = `api/checkout/pub/orderForm/${orderFormId}`;
      const response = this.fetchFromEndpoint(endpoint);
      const data = await response;
      return data;
    }

    async sfBestSelling(): Promise<any> {
      const endpoint = `shop/v23_2/product_search?refine=cgid%3Dmens&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b&expand=images%2Cprices%2Cavailability%2Cvariations`;
      const response = await this.fetchSfFromEndpoint(endpoint);
      const data = await response;
      const products: any[] = [];
      for (const hit of data.hits) {
        const ProductId = hit.product_id;
        const ProductName = hit.product_name;
        const SkuImageUrl = hit.image.link; // Extract image URL
        const listPrice = hit.price; // Extract the price and name it as listPrice
        const basePrice = hit.price;
        products.push({
          ProductId,
          skuId: ProductId,
          ProductName,
          SkuImageUrl,
          listPrice,
          basePrice
        });
      }
      return products;
    } 
  
    async salesForceProduct(pid: any): Promise<any> {
      const endpoint = `shop/v23_2/products/${pid}?null=null&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b&expand=images%2Cprices%2Cavailability%2Cvariations%2Cpromotions%2Cset_products&all_images=true`;
      const response = await this.fetchSfFromEndpoint(endpoint);
      const data = await response; // Parse JSON response
      const productId = data.id;
      const name = data.name;
      const available = data.inventory.orderable;
      const skus = data.variants.map((variant: any) => {
        const sku = variant.product_id;
        const skuname = variant.product_name;
        const skuAvailable = variant.orderable;
        const availableQuantity = data.inventory.stock_level;
        const listPriceFormated = variant.price_per_unit;
        const listPrice = variant.price;
        const image = data.image_groups[0].images[0].link;
        const sellerId = variant.sellerId;
        const seller = variant.seller;
        const measures = variant.measures;
        const unitMultiplier = variant.unitMultiplier;
        const rewardValue = variant.rewardValue;
        return {
          sku,
          skuname : sku,
          available: skuAvailable,
          availablequantity: availableQuantity,
          listPriceFormated,
          listPrice,
          bestPrice : listPrice,
          image,
          sellerId,
          seller,
          measures,
          unitMultiplier,
          rewardValue
        };
      });
    
      return {
        productId,
        SkuId: productId,
        name,
        available,
        skus
      };
    }
    

    //Function for getting products using facets on PLP Page:

  async searchByFacets(category: string, color: any, size: any, minprice:any, maxprice:any, sortbyprice:any, sortbyname:any , count:Number, page:Number): Promise<any> {
    let filteredData :any = {};

    let nextIndex:any;

    let prevIndex:any;

    let facets_colors;

    let facets_size;

    let prices;

    if (color) {
      facets_colors = color.replace(/,/g, "/color/");
    }

    if (size) {
      facets_size = size.replace(/,/g, "/size/");
    }

    if(minprice && maxprice){
      prices = true;
    }

    const endpoint = `api/io/_v/api/intelligent-search/product_search/category-2/${category}/${prices ? `price/${minprice}:${maxprice}`:""}${

      facets_colors != undefined ? `/color/${facets_colors}` : ""

    }/${facets_size ? `size/${facets_size}` : ""}?${sortbyprice ? `sort=price:${sortbyprice}`:""}&${sortbyname ? `sort=name:${sortbyname}`:""}&${count ? `count=${count}`:""}&${page ? `page=${page}`:""}`;

    const response = this.fetchFromEndpoint(endpoint);

    const data = await response;

    filteredData["products"] = data.products;
    filteredData["recordsFiltered"] = data.recordsFiltered;

    if(page<data.pagination.count){
      //@ts-ignore
      nextIndex = Number(page) + 1;
    }else{nextIndex = 0}

    //@ts-ignore
    if(page>1){
      //@ts-ignore
      prevIndex = page-1;
    }else{prevIndex = 0}

    filteredData["pagination"] = {"totalPages":data.pagination.count,"currentIndex":Number(page),"perPage":data.pagination.perPage,"next":nextIndex,"previous":prevIndex};

    // const data = await response;

    return filteredData;

  }

  //Function for getting user Details Or Profile :
  async getUserProfileDetails(email:string): Promise<any>{
    const endpoint = `api/checkout/pub/profiles/?email=${email}`;
    const response = this.fetchFromEndpoint(endpoint);
    const data = await response;
    const formattedData = {
      userProfile: {
        email: `${data.userProfile.email}`,
        firstName: data.userProfile.firstName,
        lastName: data.userProfile.lastName,
        receiverName: data.availableAddresses[0].receiverName,
        addressId: data.availableAddresses[0].addressId,
        postalCode: data.availableAddresses[0].postalCode,
        city: data.availableAddresses[0].city,
        state: data.availableAddresses[0].state,
        country: data.availableAddresses[0].country,
        street: data.availableAddresses[0].street,
        addressNumber: data.availableAddresses[0].number || "N/A",
        phone: `${data.userProfile.phone}`
      }
    };
    return formattedData;
  }

  //Function for getting filter results for parent categories:
  async facetsResults(parentCategory: string, color: any, size: any, minprice:any, maxprice:any, sortbyprice:any, sortbyname:any, count:Number, page:Number): Promise<any> {
    let filteredData :any = {};
    let nextIndex:any;
    let prevIndex:any;
    let facets_colors;
    let facets_size;
    let prices;

    if (color) {
      facets_colors = color.replace(/,/g, "/color/");
    }

    if (size) {
      facets_size = size.replace(/,/g, "/size/");
    }

    if(minprice && maxprice){
      prices = true;
    }

    const endpoint = `api/io/_v/api/intelligent-search/product_search/category-1/${parentCategory}/${prices ? `price/${minprice}:${maxprice}`:""}${
      facets_colors != undefined ? `/color/${facets_colors}` : ""
    }/${facets_size ? `size/${facets_size}` : ""}?${sortbyprice ? `sort=price:${sortbyprice}`:""}${sortbyname ? `sort=name:${sortbyname}`:""}${count ? `count=${count}`:""}${page ? `page=${page}`:""}`;

    const response = this.fetchFromEndpoint(endpoint);
    const data = await response;

    filteredData["products"] = data.products;
    filteredData["recordsFiltered"] = data.recordsFiltered;

    if(page<data.pagination.count){
      //@ts-ignore
      nextIndex = Number(page) + 1;
    }else{nextIndex = 0}

    //@ts-ignore
    if(page>1){
      //@ts-ignore
      prevIndex = page-1;
    }else{prevIndex = 0}
    filteredData["pagination"] = {"totalPages":data.pagination.count,"currentIndex":Number(page),"perPage":data.pagination.perPage,"next":nextIndex,"previous":prevIndex};

    // const data = await response;

    return filteredData;
    // return response;
  }

  //Function for Placing an Order from existing cart:
  async placeOrder(basketId: string, requestBody: any){
    const endpoint = `api/checkout/pub/orderForm/${basketId}/transaction`;
    try{
      const response = await this.placeOrderEndpoint(endpoint,requestBody);
      return response;
    }
    catch(error){
      return this.handleErrorResponse(error);
    }
  }
  async placeOrderEndpoint(endpoint:any, requestBody:any){
    try{
      const headers = {
        Accept: 'application/json',
        'X-VTEX-API-AppToken':
            vtexAppToken,
            'X-VTEX-API-AppKey': vtexAppKey,
      };
      const response = await axios.post(`${this.dataSource.settings.baseURL}/${endpoint}`,requestBody,{headers});
      return response.data;
    }
    catch(error){
      return this.handleErrorResponse(error);
    }
  }

  //Function For Approving the Payment:
  async approvePayment(transactionId:any, requestBody:any){
    const endpoint = `api/pub/transactions/${transactionId}/payments`;
    try{
      const response = await this.approvePaymentEndpoint(endpoint,requestBody);
      return {message:"Payment Approved"};
    }
    catch(error){
      return this.handleErrorResponse(error);
    }
  }
  async approvePaymentEndpoint(endpoint:any,requestBody:any){
    try{
      const headers = {
        'X-VTEX-API-AppToken':
            vtexAppToken,
            'X-VTEX-API-AppKey': vtexAppKey,
      };
      const response = await axios.post(`https://skillnet.vtexpayments.com.br/${endpoint}`,[requestBody],{headers});
      return response.data;
    }
    catch(error){
      return this.handleErrorResponse(error);
    }
  }

}


