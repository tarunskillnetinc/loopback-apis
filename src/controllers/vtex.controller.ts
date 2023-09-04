import { get, response, param } from '@loopback/rest';
import { inject } from '@loopback/core';
import { VtexService } from '../services';

export class VtexController {
  constructor(
    @inject('services.VtexService') private vtexService: VtexService,
  ) {}

  @get('/get-vtex-category-tree')
  @response(200, {
    description: 'Get VTEX category tree from the external API',
  })
  async getVtexCategoryTree(): Promise<any> {
    try {
      const vtexCategoryTree = await this.vtexService.getVtexCategoryTree();
      return vtexCategoryTree;
    } catch (error) {
      throw error;
    }
  }
  @get('/vtex-product/{productId}')
  @response(200, {
    description: 'Get VTEX product details from the external API',
  })
  async getVtexProductDetails(@param.path.string('productId') productId: string): Promise<any> {
    try {
      const vtexProductDetails = await this.vtexService.getVtexProductDetails(productId);
      return vtexProductDetails;
    } catch (error) {
      throw error;
    }
  }
  // @get('/vtex-transformed/{productId}')
  // @response(200, {
  //   description: 'Get VTEX product details from the external API',
  // })
  // async gettransformedVtexProductDetails(@param.path.string('productId') productId: string): Promise<any> {
  //   try {
  //     const vtexProductDetails = await this.vtexService.getTransformedVtexProductDetails(productId);
  //     return vtexProductDetails;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // @get('/vtex-best-selling-products')
  // @response(200, {
  //   description: 'Get VTEX best selling products from the external API',
  // })
  // async getBestSellingProducts(): Promise<any> {
  //   try {
  //     const bestSellingProducts = await this.vtexService.getBestSellingProducts();
  //     return bestSellingProducts;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  @get('get-vtex-product-by-id/{pid}')
  @response(200, {
    description: "Get Vtex Products by their respective Id's",
  })
  async getProductById(@param.path.string('pid') pid: string):Promise<any>{
    try{
      const data = await this.vtexService.getProductById(pid)
      const response = await data;
      console.log('danish',response);
      return response;
    }
    catch(error){
      throw error;
    }
  }


  @get('/vtex-collection/{collectionId}')
      @response(200, {
        description: 'Get VTEX product details from the external API',
      })
      async getVtexCollection(@param.path.string('collectionId') collectionId: string): Promise<any> {
        try {
          const vtexProductDetails = await this.vtexService.getVtexCollection(collectionId);
          return vtexProductDetails;
        } catch (error) {
          throw error;
        }
      }
      @get('/vtex-plp')
      @response(200, {
        description: 'Get VTEX product details from the external API',
      })
      async getVtexPlp(@param.path.string('categoryId') categoryId: string): Promise<any> {
        try {
          const vtexProductListingPage = await this.vtexService.getVtexProducListingPage(categoryId);
          return vtexProductListingPage;
        } catch (error) {
          throw error;
        }
      }
      @get('/vtex-cartDetail')
      @response(200, {
        description: 'Get VTEX cart details from the external API',
      })
      async getVtexCartData(): Promise<any> {
        try {
          const vtexCartDetail = await this.vtexService.getVtexCartDetails();
          return vtexCartDetail;
        } catch (error) {
          throw error;
        }
      }
  @get('/vtex-transformed/{productId}')
  @response(200, {
    description: 'Get VTEX product details from the external API',
  })
  async gettransformedVtexProductDetails(@param.path.string('productId') productId: string): Promise<any> {
    try {
      const vtexProductDetails = await this.vtexService.getTransformedVtexProductDetails(productId);
      return vtexProductDetails;
    } catch (error) {
      throw error;
    }
  }

  @get('/vtex-best-selling-products')
  @response(200, {
    description: 'Get VTEX best selling products from the external API',
  })
  async getBestSellingProducts(): Promise<any> {
    try {
      const bestSellingProducts = await this.vtexService.getBestSellingProducts();
      return bestSellingProducts;
    } catch (error) {
      throw error;
    }
  }
  @get('/vtex-plp/{categoryId}')

      @response(200, {

        description: 'Get VTEX product details from the external API',

      })

      async getVtexPlp(@param.path.string('categoryId') categoryId: string): Promise<any> {

        try {

          console.log("categoryID",categoryId)

          const vtexProductListingPage = await this.vtexService.getVtexProducListingPage(categoryId);

          return vtexProductListingPage;

        } catch (error) {

          throw error;

        }

      }
  @get('/get-vtex-category-tree-loopback')

  @response(200, {

    description: 'Get VTEX category tree from the external API',

  })

  async getVtexCategoryTreeloopback(): Promise<any> {

    try {

      const vtexCategoryTree = await this.vtexService.getVtexCategoryTreeloopback();

      return vtexCategoryTree;

    } catch (error) {

      throw error;

    }

  }
}
