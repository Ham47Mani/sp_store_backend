import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Orders } from "../schema/orders.schema";
import { Model } from "mongoose";



@Injectable()
export class OrderRepository {

  constructor (@InjectModel(Orders.name) private readonly orderModel: Model<Orders>) {}

  // Fetch Orders By Query
  async findOrders (query: any) {
    return await this.orderModel.find(query)
  }

  // Fetch One Order By Query
  async findOneOrder (query: any) {
    return await this.orderModel.find(query)
  }

  // Create An Order
  async createOrder (order: any) {
    const createdOrder = await this.orderModel.create(order);
    return createdOrder;
  }

}