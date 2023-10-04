import { inject, Provider } from "@loopback/core";
import { getService } from "@loopback/service-proxy";
import axios from "axios";
import { CommercecloudDataSource } from "../datasources";
import currencySymbol from "currency-symbol-map";

export class CommercecloudService {
  constructor(
    // commercecloud must match the name property in the datasource json file
    @inject("datasources.commercecloud")
    protected dataSource: CommercecloudDataSource
  ) {}

  async fetchFromEndpoint(endpoint: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.dataSource.settings.baseURL}/${endpoint}`
      );
      return response.data;
    } catch (error) {
      console.log("error123",error)
      throw error;
    }
  }

  async fetchPostFromEndpoint(
    endpoint: string,
    basicAuth: string
  ): Promise<any> {
    var data = {
      type: "credentials",
    };
    var headers = {
      "Content-Type": "application/json",
      Authorization: `Basic ${basicAuth}`,
    };
    try {
      const response = await axios.post(
        `${this.dataSource.settings.baseURL}/${endpoint}`,
        data,
        { headers: headers }
      );
      return response;
    } catch (error) {
      return error;
    }
  }
   
  async sfBestSelling(): Promise<any> {
    const endpoint = `/s/Ref-VinodCSQT/dw/shop/v23_2/product_search?refine=cgid%3Dnewarrivals&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b&expand=images%2Cprices%2Cavailability%2Cvariations`;
    const response = await this.fetchFromEndpoint(endpoint);
    // console.log('response', response.hits)
  
    const data = await response;
    console.log('res', data);
  
    const products: any[] = [];
  
    for (const hit of data.hits) {
      const ProductId = hit.product_id;
      const ProductName = hit.product_name;
      const SkuImageUrl = hit.image.link; // Extract image URL
      const listPrice = hit.price; // Extract the price and name it as listPrice
      const basePrice = hit.price;
  
      console.log('Product ID:', ProductId);
      console.log('Product Name:', ProductName);
      console.log('Product Image:', SkuImageUrl);
      console.log('List Price:', listPrice);
  
      products.push({
        ProductId,
        skuId: ProductId,
        ProductName,
        SkuImageUrl,
        listPrice,
        basePrice
      });
    }
  
    console.log('Products:', products);
  
    return products;
  }
  async getSalesforceProductByCategory(categoryId: any): Promise<any> {
    const product_arr: any[] = [];
    const endpoint = `/s/Ref-VinodCSQT/dw/shop/v23_2/product_search?refine=cgid=${categoryId}&expand=images,prices&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
    console.log("endpoint123",endpoint)
    const response = await this.fetchFromEndpoint(endpoint);
    const value = response.refinements;
    console.log(value);
    const valueFacets = this.getRefinementValue(value);
    const data = response;
    response?.hits?.map((items: any) => {
      product_arr.push({
        product_id: items?.product_id,
        sku_id: items?.product_id,
        product_name: items?.product_name,
        product_image: items?.image.dis_base_link,
        product_price: {
          listPrice: items?.price,
          sellingPrice: null,
          discount: null,
        },
      });
    });
    console.log("data", product_arr);

