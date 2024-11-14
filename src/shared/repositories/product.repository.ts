import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Products } from "../schema/products";
import { CreateProductDto } from "src/products/dto/create-product.dto";
import { GetProductQueryDto } from "src/products/dto/get-product-query.dto";
import qsToMongo from "qs-to-mongo";


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

  // Delete one document (Product) in collection
  async deleteOneProduct (id: string) {
    return this.productModel.findOneAndDelete({_id: id});
  }

  // Get all products groupBy
  async findProductsWithGroupBy () {
    const products = await this.productModel.aggregate([
      {
        $facet: {
          latestProducts: [{$sort: {createAt: -1}}, { $limit: 4 }],
          topRatedProducts: [{$sort: {avgRating: -1}}, {$limit: 8}]
        }
      }
    ]);
    return products
  }

  // Get all products with cretiria and options
  async find (query: GetProductQueryDto) {
    const {criteria, options} = qsToMongo(query);
    const sort: Record<string, 1 | -1> = options.sort as Record<string, 1 | -1> || {_id: 1};
    options.limit = Number(options.limit) || 10;
    options.skip = Number(options.skip) || 0

    if (criteria.search) {
      criteria.productName = new RegExp(query.search, "i");
      delete criteria.search;
    }
    
    const products = await this.productModel.aggregate([
      { $match: criteria },
      { $sort: sort },
      { $skip: options.skip },
      { $limit: options.limit}
    ]);
    const totalProductsCount = products.length;

    return {totalProductsCount, products};
  }
}