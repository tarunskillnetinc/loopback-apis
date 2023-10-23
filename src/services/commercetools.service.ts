import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import axios from "axios";
import {CommercetoolsDataSource} from '../datasources';


const token = "AkXVYKuBVsBIcfNRKoVg5MTF3M6GzMqs"
export class CommercetoolsProvider {
  constructor(
    // commercetools must match the name property in the datasource json file
    @inject('datasources.commercetools')
    protected dataSource: CommercetoolsDataSource = new CommercetoolsDataSource(),
  ) {}

  handleErrorResponse(error: any): any {
    return {
      "status": error?.response,
      "statusText": error?.response,
      "message": error?.response?.data
    };
  }

  async fetchFromEndpoint(endpoint: string): Promise<any> {
    try {
      console.log('endpoint', `${this.dataSource.settings.baseURL}/${endpoint}`);
      const response = await axios.get(
        `${this.dataSource.settings.baseURL}/${endpoint}`,
        {
          headers: {
            Accept: 'application/json',
            'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return this.handleErrorResponse(error);
    }
  }

  async searchByFacets(): Promise<any> {
    console.log('CT service: searchByFacets');
    const product_arr: any[] = [];
    const endpoint = `product-projections/search?limit=2&priceCurrency=USD&priceCountry=US&localeProjection=en-US`;
    try {
      const response = await this.fetchFromEndpoint(endpoint);
      console.log('response2', response);
      const results = response.results;
  
      results?.map((product: any) => {
        const priceInfo = product.masterVariant?.scopedPrice?.currentValue;
        const price = priceInfo ? priceInfo.centAmount / 100 : 0;
        console.log('price', price);
        product_arr.push({
          product_id: product.id,
          sku_id: product.masterVariant?.sku,
          product_name: product.name?.['en-US'],
          product_image: product.masterVariant?.images[0]?.url,
          product_price: {
            listPrice: price,
            sellingPrice: price, 
            discount: ' ',
          },
        });
      });
  
      return { productData: product_arr};
    } catch (error) {
      return this.handleErrorResponse(error);
    }
  }

  async productsByCategory(categoryId : any): Promise<any> {
    console.log('CT service: searchByFacets');
    const product_arr: any[] = [];
    const endpoint = `product-projections/search?filter.query=categories.id:"${categoryId}"&priceCurrency=USD&priceCountry=US&localeProjection=en-US`;
    try {
      const response = await this.fetchFromEndpoint(endpoint);
      console.log('response2', response);
      const results = response.results;
  
      results?.map((product: any) => {
        const priceInfo = product.masterVariant?.scopedPrice?.currentValue;
        const price = priceInfo ? priceInfo.centAmount / 100 : 0;
        console.log('price', price);
        product_arr.push({
          product_id: product.id,
          sku_id: product.masterVariant?.sku,
          product_name: product.name?.['en-US'],
          product_image: product.masterVariant?.images[0]?.url,
          product_price: {
            listPrice: price,
            sellingPrice: price, 
            discount: ' ',
          },
        });
      });
  
      return { productData: product_arr};
    } catch (error) {
      return this.handleErrorResponse(error);
    }
  }
  
  async getCommerceToolsProductById(pid: any): Promise<any> {
    try {
      const endpoint = `product-projections/${pid}?priceCurrency=USD&priceCountry=US&localeProjection=en-US`;
      const response = await this.fetchFromEndpoint(endpoint);
      const data = response; 
  
      const masterVariant = data.masterVariant;
      const masterSkuData = await this.processSku(masterVariant, data.name['en-US']);
      // Process the variant products
      const variantProducts = data.variants;
      const variantSkuData = await Promise.all(variantProducts.map((variant : any) => {
        return this.processSku(variant, data.name['en-US']);
      }));
      const variantFinalData = variantSkuData;
      console.log('variantSkuData', variantFinalData);
  
      return {
        productId: data.id,
        productName: data.name['en-US'],
        available: masterVariant.availability.isOnStock,
        description: data.description['en-US'],
        skus: [masterSkuData, ...variantFinalData],
      };
    } catch (error) {
      return this.handleErrorResponse(error);
    }
  }
  
  private async processSku(skuData: any, name : any): Promise<any> {
    const priceData = skuData.price;
    const attributes = skuData.attributes;
    const specifications: { [key: string]: any } = {}; // Define the type

    for (const attribute of attributes) {
      specifications[attribute.name] = attribute.value['en-US'];
    }
    
    return {
      sku: skuData.id,
      skuname: name,
      available: skuData.availability.isOnStock,
      availablequantity: skuData.availability.availableQuantity,
      listPriceFormated: "$" + priceData.value.centAmount / 100,
      listPrice: priceData.value.centAmount / 100,
      specifications: specifications, 
      bestPriceFormated: "$" + priceData.value.centAmount / 100, 
      discountPercent: ' ', 
      bestPrice: priceData.value.centAmount / 100, 
      spotPrice: ' ', 
      image: skuData.images[0].url,
    };
  }
  
  async addItems(baskets_id: any, requestBody: any): Promise<any> {
    try {
      const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    
      const version = await this.getCartVersion(baskets_id);
      const body = {
        "version" : version,
        "actions" : [ {
          "action" : "addLineItem",
          "productId" : `${requestBody?.productId}`,
          "variantId" : parseInt(requestBody?.itemId),
          "quantity" : parseInt(requestBody?.quantity)
        } ]
      };
    
      const endpoint = `https://api.us-central1.gcp.commercetools.com/skillnet-b2c/carts/${baskets_id}`;
      const jsonBody = JSON.stringify(body);
    
      const response = await axios.post(endpoint, jsonBody, { headers: headers });
    
      // Successful response
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error status:", error.response.status, error.response.statusText);
        console.error("Response data:", error.response.data);
      } else if (error.request) {
        console.error("No response received from the server. Request was made.");
      } else {
        console.error("An error occurred while setting up the request:", error.message);
      }
    
      return this.handleErrorResponse(error);
    }
  }

  async updateItems(baskets_id: any, requestBody: any): Promise<any> {
    try {
      const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    
      const version = await this.getCartVersion(baskets_id);
      const body = {
        "version" : version,
        "actions" : [ {
          "action" : "changeLineItemQuantity",
          "lineItemId" : `${requestBody?.indexId}`,
          "quantity" : parseInt(requestBody?.quantity)
        } ]
      };
    
      const endpoint = `https://api.us-central1.gcp.commercetools.com/skillnet-b2c/carts/${baskets_id}`;
      const jsonBody = JSON.stringify(body);
    
      const response = await axios.post(endpoint, jsonBody, { headers: headers });
    
      // Successful response
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error status:", error.response.status, error.response.statusText);
        console.error("Response data:", error.response.data);
      } else if (error.request) {
        console.error("No response received from the server. Request was made.");
      } else {
        console.error("An error occurred while setting up the request:", error.message);
      }
    
      return this.handleErrorResponse(error);
    }
  }

  async removeItems(baskets_id: any, itemId: any): Promise<any> {
    try {
      const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    
      const version = await this.getCartVersion(baskets_id);
      const body = {
        "version" : version,
        "actions" : [ {
          "action" : "changeLineItemQuantity",
          "lineItemId" : itemId,
          "quantity" : 0
        } ]
      };
    
      const endpoint = `https://api.us-central1.gcp.commercetools.com/skillnet-b2c/carts/${baskets_id}`;
      const jsonBody = JSON.stringify(body);
    
      const response = await axios.post(endpoint, jsonBody, { headers: headers });
    
      // Successful response
      const data = response.data;
      return data;
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error status:", error.response.status, error.response.statusText);
        console.error("Response data:", error.response.data);
      } else if (error.request) {
        console.error("No response received from the server. Request was made.");
      } else {
        console.error("An error occurred while setting up the request:", error.message);
      }
    
      return this.handleErrorResponse(error);
    }
  }
  
