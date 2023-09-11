import {injectable, inject} from '@loopback/core';
import axios, { AxiosResponse } from 'axios';
import {VtexDataSource} from '../datasources';
import FormData = require('form-data');
import {response} from '@loopback/rest';
import { CountSchema } from '@loopback/repository';


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
    const endpoint1 = `api/catalog_system/pub/products/variations/${data.Id}`;
    const product_variation = this.fetchFromEndpoint(endpoint1);
    const product_variation_response = await product_variation;
    product_variation_response['categoryId'] = data.CategoryId;
    product_variation_response['brandId'] = data.BrandId;
    product_variation_response['description'] = data.Description;
    const transformVtexPdp = this.transformVtexProductDetailPage(
      product_variation_response,
    );
    // console.log("transformVtexPdp",transformVtexPdp);
    return transformVtexPdp;
  }

  async getVtexCartDetails(cartId: any): Promise<any> {
    // a7be4a750c55442a865ca49fd22a4232 cart id
    const endpoint = `api/checkout/pub/orderForm/${cartId}`;
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

        const endpoint_three = `https://skillnet.myvtex.com/reviews-and-ratings/api/rating/${items.ProductId}`;

        const data_with_rating = await axios.get(endpoint_three,{

          headers:{

            'Content-Type':'application/json',

            'X-VTEX-API-AppKey':'vtexappkey-skillnet-VOZXMR',

            'X-VTEX-API-AppToken':'RVXQMZYNRRZNTMEURBRBHPRCWYMITOEUNUPISMZTCCAGROZIUTHBZFUCZKIVIWSHJPAREKDSZSKDTFKGQZHNBKKXLIANVJLFBTJJBUWJJNDQTJVQKXLOKCMFYHWORAVT'

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

            'X-VTEX-API-AppKey':'vtexappkey-skillnet-VOZXMR',

            'X-VTEX-API-AppToken':'RVXQMZYNRRZNTMEURBRBHPRCWYMITOEUNUPISMZTCCAGROZIUTHBZFUCZKIVIWSHJPAREKDSZSKDTFKGQZHNBKKXLIANVJLFBTJJBUWJJNDQTJVQKXLOKCMFYHWORAVT'

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

  async getOrCreateCartId(): Promise<any> {
    const endpoint = `api/checkout/pub/orderForm`;
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
    async startLogin(email: string, password: string) {
  
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
  
    async validateLogin(email: string, password: string) {
      
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
        console.log('response', response);
        return response;
      } catch (error) {
        throw error;
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
      console.log("token",token)
  
      // const response =  await this.fetchFromEndpointpost(endpoint,formDataObject);
  
      // const data = await response;
  
      // const validateresponse= await this.loginvalidate(response.authenticationToken,body.user,body.password)
  
      // console.log("validateresponse",validateresponse)
  
      return response;
  
    }

    async validateLogins(
      email: string,
      password: string,
      auth: any
    ): Promise<AxiosResponse<any>> {
      try {
        console.log("auth", auth);
        const formData = new FormData();
        formData.append("login", email);
        formData.append("password", password);
        formData.append("recaptcha", "");
        formData.append("fingerprint", "");
        const authToken = "_vss=" + auth;
        console.log("authToken", authToken);
  
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
        console.log("response", formData);
        return response;
      } catch (error) {
        throw error;
      }
    }
    async createSession(response: any) {
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
      console.log("sessionreponse123",sessionresponse)
      // const data:any = {
      //   resp:response,
      //   session:sessionresponse.data,
      // };
      // console.log("dataamber", data);
      return sessionresponse;
    }
    async login(email: any, password: any) {
      const start = await this.vtexlogin(email);
      console.log("start", start);
      const auth = await start.data.authenticationToken;
      console.log("auth", auth);
      const validate = await this.validateLogins(email, password, auth);
      console.log("validate", validate);
      if (await validate.data.authStatus != "Success") {
        return {
          validation: 'Validation failed',
          session: "cannot create session due to invalid credentials",
        };
      }
      else{
      const session = await this.createSession(validate.data);
      console.log("session123", session);
      validate.data.authCookie.Name = "VtexIdclientAutCookie_skillnet"
      validate.data.accountAuthCookie.Name = "VtexIdclientAutCookie_13ca6e38-75b0-4070-8cf2-5a61412e4919"
      return {
        validation: validate.data,
        session: session.data,
      };
    }
      // const validate = await this.validateLogin(email, password);
    } 

}
