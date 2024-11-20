import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";


// -------------------------------- Licence Documents ---------------------
@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})
export class License extends Document {
  @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Products'})
  product: string;

  @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'SkuDetails'})
  productSku: string;

  @Prop({required: true, type: String})
  licenseKey: string;

  @Prop({default: false, type: Boolean})
  isSold: boolean;

  @Prop({default: ''})
  orderId: string;
}

export const licenseSchema = SchemaFactory.createForClass(License);