  private async getCartVersion(basket_id : any): Promise<any> {
    try {
      const endpoint = `carts/${basket_id}`;
      const response = await this.fetchFromEndpoint(endpoint);
      const data = response.version;
      return data;
    } catch (error) {
      return this.handleErrorResponse(error);
    }
  }

  async commerceToolsCategory(): Promise<any> {
    const endpoint = `categories?where=parent is not defined`;
    const response = await this.fetchFromEndpoint(endpoint);
  
    const parentCategories = response.results.map((category: any) => ({
      parent_Id: category.id,
      name: category.name['en-US'],
      hasChildren: false,
      children: [],
    }));
  
    return parentCategories;
  }

  async commerceToolsCollection(collectionId : any): Promise<any> {
    try {
      console.log("CT service: commerceToolsBestSelling");
      const endpoint = `product-selections/${collectionId}/products?expand=product`;
      const response = await this.fetchFromEndpoint(endpoint);
  
      const data = await response;
      console.log('data', data);
  
      const products = [] as Array<{
        ProductId: string;
        SkuId: string;
        ProductName: string;
        SkuImageUrl: string;
        listPrice: number;
        basePrice: number;
      }>;
  
      data.results.forEach((result: any) => {
        console.log('result', result);
        const product = result.product.obj;
        const masterVariant = product.masterData.current.masterVariant;
        const price = masterVariant.prices.find((price: any) => price.country === "US"); // Assuming you want the price in USD
  
        const productInfo = {
          ProductId: product.id,
          SkuId: masterVariant.sku,
          ProductName: product.masterData.current.name['en-US'],
          SkuImageUrl: masterVariant.images[0].url, // Assuming you want the first image
          listPrice: price.value.centAmount / 100, // Convert centAmount to dollars
          basePrice: price.value.centAmount / 100, // Convert centAmount to dollars
        };
        console.log('productInfo', productInfo);
        products.push(productInfo);
      });
  
      console.log('Products:', products); // Add this console log to see the products
  
      return products;
    } catch (error) {
      return this.handleErrorResponse(error);
    }
  }
  async commerceToolCartDetail(basketId : any): Promise<any> {
    console.log("CT service: commerceToolCartDetail");
    const endpoint = `carts/${basketId}`;
    const response = await this.fetchFromEndpoint(endpoint);
    try {
      const cart = await response;
  
      if (!cart || !cart.lineItems || !cart.lineItems.length) {
        return null;
      }
  
      const products = cart.lineItems.map((lineItem: any, index: number) => {
        const product = lineItem.variant;

  
        return {
          itemId: product.id,
          indexId: lineItem.id,
          productName: lineItem.name['en-US'],
          price: product.prices[0].value.centAmount / 100,
          sellingPrice: product.prices[0].value.centAmount / 100,
          quantity: lineItem.quantity,
          imageUrl: product.images[0].url,
        };
      });
  
      const totalizers = {
        CartTotal: cart.totalPrice.centAmount / 100,
      };
  
      const result = {
        products,
        totalizers,
      };
  
      return result;
    } catch (error) {
      // Handle errors
      return this.handleErrorResponse(error);
    }
  }
  
  
}
