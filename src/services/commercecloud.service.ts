import { inject, Provider } from "@loopback/core";
import { getService } from "@loopback/service-proxy";
import axios from "axios";
import { CommercecloudDataSource } from "../datasources";
import currencySymbol from "currency-symbol-map";
import { v4 as uuidv4 } from "uuid";


const shopName = "s/Ref-VinodCSQT";
export class CommercecloudService {
  constructor(
    // commercecloud must match the name property in the datasource json file
    @inject("datasources.commercecloud")
    protected dataSource: CommercecloudDataSource
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
      const response = await axios.get(
        `${this.dataSource.settings.baseURL}/${endpoint}`
      );
      return response.data;
    } catch (error) {
      return this.handleErrorResponse(error);
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
      return this.handleErrorResponse(error);
    }
  }
   
  async sfBestSelling(): Promise<any> {
    try {
        console.log("SFCC service: sfBestSelling");
        const endpoint = `/${shopName}/dw/shop/v23_2/product_search?refine=cgid%3Dnewarrivals&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b&expand=images%2Cprices%2Cavailability%2Cvariations`;
        const response = await this.fetchFromEndpoint(endpoint);

        const data = await response;

        return data.hits.map((hit: any) => ({
            ProductId: hit.product_id,
            skuId: hit.product_id,
            ProductName: hit.product_name,
            images: { image1: hit.image.link },
            listPrice: hit.price,
            basePrice: hit.price,
        }));
    } catch (error) {
      return this.handleErrorResponse(error);
    }
} // Tarun: deconstructed the code to simpolify the extraction and to make it more consise.

// async getSalesforceProductByCategory(categoryId: any): Promise<any> {
//   try {
//       const product_arr: any[] = [];
//       const endpoint = `/${shopName}/dw/shop/v23_2/product_search?refine=cgid=${categoryId}&expand=images,prices&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
//       console.log("endpoint123", endpoint);
//       const response = await this.fetchFromEndpoint(endpoint);
//       const value = response.refinements;
//       console.log(value);
//       const valueFacets = this.getRefinementValue(value);
//       const data = response;
//       response?.hits?.map((items: any) => {
//           product_arr.push({
//               product_id: items?.product_id,
//               sku_id: items?.product_id,
//               product_name: items?.product_name,
//               product_image: items?.image.dis_base_link,
//               product_price: {
//                   listPrice: items?.price,
//                   sellingPrice: null,
//                   discount: null,
//               },
//           });
//       });
//       console.log("data", product_arr);

//       // return product_arr;
//       return { ProductData: product_arr, valueFacets: valueFacets };
//   } catch (error) {
//     return this.handleErrorResponse(error);
//   }
// }

