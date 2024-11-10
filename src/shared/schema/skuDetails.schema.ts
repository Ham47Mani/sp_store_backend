import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

// -------------------------------- Feedbackers Documents ---------------------
@Schema({timestamps: true})
export class SkuDetails extends Document {
  @Prop({})
  skuName: string;

  @Prop({})
  price: number;

  @Prop({})
  validity: number; // In days

  @Prop({})
  lifetime: boolean;

  @Prop({})
  skuCode?: string

}

export const SkuDetailSchema = SchemaFactory.createForClass(SkuDetails);