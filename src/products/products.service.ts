import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from 'src/shared/repositories/product.repository';
import { GetProductQueryDto } from './dto/get-product-query.dto';
import qsToMongo from 'qs-to-mongo';

@Injectable()
export class ProductsService {
  // Inject the product repository
  constructor (@Inject(ProductRepository) private readonly productDB: ProductRepository) {}

  //--- Create a new product
  async createProduct(createProductDto: CreateProductDto) {
    try {
      // Create Product in DB
      const createProductInDB = await this.productDB.createProduct(createProductDto);
      return {
        message: "Product created successfully",
        success: true,
        result: createProductInDB
      }
    } catch (error) {
      console.log("Create new products error : ", error);
      throw error;      
    }
  }

  // --- Get All Products
  async findAllProducts(query: GetProductQueryDto) {
    try {
      let callForHomePage: boolean = false;
      if (query.homePage)
        callForHomePage = true;

      delete query.homePage;
      const {options, links} = qsToMongo(query);

      if (callForHomePage) {
        const products = await this.productDB.findProductsWithGroupBy();

        return {
          message: products.length > 0 ? `Products fetched succesfully` : `No products founds`,
          success: true,
          result: {
            latestProducts: products[0].latestProducts,
            topRatedProducts: products[0].topRatedProducts,
          }
        }
      } else {
        const {totalProductsCount, products} = await this.productDB.find(query);
        console.log("Links    : ", links);
        
        return {
          message: products.length > 0 ? `Products fetched succesfully` : `No products founds`,
          success: true,
          result: {
            metadata: {
              skip: options.skip || 0,
              limit: options.limit || 10,
              total: totalProductsCount,
              page: options.limit ? Math.ceil(totalProductsCount / options.limit) : 1,
              links: links("/", totalProductsCount),
            },
            products
          }
        }
      }
    } catch (error) {
      console.log("Get all products error");
      throw error;
    }
  }

  //--- Get one product with ID
  async findOneProduct(id: string) {
    try {
      // Check if the product exists
      const product = await this.productDB.findOneProduct(id); 
      if (!product)
        throw new NotFoundException("This product not exists");

      return {
        message: `Product id [${id}] fetched successufully`,
        success: true,
        result: product
      }
    } catch (error) {
      console.log("Find One Product by ID Error");
      throw error;
    }
  }

  // --- Update a Products
  async updateProduct(id: string, updateProductDto: UpdateProductDto) { 
    try {
      // Check if the product exists
      const product = await this.productDB.findOneProduct(id);
      if (!product)
        throw new NotFoundException("This product not exists");

      // Update the product
      const updatedProduct = await this.productDB.updateOneProduct({_id: id}, updateProductDto);
      
      return {
        message: "Product Updated Successfully",
        suces: true, 
        result: updatedProduct
      }

    } catch (error) {
      console.log("Update product error : ", error);
      throw error;
    }
  }

  // --- Remove a Products
  async removeProduct(id: string) {
    try {
      // Check if the product exists
      const product = await this.productDB.deleteOneProduct(id);
      if (!product)
        throw new NotFoundException("This product not exists");

      return {
        message: `Product id [${id}] Deleted`,
        success: true,
        result: product
      }
    } catch (error) {
      console.log("Remove product error");
      throw error;
    }
  }
}