async getSalesforceProductByCategory(categoryId: any): Promise<any> {
  try {
    const product_arr: any[] = [];
    const endpoint = `/${shopName}/dw/shop/v23_2/product_search?refine=cgid=${categoryId}&expand=images,prices&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
    const response = await this.fetchFromEndpoint(endpoint);
    const value = response.refinements;
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
    return { ProductData: product_arr, valueFacets: valueFacets };
  } catch (error) {
    return this.handleErrorResponse(error);
  }
}

private getRefinementValue(response: any): any {
  const value_arr: any[] = [];
  response?.map((item: any) => {
    value_arr.push({
      name: item.label,
      value: item?.values?.map((valueObj: any) => valueObj.label),
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
  sortbyname: any,
  productsPerPage: any,
  page: any
): Promise<any> {
  console.log('SFCC service: searchByFacets');
  const product_arr: any[] = [];
  const startValue = (Number(page)-1)*productsPerPage;
  const endpoint = `/${shopName}/dw/shop/v23_2/product_search?refine=cgid=${category}&refine_1=c_refinementColor=${color==undefined?"":color}&refine_2=price=${minprice==undefined && maxprice==undefined?"":("("+minprice+".."+maxprice+")")}&refine_3=c_size=${size==undefined?"":size}&sort=${sortbyname==undefined?"":sortbyname}&${productsPerPage == undefined ? "count=" : `count=${productsPerPage}`}&${page == undefined ? "start=" : `start=${startValue}`}&expand=images,prices&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
  try {
    const response = await this.fetchFromEndpoint(endpoint);
    const value = response.refinements;
    const valueFacets = this.getRefinementValue(value);
    response?.hits?.map((items: any) => {
      product_arr.push({
        product_id: items?.product_id,
        sku_id: items?.product_id,
        product_name: items?.product_name,
        product_image: items?.image?.dis_base_link,
        product_price: {
          listPrice: items?.price,
          sellingPrice: ' ',
          discount: ' ',
        },
      });
    });
    const totalPages = productsPerPage == undefined ? 0 : (response.total % productsPerPage === 0 ? 0 : 1) + Math.floor(response.total / productsPerPage);
    const pagination = {
      "totalPages": totalPages,
      "currentIndex": page == undefined ? 1 : Number(page),
      "perPage": productsPerPage == undefined ? response.count : Number(productsPerPage),
      "next": page<totalPages ? Number(page)+1 : 0,
      "previous": page>1 ? Number(page)-1 : 0
    }
    console.log("dwadawinside this")
    return { ProductData: "", valueFacets: valueFacets, pagination: pagination,wad:"ww" };
  } catch (error) {
    return this.handleErrorResponse(error);
  }
}

async getSalesforceProductBysubCategory(subcategoryId: any): Promise<any> {
  try {
    const product_arr: any[] = [];
    const endpoint = `/${shopName}/dw/shop/v23_2/product_search?refine=cgid=${subcategoryId}&expand=images,prices&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
    const response = await this.fetchFromEndpoint(endpoint);
    const value = response.refinements;
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
    return { ProductData: product_arr, valueFacets: valueFacets };
  } catch (error) {
    return this.handleErrorResponse(error);
  }
}

async getsalesForceProductById(pid: any): Promise<any> {
  try {
    const endpoint = `/${shopName}/dw/shop/v23_2/products/${pid}?null=null&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b&expand=images%2Cprices%2Cavailability%2Cvariations%2Cpromotions%2Cset_products`;
    const response = await this.fetchFromEndpoint(endpoint);
    const data = response; // Parse JSON response
    const variantProductsData = await this.getVariationData(data?.variants);
    return {
      productId: data?.id,
      name: data?.name,
      available: data?.inventory?.orderable,
      description: data?.long_description,
      skus: variantProductsData,
    };
  } catch (error) {
    return this.handleErrorResponse(error);
  }
}

private async getVariationData(response: any): Promise<any[]> {
  const skuData: any = [];

  await Promise.all(
    response?.map(async (variantProducts: any) => {
      const endpoint = `/${shopName}/dw/shop/v23_2/products/${variantProducts?.product_id}?null=null&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b&expand=images%2Cprices%2Cavailability%2Cvariations%2Cpromotions%2Cset_products`;
      const response = await this.fetchFromEndpoint(endpoint);
      skuData.push({
        sku: response?.id,
        skuname: response?.name,
        dimensions: ' ',
        available: response?.inventory?.orderable,
        availablequantity: response?.inventory?.ats,
        listPriceFormated: currencySymbol(response?.currency) + response?.price,
        listPrice: response?.price,
        bestPriceFormated:
          currencySymbol(response?.currency) + response?.price_per_unit,
        discountPercent: '',
        bestPrice: response?.price_per_unit,
        spotPrice: '',
        images: {
          image1: response?.image_groups[0]?.images[0]?.link,
        },
      });
    })
  );
  return skuData;
}

async postsalesForceLogin(reqBody: any): Promise<any> {
  const endpoint = `${shopName}/dw/shop/v23_2/customers/auth?client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
  var reqBody = reqBody;
  var basicAuth = btoa(`${reqBody.email}:${reqBody.password}`);
  console.log('reqBody', basicAuth);
  try {
    const response = await this.fetchPostFromEndpoint(endpoint, basicAuth);
    const data = response; // Parse JSON response
    console.log('responseservice123', data);
    if (data.status == 200) {
      const tokenParts = data.headers.authorization.split(' ');
      return { ...data.data, bearerToken: tokenParts[1] };
    } else {
      return data;
    }
  } catch (error) {
    return this.handleErrorResponse(error);
  }
}

  async addItems(baskets_id: any, requestBody: any, header: any): Promise<any>{
    try{
      const headers = {
        "Authorization":`Bearer ${header}`
      }

      const endpoint = `https://zzkd-003.dx.commercecloud.salesforce.com/${shopName}/dw/shop/v23_2/baskets/${baskets_id}/items?client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;

      const response = await axios.post(endpoint,[requestBody],{headers});
      const data = await response;
      const response_data = data.data
      return response_data;
    }
    catch(error){
      console.log("error is",error);
      return {
        "status":error?.response.status,
        "statusText":error?.response?.statusText,
        "message":error?.response?.data}
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
        return {
          "status":error?.response.status,
          "statusText":error?.response?.statusText,
          "message":error?.response?.data}
      }
    }

    async getSalesforceProductItems(baskets_id:any,header:any): Promise<any>{
      const endpoint = `${shopName}/dw/shop/v23_2/baskets/${baskets_id}?&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
      console.log(endpoint,"endpoitn");
      const response = await this.cartFetchFromEndpoint(endpoint,header);
      try{
      const data = response?.product_items;
      const products: any[] = [];

      const productDataPromise = data?.map(async (items:any)=>{
        const product_data:any = {
          "itemId": items?.item_id,
          "productName": items?.product_name,
          "price":items?.base_price,
          "sellingPrice":items?.price,
          "quantity":items?.quantity
        }
        const endpoint_two = `${shopName}/dw/shop/v23_2/products/${items.product_id}/images`;
        const product_images_response = this.cartFetchFromEndpoint(endpoint_two,header);
        const product_data_images = this.transformResponse(product_images_response);
        const images_datas = await product_data_images
        product_data["imageUrl"]= images_datas;
        products.push(product_data);
      })
      await Promise.all(productDataPromise);
      // Sort the products array by quantity in ascending order
      products.sort((a, b) => a.price - b.price);
       console.log("shubham",response) 
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
      catch(error){
        console.log("error is");
        return response;
      }
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
        return {
          "status":error?.response.status,
          "statusText":error?.response?.statusText,
          "message":error?.response?.data}
      }
    }
    async updateSalesforceProductItems(baskets_id:any,items_id:any,requestBody:any,header:any):Promise<any>{
      const endpoint = `${shopName}/dw/shop/v23_2/baskets/${baskets_id}/items/${items_id}`;
      console.log(endpoint,"updateSalesforceProductItems");
      const response = await this.cartUpdateFromEndpoint(endpoint,requestBody,header);
      const data = response;
      console.log('datas',data)
      return response;
    }
    async getSalesForceCategory(): Promise<any> {
      const product_arr: any[] = [];
      const endpoint = `/${shopName}/dw/shop/v23_2/categories/root?levels=6&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
    
      try {
        const response = await this.fetchFromEndpoint(endpoint);
        const categories = response.categories;
    
        if (Array.isArray(categories) && categories.length > 0) {
          const mapCategory = (category: any, isChild: boolean = false): any => {
            const children = Array.isArray(category.categories)
              ? category.categories.map((childCategory: any) => mapCategory(childCategory, true))
              : [];
    
            const idField = isChild ? "Id" : "parent_Id"; 
    
            return {
              [idField]: category.id,
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

  async removeItem(basket_Id:any, requestBody:any, bearer:any):Promise<any>{
    const endpoint = `/${shopName}/dw/shop/v23_2/baskets/${basket_Id}/items/${requestBody.item_id}?client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
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
      return {
        "status":error?.response.status,
        "statusText":error?.response?.statusText,
        "message":error?.response?.data}
    }
  }

  //Function to create cart:
  async createCart(bearer: any):Promise<any>{
    const endpoint = `${shopName}/dw/shop/v23_2/baskets?client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
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
      return {
        "status":error?.response.status,
        "statusText":error?.response?.statusText,
        "message":error?.response?.data}

    }
  }

  //Function to get customer cart on behalf of customer id:
  async customerCart(customerId:any, bearer:any){
    const endpoint = `${shopName}/dw/shop/v23_2/customers/${customerId}/baskets?client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
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
      return this.handleErrorResponse(error)
    }
  }

  //Function get user details:
  async getUserDetails(customers_id:any,header:any): Promise<any>{
    const endpoint =`${shopName}/dw/shop/v23_2/customers/${customers_id}/addresses`
    const response = await this.cartFetchFromEndpoint(endpoint,header)
    console.log("responseamber",response)
    const data = response?.data;
    const userProfile: any[] = [];
    const endpoint_two = `${shopName}/dw/shop/v23_2/customers/${customers_id}`
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

  
  //Function crud customer address start
  async addCustomerAddress(bearer: any,customerId:any, requestBody: any): Promise<any> {
    const endpoint = `${shopName}/dw/shop/v23_2/customers/${customerId}/addresses?client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
    const header = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearer}`,
    };

    requestBody.address_id=uuidv4()
    console.log("addressbody",requestBody)
    const response = await this.confirm(endpoint, header, requestBody);

    if (response.error) {
      return response; // You can decide how to handle errors
    }
    console.log("addressresponse",response)
    return response;
  }
  
  async removeCustomerAddressEndpoint(endpoint:any,header:any){
    try{
      console.log("headers",header);
      const response = await axios.delete(`${this.dataSource.settings.baseURL}/${endpoint}`, {
        headers: header
      });
      return response.data;
    }
    catch(error){
      return this.handleErrorResponse(error)
    }
  }

  async removeCustomerAddress(bearer: any,customerId:any,address_name:any): Promise<any> {
    const endpoint = `${shopName}/dw/shop/v23_2/customers/${customerId}/addresses/${address_name}?client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
    const header = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearer}`,
    };
    const response = await this.removeCustomerAddressEndpoint(endpoint, header);

    if (response.error) {
      return response; // You can decide how to handle errors
    }
    console.log("addressresponse",response)
    return response;
  }
  
  async updateCustomerAddressEndpoint(endpoint:any,requestBody:any,header:any){
    try{
      console.log("headers",header);
      const response = await axios.patch(`${this.dataSource.settings.baseURL}/${endpoint}`,
      requestBody,
      {
        headers: header
      });
      return response.data;
    }
    catch(error){
      return this.handleErrorResponse(error)
    }
  }
  async updateCustomerAddress(bearer: any,requestBody:any,customerId:any,address_name:any): Promise<any> {
    const endpoint = `${shopName}/dw/shop/v23_2/customers/${customerId}/addresses/${address_name}?client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
    const header = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearer}`,
    };
    const response = await this.updateCustomerAddressEndpoint(endpoint,requestBody,header);

    if (response.error) {
      return response; // You can decide how to handle errors
    }
    console.log("addressresponse",response)
    return response;
  }
  //Function crud customer address end

  //Function to get order details:
  async getOrderDetails(
    customers_id: any,
    header: any,
  ): Promise<any> {
    const endpoint = `${shopName}/dw/shop/v23_2/customers/${customers_id}/orders`;
    const response = await this.cartFetchFromEndpoint(endpoint, header);
    const data = response?.data == undefined ? response : response.data;
    const promises = data[0].product_items.map(async (items:any)=>{
      const endpoint_two = `${shopName}/dw/shop/v23_2/products/${items.product_id}/images`;
      const data = await this.cartFetchFromEndpoint(endpoint_two,header);
      console.log("newdata",data.image_groups[0].images[0]);
      items["imageUrl"] = data.image_groups[0].images[0].dis_base_link;
    })
    await Promise.all(promises);
    return data;
  }

  //Function to get payment details:
  async getSaleforcePaymentMethodDetails(baskets_id:any,header:any): Promise<any>{
    const endpoint = `${shopName}/dw/shop/v23_2/baskets/${baskets_id}/payment_methods?&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
    const response = await this.cartFetchFromEndpoint(endpoint,header);
    const data = response;
    return data
  }

  // function shippment update detail
  async shippmentUpdateFromEndpoint(endpoint:string,header:string):Promise<any>{
    var body={
      id:"EUR001"
    }
    try{
      const response = await axios.put(`${this.dataSource.settings.baseURL}/${endpoint}`,
      body,  
      {
        headers:{
          'Authorization':`Bearer ${header}`,
        },
      },
      );
      return response.data;
    }catch(error){
      console.log(error)
      return {
        "status":error?.response.status,
        "statusText":error?.response?.statusText,
        "message":error?.response?.data}
    }
  }
  async updateSalesForceshippment(baskets_id:any,header:any):Promise<any>{
    const endpoint = `${shopName}/dw/shop/v23_1/baskets/${baskets_id}/shipments/me/shipping_method`;
    console.log(endpoint,"updateSalesforceProductItems");
    const response = await this.shippmentUpdateFromEndpoint(endpoint,header);
    const data = response;
    console.log('datas',data)
    return response;
  } 

  async newshippmentUpdateFromEndpoint(endpoint:string,requestBody:any,header:string):Promise<any>{
    var body=requestBody
    try{
      const response = await axios.put(`${this.dataSource.settings.baseURL}/${endpoint}`,
      body,  
      {
        headers:{
          'Authorization':`Bearer ${header}`,
        },
      },
      );
      return response.data;
    }catch(error){
      console.log(error)
      return this.handleErrorResponse(error);

    }
  }
  async newupdateSalesForceshippment(baskets_id:any,shipment_id:any,requestBody:any,header:any):Promise<any>{
    const endpoint = `s/Ref-VinodCSQT/dw/shop/v23_1/baskets/${baskets_id}/shipments/${shipment_id}/shipping_method`;
    console.log(endpoint,"updateSalesforceProductItems");
    const response = await this.newshippmentUpdateFromEndpoint(endpoint,requestBody,header);
    const data = response;
    console.log('datas',data)
    return response;
  } 
  // shippment update end

  // function shipping address update detail
  async addressUpdateFromEndpoint(endpoint:string,header:string):Promise<any>{
    var body={
      "address1": "Ocapi",
      "address2": "Demo",
      "city": "Indore",
      "country_code": "CN",
      "first_name": "Ocapi",
      "full_name": "Ocapi Demo",
      "id": "OcapiD",
      "last_name": "Demo",
      "phone": "123456789",
      "postal_code": "45200",
      "state_code": "45200",
      "title": "OcapiDemo"
    }
    try{
      const response = await axios.put(`${this.dataSource.settings.baseURL}/${endpoint}`,
      body,  
      {
        headers:{
          'Authorization':`Bearer ${header}`,
        },
      },
      );
      return response.data;
    }catch(error){
      console.log(error)
      return {
        "status":error?.response.status,
        "statusText":error?.response?.statusText,
        "message":error?.response?.data}
    }
  }
  async updateSalesForceaddress(baskets_id:any,header:any):Promise<any>{
    const endpoint = `${shopName}/dw/shop/v23_1/baskets/${baskets_id}/shipments/me/shipping_address?client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
    console.log(endpoint,"updateSalesforceProductItems");
    const response = await this.addressUpdateFromEndpoint(endpoint,header);
    const data = response;
    console.log('datas',data)
    return response;
  } 

  async newaddressUpdateFromEndpoint(endpoint:string,requestBody:any,header:string):Promise<any>{
    var body1={
      "address1": "Ocapi",
      "address2": "Demo",
      "city": "Indore",
      "country_code": "CN",
      "first_name": "Ocapi",
      "full_name": "Ocapi Demo",
      "id": "OcapiD",
      "last_name": "Demo",
      "phone": "123456789",
      "postal_code": "45200",
      "state_code": "45200",
      "title": "OcapiDemo"
    }
    var body=requestBody
    try{
      const response = await axios.put(`${this.dataSource.settings.baseURL}/${endpoint}`,
      body,  
      {
        headers:{
          'Authorization':`Bearer ${header}`,
        },
      },
      );
      return response.data;
    }catch(error){
      console.log(error)
      return this.handleErrorResponse(error);

    }
  }
  async newupdateSalesForceaddress(baskets_id:any,shipment_id:string,requestBody:any,header:any):Promise<any>{
    const endpoint = `s/Ref-VinodCSQT/dw/shop/v23_1/baskets/${baskets_id}/shipments/${shipment_id}/shipping_address?client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
    console.log(endpoint,"updateSalesforceProductItems");
    const response = await this.newaddressUpdateFromEndpoint(endpoint,requestBody,header);
    const data = response;
    console.log('datas',data)
    return response;
  } 
  // function shipping adddress end

  // function shipping address update detail
  async billingaddressUpdateFromEndpoint(endpoint:string,header:string):Promise<any>{
    var body={
      "address1": "Ocapi",
      "address2": "Demo",
      "city": "Indore",
      "country_code": "CN",
      "first_name": "Ocapi",
      "full_name": "Ocapi Demo",
      "id": "OcapiD",
      "last_name": "Demo",
      "phone": "123456789",
      "postal_code": "45200",
      "state_code": "45200",
      "title": "OcapiDemo"
    }
    try{
      const response = await axios.put(`${this.dataSource.settings.baseURL}/${endpoint}`,
      body,  
      {
        headers:{
          'Authorization':`Bearer ${header}`,
        },
      },
      );
      return response.data;
    }catch(error){
      console.log(error)
      return {
        "status":error?.response.status,
        "statusText":error?.response?.statusText,
        "message":error?.response?.data}
    }
  }
  async updateSalesForcebillingaddress(baskets_id:any,header:any):Promise<any>{
    const endpoint = `${shopName}/dw/shop/v23_1/baskets/${baskets_id}/billing_address?client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
    console.log(endpoint,"updateSalesforceProductItems");
    const response = await this.billingaddressUpdateFromEndpoint(endpoint,header);
    const data = response;
    console.log('datas',data)
    return response;
  } 

  async newbillingaddressUpdateFromEndpoint(endpoint:string,requestBody:any,header:string):Promise<any>{
    var body1={
      "address1": "Ocapi",
      "address2": "Demo",
      "city": "Indore",
      "country_code": "CN",
      "first_name": "Ocapi",
      "full_name": "Ocapi Demo",
      "id": "OcapiD",
      "last_name": "Demo",
      "phone": "123456789",
      "postal_code": "45200",
      "state_code": "45200",
      "title": "OcapiDemo"
    }
    var body=requestBody
    try{
      const response = await axios.put(`${this.dataSource.settings.baseURL}/${endpoint}`,
      body,  
      {
        headers:{
          'Authorization':`Bearer ${header}`,
        },
      },
      );
      return response.data;
    }catch(error){
      console.log(error)
      return this.handleErrorResponse(error);

    }
  }
  async newupdateSalesForcebillingaddress(baskets_id:any,requestBody:any,header:any):Promise<any>{
    const endpoint = `s/Ref-VinodCSQT/dw/shop/v23_1/baskets/${baskets_id}/billing_address?client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
    console.log(endpoint,"updateSalesforceProductItems");
    const response = await this.newbillingaddressUpdateFromEndpoint(endpoint,requestBody,header);
    const data = response;
    console.log('datas',data)
    return response;
  } 
  // function shipping adddress end


  async confirmPayment(basketId: any,bearer: any,requestBody: any):Promise<any>{
    const endpoint = `${shopName}/dw/shop/v23_2/baskets/${basketId}/payment_instruments?client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
    const header = {
       'Content-Type': 'application/json',
        'Authorization':`Bearer ${bearer}`
    }
    const response = await this.confirm(endpoint,header,requestBody);
    console.log("AAfreeeen",response)
    console.log("my response",response?.data)

    return response;
  }

  // async confirm(endpoint:any,header:any,requestBody: any){
  //   try{
  //     // console.log('headers are',header);
  //     const response = await axios.post(`${this.dataSource.settings.baseURL}/${endpoint}`,requestBody,
  //     {
  //       headers:header
  //     })
  //     return response.data;
  //   }
  //   catch(error){
  //     console.log(error.response);
  //     return {status:error?.response?.status,statusText:error?.response?.data,message:error?.response}
  //   }
  // }

  // async placeOrder(bearer: any,requestBody: any):Promise<any>{
  //   const endpoint = `${shopName}/dw/shop/v23_2/orders?client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
  //   const header = {
  //      'Content-Type': 'application/json',
  //       'Authorization':`Bearer ${bearer}`
  //   }
  //   const response = await this.confirm(endpoint,header,requestBody);
  //   console.log("responseorderconfirm",response)
  //   const result = JSON.stringify(response?.data)
  //   console.log("my response",result);

  //   return result;
  // }


  async confirm(endpoint: any, header: any, requestBody: any) {
    try {
      const response = await axios.post(
        `${this.dataSource.settings.baseURL}/${endpoint}`,
        requestBody,
        {
          headers: header,
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        return {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        };
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Request error:", error.message);
      }
      return { error: "An error occurred while making the request." };
    }
  }
  async placeOrder(bearer: any, requestBody: any): Promise<any> {
    const endpoint = `${shopName}/dw/shop/v23_2/orders?client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
    const header = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearer}`,
    };
    const response = await this.confirm(endpoint, header, requestBody);
    if (response.error) {
      console.error("Error occurred during placeOrder:", response.error);
      return response; // You can decide how to handle errors
    }
    console.log("Response from placeOrder:", response);
    return response;
  }

  async getShiipingmethod(baskets_id:any,shipment_id:any,header:any):Promise<any>{
    const endpoint = `${shopName}/dw/shop/v23_1/baskets/${baskets_id}/shipments/${shipment_id}/shipping_methods?client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
    try{
      const response = await axios.get(`${this.dataSource.settings.baseURL}/${endpoint}`,
      {
        headers:{
          'Authorization':`Bearer ${header}`,
        },
      })
      console.log("ashuu",response)
      return response?.data;
    }
    catch(error){
      console.log(error.response);
      return this.handleErrorResponse(error)
    }
  }

  async searchByQuery(
    query: string,
    color: any,
    size: any,
    minprice: any,
    maxprice: any,
    sortbyname: any
  ): Promise<any> {
    console.log('SFCC service: searchByFacets');
    const product_arr: any[] = [];
    const endpoint = `/${shopName}/dw/shop/v23_2/product_search?q=${query}&refine_1=c_refinementColor=${color == undefined ? '' : color}&refine_2=price=${minprice == undefined && maxprice == undefined ? '' : '(' + minprice + '..' + maxprice + ')'}&refine_3=c_size=${size == undefined ? '' : size}&sort=${sortbyname == undefined ? '' : sortbyname}&expand=images,prices&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
    try {
      const response = await this.fetchFromEndpoint(endpoint);
      const value = response.refinements;
      const valueFacets = this.getRefinementValue(value);
      response?.hits?.map((items: any) => {
        product_arr.push({
          product_id: items?.product_id,
          sku_id: items?.product_id,
          product_name: items?.product_name,
          product_image: items?.image?.dis_base_link,
          product_price: {
            listPrice: items?.price,
            sellingPrice: ' ',
            discount: ' ',
          },
        });
      });
      return { ProductData: product_arr, valueFacets: valueFacets };
    } catch (error) {
      return this.handleErrorResponse(error);
    }
  }
}
