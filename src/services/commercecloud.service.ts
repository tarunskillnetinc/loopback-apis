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

  async getSalesforceProductByCategory(refine: any): Promise<any> {
    const product_arr: any[] = [];
    const endpoint = `/s/Ref-VinodCSQT/dw/shop/v23_2/product_search?refine=cgid=${refine}&expand=images,prices&client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;
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
      return { ...data.data, bearerToken: data.headers.authorization };
    } else {
      return data?.data;
    };
  // return skuData;
}

  async addItems(cartId: any, requestBody: any, header: any): Promise<any>{
    try{
      const headers = {
        "Authorization":`Bearer ${header}`
      }

      const endpoint = `https://zzkd-003.dx.commercecloud.salesforce.com/s/Ref-VinodCSQT/dw/shop/v23_2/baskets/${cartId}/items?client_id=e0f74755-15bf-4575-8e0f-85d52b39a73b`;

      const response = await axios.post(endpoint,[requestBody],{headers});
      const data = await response;
      const response_data = data.data
      return response_data;
    }
    catch(error){
      console.log("error is",error);
    }
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
            Id: category.id,
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
}
