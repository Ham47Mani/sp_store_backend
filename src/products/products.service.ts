import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from 'src/shared/repositories/product.repository';

@Injectable()
export class ProductsService {
  // Inject the product repository
  constructor (@Inject(ProductRepository) private readonly productDB: ProductRepository) {}

  //--- Create a new product
  async create(createProductDto: CreateProductDto) {
    try {
      // Create Product in DB
      const createProductInDB = await this.productDB.create(createProductDto);
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

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
