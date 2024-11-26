import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";


// -------------------------------- Orders Documents ---------------------
@Schema({timestamps: true})
export class OrderItem extends Document {
  @Prop({required: true, type: mongoose.Types.ObjectId, ref: 'Products'})
  productId: string;

  @Prop({required: true})
  productName: string;

  @Prop({required: true, type: mongoose.Types.ObjectId, ref: 'SkuDetails'})
  skuId: string;
  
  @Prop({required: true})
  skuPriceId: number

  @Prop({required: true})
  quantity: number

  @Prop({required: true})
  price: number

  @Prop({required: true})
  lifetime: boolean;

  @Prop({required: true})
  validity: number
}