import {injectable, inject} from '@loopback/core';
import axios from 'axios';
import {VtexDataSource} from '../datasources';
import {response} from '@loopback/rest';

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
              'RVXQMZYNRRZNTMEURBRBHPRCWYMITOEUNUPISMZTCCAGROZIUTHBZFUCZKIVIWSHJPAREKDSZSKDTFKGQZHNBKKXLIANVJLFBTJJBUWJJNDQTJVQKXLOKCMFYHWORAVT',
            'X-VTEX-API-AppKey': 'vtexappkey-skillnet-VOZXMR',
          },
        },
      );
      return response.data;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
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
              'RVXQMZYNRRZNTMEURBRBHPRCWYMITOEUNUPISMZTCCAGROZIUTHBZFUCZKIVIWSHJPAREKDSZSKDTFKGQZHNBKKXLIANVJLFBTJJBUWJJNDQTJVQKXLOKCMFYHWORAVT',
            'X-VTEX-API-AppKey': 'vtexappkey-skillnet-VOZXMR',
          },
        },
      );
      return response.data;
    } catch (error) {
      console.log('error', error);
      const data = {
        statusCode: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      };
      return data;
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
            'RVXQMZYNRRZNTMEURBRBHPRCWYMITOEUNUPISMZTCCAGROZIUTHBZFUCZKIVIWSHJPAREKDSZSKDTFKGQZHNBKKXLIANVJLFBTJJBUWJJNDQTJVQKXLOKCMFYHWORAVT',
          'X-VTEX-API-AppKey': 'vtexappkey-skillnet-VOZXMR',
        },
      });
      return response.data;
    } catch (error) {
      console.log('error', error);
      // const data = {
      //   statusCode: error.response.status,
      //   statusText: error.response.statusText,
      //   data: error.response.data,
      // };
      // return data;
    }
  }
  async getVtexCategoryTree(): Promise<any> {
    const endpoint = 'api/catalog_system/pub/category/tree/2';
    const response = await this.fetchFromEndpoint(endpoint);
    const transformCategoryTree = this.vtextransformCategoryTree(response);
    console.log('transformCategoryTree', transformCategoryTree);
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
      console.log("response", responseData);
      await categoryTreemap.push({
        id: item.id,
        title: item.name,
        data: await this.functionVtexCategoryTreeLoopbackForData(responseData),
      });
    }));
  
    console.log('transformCategoryTree', categoryTreemap);
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
    console.log("rersrser",categoryId)
    const childrenendpoint = `api/catalog_system/pub/products/search?fq=C:/${categoryId}/`;
    console.log('wdaw', await this.fetchFromEndpoint(childrenendpoint));
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
    const endpoint1 = `api/catalog_system/pub/products/variations/${data.Id}`;
    const product_variation = this.fetchFromEndpoint(endpoint1);
    const product_variation_response = await product_variation;
    product_variation_response['categoryId'] = data.CategoryId;
    product_variation_response['brandId'] = data.BrandId;
    product_variation_response['description'] = data.Description;
    console.log('product_variation_response', product_variation_response);
    const transformVtexPdp = this.transformVtexProductDetailPage(
      product_variation_response,
    );
    // console.log("transformVtexPdp",transformVtexPdp);
    return transformVtexPdp;
  }

  async getVtexCartDetails(): Promise<any> {
    // a7be4a750c55442a865ca49fd22a4232 cart id
    const endpoint = `api/checkout/pub/orderForm/a7be4a750c55442a865ca49fd22a4232`;
    return this.cartFetchFromEndpoint(endpoint);
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

        const endpoint_three = `https://skillnet.myvtex.com/reviews-and-ratings/api/rating/${items.sku_id}`;

        const data_with_rating = await axios.get(endpoint_three,{

          headers:{

            'Content-Type':'application/json',

            'X-VTEX-API-AppKey':'vtexappkey-skillnet-VOZXMR',

            'X-VTEX-API-AppToken':'RVXQMZYNRRZNTMEURBRBHPRCWYMITOEUNUPISMZTCCAGROZIUTHBZFUCZKIVIWSHJPAREKDSZSKDTFKGQZHNBKKXLIANVJLFBTJJBUWJJNDQTJVQKXLOKCMFYHWORAVT'

          }

        });

        const response_with_rating = await data_with_rating;

        const product_price_response = await this.fetchFromEndpoint(endpoint_two);

        console.log('danishis', product_price_response);

        items.basePrice = product_price_response.basePrice;

        items.listPrice = product_price_response.costPrice;

        items.ratings = response_with_rating.data.average;

        emptyarray.push({ ...items });

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

  async getVtexProductByCategory(categoryId: any): Promise<any>{

    const endpoint = `/api/io/_v/api/intelligent-search/product_search/category-1/${categoryId}`;

    const response = this.fetchFromEndpoint(endpoint);

    const data = await response;

 

    const product_arr:any[] = [];

    await Promise.all(

      data?.products.map((items:any)=>{

        product_arr.push({

          product_id:items?.productId,

          sku_id:"",

         product_name:items?.productName,

        product_image:items?.items[0]?.images[0].imageUrl,

        product_rating:"",

        alt:"",

        product_description:items?.description,

        product_features:"",

        product_price:items?.priceRange,

        product_category: items?.categoryId,

        product_category_id: items?.categoriesIds,

        properties: items?.properties

        })

      })

    )

    return product_arr;

  }
  async getVtexProductBySubCategory(subCategoryId: any): Promise<any>{

    const endpoint = `/api/io/_v/api/intelligent-search/product_search/category-2/${subCategoryId}`;

    const response = this.fetchFromEndpoint(endpoint);

    const data = await response;

 

    const product_arr:any[] = [];

    await Promise.all(

      data?.products.map((items:any)=>{

        product_arr.push({

          product_id:items?.productId,

          sku_id:"",

         product_name:items?.productName,

        product_image:items?.items[0]?.images[0].imageUrl,

        product_rating:"",

        alt:"",

        product_description:items?.description,

        product_features:"",

        product_price:items?.priceRange,

        product_category: items?.categoryId,

        product_category_id: items?.categoriesIds,

        properties: items?.properties

        })

      })

    )

    return product_arr;

  }
  async getVtexProductByQuery(query: any): Promise<any>{

    const endpoint = `/api/io/_v/api/intelligent-search/product_search/${query}`;

    const response = this.fetchFromEndpoint(endpoint);

    const data = await response;

 

    const product_arr:any[] = [];

    await Promise.all(

      data?.products.map((items:any)=>{

        product_arr.push({

          product_id:items?.productId,

          sku_id:"",

         product_name:items?.productName,

        product_image:items?.items[0]?.images[0].imageUrl,

        product_rating:"",

        alt:"",

        product_description:items?.description,

        product_features:"",

        product_price:items?.priceRange,

        product_category: items?.categoryId,

        product_category_id: items?.categoriesIds,

        properties: items?.properties

        })

      })

    )

    return product_arr;

  }

  //For single product (Updated API)
  async getAProductById(pid:string): Promise<any> {
    const endpoint = `api/catalog/pvt/product/${pid}`;
    const response = this.fetchFromEndpoint(endpoint);
    const data = await response;
    return data;
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
    // console.log("response1234",response)
    const categoryTreemap: any = [];
    response?.map(async (item: any, index: any) => {
      var childrendata = this.CategroychildrenDataloopback(item.children);
      // console.log("dwadawdaw",childrendata)
      categoryTreemap.push(childrendata);
    });
    // console.log("categoryTreemap",categoryTreemap)
    return categoryTreemap;
  }
  private CategroychildrenDataloopback(response: any): any {
    const categoryChildren: any = [];
    response?.map(async (childitem: any) => {
      const endpoint = `https://skillnet.vtexcommercestable.com.br/api/io/_v/api/intelligent-search/product_search/category-2/${childitem.name}`;
      const response = await this.vtexCategoryTreeLoopbackFetchFromEndpoint(
        endpoint,
      );
      console.log('CategroychildrenDataloopback',response);
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
    // console.log("response1234",response)
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
  private transformVtexProductDetailPage(response: any): any {
    return {
      productId: response.productId,
      name: response.name,
      available: response.available,
      skus: response.skus,
    };
  }
}
