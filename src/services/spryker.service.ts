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
  
  handleErrorResponse(error: any): any {
    return {
      "status": error?.response.status,
      "statusText": error?.response?.statusText,
      "message": error?.response?.data
    };
  }

  async fetchFromEndpoint(endpoint: string): Promise<any> {
    try {
      const response = await axios.get(`${this.dataSource.settings.baseURL}/${endpoint}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return this.handleErrorResponse(error)
      throw error;
    }
  }

  async getSprykerCategoryTree(): Promise<any[]> {
    const response = await this.fetchFromEndpoint('category-trees');
    const categoryTree = response.data[0].attributes.categoryNodesStorage;
  
    const mapCategory = (categories: any[], parentId: string | null = null): any[] => {
      const result: any[] = [];
  
      categories.forEach((category: any) => {
        const categoryData: any = {
          parent_Id: category.nodeId.toString(),
          name: category.name,
          hasChildren: category.children.length > 0,
          children: mapCategory(category.children, category.nodeId.toString()),
        };
  
        result.push(categoryData);
      });
  
      return result;
    };
  
    const topLevelCategories = mapCategory(categoryTree);
    return topLevelCategories;
  }
  
  

  async functionSprykerCategoryTreeLoopbackForData(responseData:any){
    var data = responseData.data;
    console.log('aaf',responseData);
    var dataArr:any = [];

   await data[0]?.attributes?.abstractProducts?.map(async(responseitem:any,index:any)=>{
    console.log('aafreen' , responseitem);
    const FinalData = await {
      attributes:{
        "sku": responseitem?.abstractSku,
        "Name": responseitem?.abstractName,
        "Price": responseitem?.price,
        "productImage":responseitem?.images[0].externalUrlLarge,
        
      //   "discontinuedNote": null,
      //   "averageRating": null,
      //   "reviewCount": 0,
      //   "productAbstractSku": "232",
      //   "name": responseitem?.productName,
      //   "description": responseitem?.description,
        "productPrice": {
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

  async getSprykerProductByCategory(categoryId: any, count: any, page:any): Promise<any>{
    
    const endpoint = `catalog-search?category=${categoryId}&include=Concrete-products&${count == undefined ? `ipp=` : `ipp=${count}`}&${page == undefined ? `page=` : `page=${page}`}`;
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
          "listPrice": items?.prices[0].grossAmount,
          "sellingPrice": items?.prices[0].DEFAULT,
        },
        })
      })
    )

    const pagination = {
      "count": response?.data[0]?.attributes?.pagination?.numFound,
      "totalPages": response?.data[0]?.attributes?.pagination?.maxPage,
      "perPage": response?.data[0]?.attributes?.pagination?.currentItemsPerPage,
      "next": response?.data[0]?.attributes?.pagination?.nextPage
    }

    return {"productData":product_arr, "valueFacets": valueFacets, "pagination": pagination};
    // return response;
  }

  async getSprykerProductByLabels(categoryId: any): Promise<any> {
    const endpoint = `catalog-search?label=${categoryId}&include=Concrete-products`;
    const response = await this.fetchFromEndpoint(endpoint);
    const data = response.data[0];
    const value = response.data[0].attributes.valueFacets;
    console.log('data', data);

    const product_arr: any[] = [];
    const valueFacets = this.getvalueFacets(value);

    await Promise.all(
        data?.attributes?.abstractProducts?.map((items: any) => {
            const productImages = items?.images.map((image: any) => image.externalUrlLarge);

            product_arr.push({
                productId: items?.abstractSku,
                skuId: items?.abstractSku,
                productName: items?.abstractName,
                productImage: productImages, // Product images as a list
                productPrice: {
                    "listPrice": items?.prices[0].DEFAULT,
                    "price": items?.prices[0].DEFAULT,
                },
                productLabelId: categoryId,
            });
        })
    );
    console.log('product_arr', product_arr);
    return {
        "ProductData": product_arr,
        "valueFacets": valueFacets
    };
}

//new arrival
async getSprykerNewArrivalProducts(): Promise<any> {
  const endpoint = `catalog-search?label=4&include=Concrete-products`;
  const response = await this.fetchFromEndpoint(endpoint);
  const data = response.data[0];
  const value = response.data[0].attributes.valueFacets;
  console.log('data', data);

  const product_arr: any[] = [];
  const valueFacets = this.getvalueFacets(value);
  await Promise.all(
      data?.attributes?.abstractProducts?.map((items: any) => {
          const productImages = items?.images.map((image: any) => image.externalUrlLarge);

          product_arr.push({
              ProductId: items?.abstractSku,
              SkuId: items?.abstractSku,
              ProductName: items?.abstractName,
              SkuImageUrl:  items?.images[0].externalUrlLarge, // Product images as a list
              listPrice: items?.prices[0].DEFAULT,
              basePrice: items?.prices[0].DEFAULT,
          });
      })
  );
  console.log('product_arr', product_arr);
  return product_arr
}

//best selling products
async getSprykerSellingProducts(): Promise<any> {
  const endpoint = `catalog-search?label=4&include=Concrete-products`;
  const response = await this.fetchFromEndpoint(endpoint);
  const data = response.data[0];
  const value = response.data[0].attributes.valueFacets;
  console.log('data', data);

  const product_arr: any[] = [];
  const valueFacets = this.getvalueFacets(value);
  await Promise.all(
      data?.attributes?.abstractProducts?.map((items: any) => {
          product_arr.push({
              ProductId: items?.abstractSku,
              SkuId: items?.abstractSku,
              ProductName: items?.abstractName,
              SkuImageUrl:  items?.images[0].externalUrlLarge, // Product images as a list
              listPrice: items?.prices[0].DEFAULT,
              basePrice: items?.prices[0].DEFAULT,
          });
      })
  );
  console.log('product_arr', product_arr);
  return product_arr
}
  
  // newonw
  async getSprykerProductDetails(abstractId: string): Promise<any> {
    const product_arr: any[] = [];
    const endpoint = `abstract-products/${abstractId}?include=abstract-product-image-sets%2Cabstract-product-prices%2Cconcrete-product-availabilities%2Cproduct-labels%2Cproduct-options%2Cproduct-reviews%2Cproduct-measurement-units%2Csales-units%2Cbundled-products%2Cproduct-offers`;
    // return this.fetchFromEndpoint(endpoint);
    const response = await this.fetchFromEndpoint(endpoint);
    // console.log("abstract",response)
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
    "productName":response.data.attributes.name,
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

    // console.log("dataresponse12345567", dataresponse);
    dataresponse.map(async (item: any) => {
      // console.log("item", item?.attributes?.sku ,"result", item?.price?.attributes?.prices[1]?.netAmount);
      const listPrice = item?.price?.attributes?.prices[1]?.netAmount;
      const discountPrice = item?.price?.attributes?.price;
      const discountPercent = Math.round(
        ((listPrice - discountPrice) / listPrice) * 100
      );
      skuresponse.push({
         
        sku: item?.attributes?.sku,
        skuname: item?.attributes?.name,
        dimensions: " ",
        available: item?.availability?.attributes?.availability,
        availablequantity: item?.availability?.attributes?.quantity,
        listPriceFormated: item?.price?.attributes?.prices[0].currency.symbol+ (listPrice?listPrice/100:discountPrice/100),
        listPrice: listPrice?listPrice:discountPrice,
        bestPriceFormated: item?.price?.attributes?.prices[0].currency.symbol+ discountPrice/100,
        disocountPercent: discountPercent?discountPercent:0,
        bestPrice: item?.price?.attributes?.price,
        spotPrice: item?.price?.attributes?.prices[1]?.netAmount,
        specifications: item?.attributes?.attributes,
        image:
            item?.image?.attributes?.imageSets[0]?.images[0]?.externalUrlSmall,
        measures: " ",
        unitMultiplier: " ",
      });
    });
    return  skuresponse ;
  }

  async getSprykerProductBySubCategory(subCategoryId: any, count: any, page:any): Promise<any>{
    
    const endpoint = `catalog-search?${subCategoryId}&include=Concrete-products&${count == undefined ? `ipp=` : `ipp=${count}`}&${page == undefined ? `page=` : `page=${page}`}`;
    const response = await this.fetchFromEndpoint(endpoint);
    const data =  response.data[0];
    console.log('data',data)
    const product_arr:any[] = [];
    await Promise.all(
      data?.attributes?.abstractProducts?.map((items:any)=>{
        product_arr.push({
          skuId:items?.abstractSku,
         productName:items?.abstractName,
        productImage:items?.images[0].externalUrlLarge,
        productPrice: {
          "listPrice": items?.prices[0].grossAmount,
          "sellingPrice": items?.prices[0].DEFAULT,
        },

        })

      })

    )

    const pagination = {
      "count": response?.data[0]?.attributes?.pagination?.numFound,
      "totalPages": response?.data[0]?.attributes?.pagination?.maxPage,
      "perPage": response?.data[0]?.attributes?.pagination?.currentItemsPerPage,
      "next": response?.data[0]?.attributes?.pagination?.nextPage
    }

    return {"ProductData":product_arr,"pagination": pagination};
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
        productPrice: item.price,
        url: item.url,
        productImage: item.images[0]?.externalUrlLarge || null,
      };
    }) || [];
  
    return modifyData;
  }
  
  async getAllSprykerProducts(color:any, minprice:any, maxprice:any, sort:any, count:any, page: any): Promise<any> {
    const endpoint = `catalog-search?color=${color || ''}&price%5Bmin%5D=${minprice || ''}&price%5Bmax%5D=${maxprice || ''}&ipp=${count || ''}&page=${page || ''}&sort=${sort || ''}`;
    const response = await this.fetchFromEndpoint(endpoint);
    const data = response.data;
    console.log('data',data[0]?.attributes?.pagination);
    const paginations = data[0]?.attributes?.pagination
    const pages ={
        count: paginations.numFound,
        totalPages: paginations.maxPage,
        perPage: paginations.currentItemsPerPage,
        next: paginations.nextPage
      };
    const valueFacets = data[0]?.attributes?.valueFacets?.map((facet: any) => {
      return {
        name: facet.name,
        value: facet.values.map((value: any) => {
          return {
            id: value.value,
            quantity: value.doc_count,
            value: value.value,
          };
        }),
      };
    }) || [];
    const productData = data[0]?.attributes?.abstractProducts?.map((item: any) => {
      const listPrice = item?.prices[1]?.netAmount;
      const discountPrice = item?.price;
      const discountPercent = Math.round(
        ((listPrice - discountPrice) / listPrice) * 100
      );
      return {
        productId: item.abstractSku,
        sku_id: item.abstractSku,
        productName: item.abstractName,
        productImage: item.images[0]?.externalUrlLarge || null,
        productRating: "", // You can populate this if it's available in your data
        productPrice: {
          sellingPrice: discountPrice,
          listPrice: listPrice || discountPrice,
          discount: listPrice - discountPrice || 0,
          discountPercentage: discountPercent || 0,
        },
      };
    }) || [];
  
    return { productData , valueFacets, pagination: pages};
  
  }

  async login(username: string, password: string): Promise<any>{ 
    try{
    const type="password"  
    console.log("wew",username,password)
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('grant_type',type );
    // formData.append('client_id',"" );
    console.log(' form datA' , formData)
    try{
      const response =  await axios.post('http://localhost:9003/token',
      formData,
      {
        headers: {
          "Content-Type":"application/x-www-form-urlencoded",
        },
      }
      );
      const token = {customer_id:""  ,"bearerToken":response.data.access_token};
      console.log(' respnser  datA' , response)
      return token;
    }catch(error){
      return this.handleErrorResponse(error)
    }
    
  }
  catch (error) {
    console.log('err' ,error);
    return this.handleErrorResponse(error)
    throw error;
  }
    
  }


  async getCartId(authorizationHeader: any): Promise<any> {
    console.log('afrein',authorizationHeader);
    const endpoint = `/carts`;
    const response = this.cartFetchFromEndpoint(endpoint,authorizationHeader);
    const data = await response;
    console.log(data.data.length==0  ,"afreen")
    if(data.data.length == 1 ){
      var basketId =  data.data[0].id;
      return{"baskets":[{"basket_id":basketId}]}
    }
    else{
    return{"baskets":[{"basket_id":""}]};
    }
  }

  async cartFetchFromEndpoint(endpoint: string, authorization:string): Promise<any> {
    try {
    console.log("aaaashu")
      const response = await axios.get(
        `http://103.113.36.20:9003${endpoint}`,
        {
          headers: {
            'Authorization':`Bearer ${authorization}`,
          },
        },
      );
      console.log(response);
      return response.data;
    } catch (error) {
      console.log('error', error);
      return this.handleErrorResponse(error)
      throw error;
    }
  }

  async getSprykerCartDetails(cartId: any,authorizationHeader:any): Promise<any> {
    const endpoint = `/carts/${cartId}?include=items`;
    return this.cartdetailFetchFromEndpoint(endpoint,authorizationHeader);
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
      return this.handleErrorResponse(error)
      throw error;
    }
  }

  async cartdetailFetchFromEndpoint(endpoint: string, authorization:string): Promise<any> {
    try {
      const products : any[] = [];
      console.log(endpoint);
      const response = await axios.get(
        `http://103.113.36.20:9003${endpoint}`,
        {
          headers: {
            'Authorization':`Bearer ${authorization}`,
          },
        },
      );
      const data = response.data.included;
      console.log("mydata",data)
      await Promise.all(
        data.map(async (items:any)=>{
          const endpoint_two = `http://103.113.36.20:9003/concrete-products/${items.id}?include=concrete-product-image-sets`;
          const additional_data = await axios.get(endpoint_two);
          console.log("zayn",additional_data.data);
          products.push(
            {
              "itemId":items.id,
              "indexId":items.id,
              "productName":additional_data.data.data.attributes.name,
              "price":Number(items?.attributes?.calculations?.unitPrice/100),
              "sellingPrice":Number(items?.attributes?.calculations?.sumNetPrice/100),
              "quantity":items?.attributes?.quantity,
              "imageUrl":additional_data?.data?.included[0]?.attributes?.imageSets[0]?.images[0]?.externalUrlLarge
            }
          )
        })
      );

      const totals = response.data.data
      const totalizers = {
        "CartTotal": Number(totals?.attributes?.totals?.grandTotal/100),
      }

      const finalData = {"products":products,"totalizers":totalizers}
      // return response.data;
      return finalData;
    } catch (error) {
      console.log('error', error);
      return this.handleErrorResponse(error)
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
      return this.handleErrorResponse(error)
      throw error;
    }
  }

  async postAddCartItems(baskets_id: any, reqBody: any, authorization:any): Promise<any> {
    console.log('afren', reqBody);
    const endpoint = `carts/${baskets_id}/items`;
    var requestbody ={
      "data": {
          "type": "items",
          "attributes": {
              "sku": reqBody.itemId,
              "quantity": reqBody.quantity,
              "merchantReference": "MER000001",
              "salesUnit": {
                  "id": 0,
                  "amount": 0
              },
              "productOptions": [
                  null
              ]
          }
      }
  }
    const response = this.postCartFetchFromEndpoint(endpoint, requestbody,authorization);
    const data = await response;
    return data;
  }

  async postDeleteCartItems(
    basket_id: any,
    index_id: any,
    authorization:any,
  ): Promise<any> {
    console.log('afren', authorization);
    const endpoint = `carts/${basket_id}/items/${index_id}`;
    const response = this.cartDeleteFetchFromEndpoint(endpoint, authorization);
    const data = await response;
    return data;
  }

  async postUpdateCartItems(baskets_id: any, reqBody: any, authorization:any): Promise<any> {
    console.log('afren', reqBody);
    var requestbody ={
      "data": {
          "type": "items",
          "attributes": {
              "sku": reqBody.indexId,
              "quantity": reqBody.quantity,
              "merchantReference": "MER000001",
              "salesUnit": {
                  "id": 0,
                  "amount": 0
              },
              "productOptions": [
                  null
              ]
          }
      }
  }
  console.log("bodyyy",requestbody)
    const endpoint = `carts/${baskets_id}/items/${reqBody.itemId}`;
    const response = this.patchCartFetchFromEndpoint(endpoint,requestbody,authorization);
    const data = await response;
    return data;
  }

  async postCartFetchFromEndpoint(
    endpoint: string,
    reqBody: any,
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
      return this.handleErrorResponse(error)
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
      return this.handleErrorResponse(error)
      throw error;
    }
  }
  
  async patchCartFetchFromEndpoint(
    endpoint: any,
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
      return this.handleErrorResponse(error)
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

async getSprykerUsersData(customerId: any, authorization: any): Promise<any> {
  const endpoint = `/customers/${customerId}/addresses`;
  const response = this.cartFetchFromEndpoint(endpoint, authorization);
  const apiResponse = await response;
  const endpoint2 = `/customers`
  const newData = await this.cartFetchFromEndpoint(endpoint2,authorization)
  const EmailData = newData.data[0] || {};
  console.log('newData',newData);
  // Extract user profile data

  const userProfile = {
    // email: apiResponse.data[0].attributes.email || "soniaWagner@gmail.com",
    email: EmailData.attributes.email || apiResponse.data[0].attributes.email || "soniaWagner@gmail.com",
    firstName: apiResponse.data[0].attributes.firstName,
    lastName: apiResponse.data[0].attributes.lastName,
    phone: apiResponse.data[0].attributes.phone,
    gender: null, // You can set this value as needed
    dateOfBirth: null, // You can set this value as needed
  };
  // Extract available addresses data
  const availableAddresses = apiResponse.data.map((address:any) => ({
    addressType: address.attributes.addressType || "",
    receiverName: address.attributes.receiverName || "",
    addressId: address.id || "",
    postalCode: address.attributes.zipCode || "",
    city: address.attributes.city || "",
    state: address.attributes.address3 || "", // Assuming "address3" should be used for the state
    country: address.attributes.country || "",
    street: `${address.attributes.address1 || ""} ${address.attributes.address2 || ""}`,
    number: address.attributes.address2 || "N/A",
    neighborhood: null, // You can set this value as needed
    complement: null, // You can set this value as needed

  }));
  // Create the final formatted response
  const formattedData = {
    userProfile,
    availableAddresses,
  };
  console.log("object", formattedData);
  return formattedData;
}

async postCheckoutData(reqBody: any, authorization: any): Promise<any> {
  console.log('afren', reqBody);
  const endpoint = `checkout-data?include=shipments%2Cshipment-methods%2Caddresses%2Cpayment-methods%2Citems`;

  const response = this.postCartFetchFromEndpoint(
    endpoint,
    reqBody,
    authorization,
  );
  const data = await response;
  var shipment: any[] = [];
  var paymentMethod: any[] = [];   
  var address: any[] = [];
  data?.included?.map(async (item: any) => {
    if (item?.typ === 'shipments' || item?.type == 'shipment-methods') {
      shipment.push(item);
    } else if (item?.type == 'payment-methods') {
      paymentMethod.push(item);
    } else if (item?.type == 'addresses') {
      address.push(item);
    }
  });
  const dataresp = await {
    data: data.data,
    shipmet: shipment,
    paymentMethod: paymentMethod,
    address: address,
  };
  return data;
}

async postCheckoutorder(reqBody: any, authorization: any): Promise<any> {
  console.log('afren', reqBody);
  const endpoint =`checkout`;

  const response = this.postCartFetchFromEndpoint(
    endpoint,
    reqBody,
    authorization,
  );
  const data = await response;
  return data;
}



}
