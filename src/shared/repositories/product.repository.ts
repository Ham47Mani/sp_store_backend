import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Products } from "../schema/products";
import { CreateProductDto } from "src/products/dto/create-product.dto";


@Injectable()
export class ProductRepository {

  constructor ( @InjectModel(Products.name) private readonly productModel: Model<Products> ){}

  // Create a new document (Product) in collection
  async createProduct (product: CreateProductDto) {
    const createdProduct = await this.productModel.create(product);
    return createdProduct;
  }

  // Update one document (Product) in collection
  async updateOneProduct (query: any, data: Record<string, any>) {
    return await this.productModel.findOneAndUpdate(query, data, {new: true});
  }

  // Get one document (Product) in collection
  async findOneProduct (id: string) {
    return await this.productModel.findById(id);
  }
}