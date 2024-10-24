import { InjectModel } from "@nestjs/mongoose";
import { Users } from "../schema/users";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepository {
  constructor (@InjectModel(Users.name) private readonly userModel: Model<Users>) {}

  // Find One Document in DB Collection
  async findOne (query: any) {
    return await this.userModel.findOne(query)
  }

  // Create a new Document in DB Collection
  async create (query: Record<string, any>) {
    return await this.userModel.create(query);
  }

  // Update One Document in DB Collection
  async updateOne(query: any, data: Record<string, any>) {
    return await this.userModel.updateOne(query, data)
  }

}