    // return product_arr;
    return { ProductData: product_arr, valueFacets: valueFacets };
  }

  async getSalesforceProductBysubCategory(subcategoryId: any): Promise<any> {
    const product_arr: any[] = [];
    const endpoint = `/s/Ref-VinodCSQT/dw/shop/v23_2/product_search?refine=cgid=${subcategoryId}&expand=images,prices&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
    console.log("endpoint123",endpoint)
    const response = await this.fetchFromEndpoint(endpoint);
    const value = response.refinements;
    console.log(value);
    const valueFacets = this.getRefinementValue(value);
    const data = response;
    response?.hits?.map((items: any) => {
      product_arr.push({
        product_id: items?.product_id,
        sku_id: items?.product_id,
        product_name: items?.product_name,
        product_image: items?.image.dis_base_link,
        product_price: {
          listPrice: items?.price,
          sellingPrice: null,
          discount: null,
        },
      });
    });
    console.log("data", product_arr);

    // return product_arr;
    return { ProductData: product_arr, valueFacets: valueFacets };
  }

  private getRefinementValue(response: any): any {
    const value_arr: any[] = [];
    console.log("aafreeee", response);
    response?.map((item: any) => {
      value_arr.push({
        name: item.label,
        value: item?.values?.map((valueObj: any) => {
          // Create a new object without the "doc_count" property
          // const { doc_count, ...newValueObj } = valueObj;
          const newValueObj = valueObj.label;
          return newValueObj;
        }),
      });
    });
    return value_arr;
  }

  async searchByFacets(
    category: string,
    color: any,
    size: any,
    minprice: any,
    maxprice: any,
    sortbyprice: any,
    sortbyname: any
  ): Promise<any> {
    const product_arr: any[] = [];
    const endpoint = `/s/Ref-VinodCSQT/dw/shop/v23_2/product_search?refine=cgid=${category}&refine_1=c_refinementColor=${color==undefined?"":color}&refine_2=price=${minprice==undefined && maxprice==undefined?"":("("+minprice+".."+maxprice+")")}&refine_3=c_size=${size==undefined?"":size}&sort=${sortbyname==undefined?"":sortbyname}&expand=images,prices&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
    console.log("endpoint1234",endpoint)
    const response = await this.fetchFromEndpoint(endpoint);
    const value = response.refinements;
    console.log(value);
    const valueFacets = this.getRefinementValue(value);
    // const data = response;
    console.log("responsehits123",response)

    response?.hits?.map((items: any) => {
      product_arr.push({
        product_id: items?.product_id,
        sku_id: items?.product_id,
        product_name: items?.product_name,
        product_image: items?.image?.dis_base_link,
        product_price: {
          listPrice: items?.price,
          sellingPrice: " ",
          discount: " ",
        },
      });
    });
    console.log("data", product_arr);

    // return product_arr;
    return { ProductData: product_arr, valueFacets: valueFacets };
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
  async postsalesForceLogin(reqBody: any): Promise<any> {
    const endpoint = `s/Ref-VinodCSQT/dw/shop/v23_2/customers/auth?client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
    var reqBody = reqBody;
    var basicAuth = btoa(`${reqBody.email}:${reqBody.password}`);
    console.log("reqBody", basicAuth);
    const response = await this.fetchPostFromEndpoint(endpoint, basicAuth);
    const data = await response; // Parse JSON response
    console.log("responseservice123", data);
    if (data.status == 200) {
      const tokenParts = data.headers.authorization.split(" ")
      return { ...data.data, bearerToken: tokenParts[1] }
    } else {
      return data?.data;
    };
  // return skuData;
}

  async addItems(baskets_id: any, requestBody: any, header: any): Promise<any>{
    try{
      const headers = {
        "Authorization":`Bearer ${header}`
      }

      const endpoint = `https://zzkd-003.dx.commercecloud.salesforce.com/s/Ref-VinodCSQT/dw/shop/v23_2/baskets/${baskets_id}/items?client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;

      const response = await axios.post(endpoint,[requestBody],{headers});
      const data = await response;
      const response_data = data.data
      return response_data;
    }
    catch(error){
      console.log("error is",error);
    }
  }

  async cartFetchFromEndpoint(endpoint: string,header:string): Promise<any> {
      try {
        console.log("response")
        const response = await axios.get(`${this.dataSource.settings.baseURL}/${endpoint}`,
      {
        headers: {
          'Authorization':`Bearer ${header}`,
          // 'Content-Type':'application/json'
        },
      },
      );
      console.log("responsesss",response)
        return response.data;
      } catch (error) {
        console.log(error)
        throw error;
      }
    }

    async getSalesforceProductItems(baskets_id:any,header:any): Promise<any>{
      const endpoint = `s/Ref-VinodCSQT/dw/shop/v23_2/baskets/${baskets_id}?&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
      console.log(endpoint,"endpoitn");
      const response = await this.cartFetchFromEndpoint(endpoint,header);
      const data = response.product_items;
      const products: any[] = [];
      const productDataPromise = data.map(async (items:any)=>{
        const product_data:any = {
          "itemId": items.item_id,
          "productName": items.product_name,
          "price":items.base_price,
          "sellingPrice":items.price,
          "quantity":items.quantity
        }
        const endpoint_two = `s/Ref-VinodCSQT/dw/shop/v23_2/products/${items.product_id}/images`;
        const product_images_response = this.cartFetchFromEndpoint(endpoint_two,header);
        const product_data_images = this.transformResponse(product_images_response);
        const images_datas = await product_data_images
        product_data["imageUrl"]= images_datas;
        products.push(product_data);
      })
      await Promise.all(productDataPromise);
      const cartTotals = {
        CartTotal: response.order_total,
        Items: response.product_total,
        Discounts: response.order_total - response.product_total,
        Shipping: response.shipping_total,
        Tax: response.tax_total,  
      }
      const finalData = {
        "products":products,
        "totalizers":cartTotals
      }
      return finalData;
    }
    // Transformation function
    async transformResponse(inputData:any) {
      const response = await inputData;
      const image_url = response.image_groups[0].images[0].link;
      return image_url;
    } 
    async cartUpdateFromEndpoint(endpoint:string,_requestBody:any, header:string):Promise<any>{
      try{
        console.log("hiiihhhh",endpoint,_requestBody,header)
        const response = await axios.patch(`${this.dataSource.settings.baseURL}/${endpoint}`,
        _requestBody,  
        {
          headers:{
            'Authorization':`Bearer ${header}`,
          },
          // body:JSON.stringify(_requestBody),
        },
        );
        console.log(response, "responsetttt")
        console.log("responssssesss",response.data)
        return response.data;
      }catch(error){
        console.log(error)
        throw error;
      }
    }
    async updateSalesforceProductItems(baskets_id:any,items_id:any,requestBody:any,header:any):Promise<any>{
      const endpoint = `s/Ref-VinodCSQT/dw/shop/v23_2/baskets/${baskets_id}/items/${items_id}`;
      console.log(endpoint,"updateSalesforceProductItems");
      const response = await this.cartUpdateFromEndpoint(endpoint,requestBody,header);
      const data = response;
      console.log('datas',data)
      return response;
    }
  async getSalesForceCategory(): Promise<any> {
    const product_arr: any[] = [];
    const endpoint = `/s/Ref-VinodCSQT/dw/shop/v23_2/categories/root?levels=6&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
  
    try {
      const response = await this.fetchFromEndpoint(endpoint);
      const categories = response.categories;
  
      if (Array.isArray(categories) && categories.length > 0) {
        const mapCategory = (category: any): any => {
          const children = Array.isArray(category.categories)
            ? category.categories.map((childCategory: any) => mapCategory(childCategory))
            : [];
  
          return {
            parent_Id: category.id,
            name: category.name,
            hasChildren: children.length > 0,
            children,
          };
        };

        categories.forEach((category: any) => {
          product_arr.push(mapCategory(category));
        });
      }
  
      console.log('data', product_arr);
      return product_arr;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  async removeItem(cart_Id:any, requestBody:any, bearer:any):Promise<any>{
    const endpoint = `/s/Ref-VinodCSQT/dw/shop/v23_2/baskets/${cart_Id}/items/${requestBody.item_id}?client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
    const header = {
      'Authorization':`Bearer ${bearer}`
    }
    const response = this.deleteCartItem(endpoint,header);
    return response;
  }
  async deleteCartItem(endpoint:any,header:any){
    try{
      console.log("headers",header);
      const response = await axios.delete(`${this.dataSource.settings.baseURL}/${endpoint}`, {
        headers: header
      });
      return response.data;
    }
    catch(error){
      throw error;
    }
  }

  //Function to create cart:
  async createCart(bearer: any):Promise<any>{
    const endpoint = 's/Ref-VinodCSQT/dw/shop/v23_2/baskets?client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b';
    const header = {
       'Content-Type': 'application/json',
        'Authorization':`Bearer ${bearer}`
    }
    const response = this.createUserCart(endpoint,header);
    const data = await response
    console.log("thisis response",data);
    return response;
  }
  async createUserCart(endpoint:any,header:any){
    var body={}
    try{
      console.log('headers are',header);
      const response = await axios.post(`${this.dataSource.settings.baseURL}/${endpoint}`,body,{
        headers: header
      })
      return response.data;
    }
    catch(error){
      console.log(error.response.data);
    }
  }

  //Function to get customer cart on behalf of customer id:
  async customerCart(customerId:any, bearer:any){
    const endpoint = `s/Ref-VinodCSQT/dw/shop/v23_2/customers/${customerId}/baskets?client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
    const header = {
      'Content-Type': 'application/json',
       'Authorization':`Bearer ${bearer}`
   }
    const response = this.getCustomerCart(endpoint, header);
    const data = await response;
    return data;
  }
  async getCustomerCart(endpoint:any, header:any){
    try{
      const response = await axios.get(`${this.dataSource.settings.baseURL}/${endpoint}`,{
        headers: header
      });
      console.log("custome123",response);
      return response.data;
    }
    catch(error){
      console.log("error is", error);
    }
  }

  //Function get user details:
  async getUserDetails(customers_id:any,header:any): Promise<any>{
    const endpoint =`s/Ref-VinodCSQT/dw/shop/v23_2/customers/${customers_id}/addresses`
    const response = await this.cartFetchFromEndpoint(endpoint,header)
    const data = response.data;
    const userProfile: any[] = [];
    const endpoint_two = `s/Ref-VinodCSQT/dw/shop/v23_2/customers/${customers_id}`
    const response_two =  await this.cartFetchFromEndpoint(endpoint_two,header)

    for (const items of data) {
    const userData: any = {
      email:response_two.email || '',
      firstName: items.first_name,
      lastName: items.last_name,
      receiverName: items.full_name,
      addressId: items.address1 + items.address2,
      postalCode: items.postal_code,
      city: items.city,
      state: items.state_code,
      country: items.country_code,
      street: items.street_code || '',
      addressNumber: items.address_id,
      phone: items.phone
    };
    userProfile.push(userData);
    };
    return { userProfile };
  }

  //Function Order Details:
  async getOrderDetails(customers_id:any, header:any): Promise<any>{
    const endpoint =`s/Ref-VinodCSQT/dw/shop/v23_2/customers/${customers_id}/orders`
    const response = await this.cartFetchFromEndpoint(endpoint,header)
    console.log(response,"response")
    const data = response.data;
    return data;
  }

  //Function to get payment details:
  async getSaleforcePaymentMethodDetails(baskets_id:any,header:any): Promise<any>{
    const endpoint = `s/Ref-VinodCSQT/dw/shop/v23_2/baskets/${baskets_id}/payment_methods?&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
    const response = await this.cartFetchFromEndpoint(endpoint,header);
    const data = response;
    return data
  }


  async confirmPayment(clientId: any,basketId: any,bearer: any,requestBody: any):Promise<any>{
    const endpoint = `s/Ref-VinodCSQT/dw/shop/v23_2/baskets/${basketId}/payment_instruments?client_id=${clientId}`;
    const header = {
       'Content-Type': 'application/json',
        'Authorization':`Bearer ${bearer}`
    }
    const response = await this.confirm(endpoint,header,requestBody);
    console.log("AAfreeeen")
    console.log("my response",response?.data)

    return response?.data;
  }

  async confirm(endpoint:any,header:any,requestBody: any){
    try{
      // console.log('headers are',header);
      const response = await axios.post(`${this.dataSource.settings.baseURL}/${endpoint}`,requestBody,
      {
        headers:header
      })
      return response;
    }
    catch(error){
      console.log(error.response);
    }
  }
}
