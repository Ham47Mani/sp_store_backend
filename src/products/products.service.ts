import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from 'src/shared/repositories/product.repository';
import { ValidateMongoID } from 'src/shared/pipes/ValidateMongoId.pipe';

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

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  // --- Update a Products
  async updateProduct(id: ValidateMongoID, updateProductDto: UpdateProductDto) {
    try {
      // Check if the "id" is a valid mongo id
    } catch (error) {
      console.log("Update product error : ", error);
      throw error;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
