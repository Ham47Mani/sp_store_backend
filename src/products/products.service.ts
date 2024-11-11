import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from 'src/shared/repositories/product.repository';

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

  findOneProduct(id: string) {
    return `This action returns a #${id} product`;
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

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
