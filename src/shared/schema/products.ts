import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { baseType, categoryType, platformType } from "src/enums/products.enum";
import { Feedbackers, FeedbackerSchema } from "./feedbackers.schema";
import { SkuDetails, SkuDetailSchema } from "./skuDetails.schema";

// -------------------------------- Products Documents ---------------------
@Schema({timestamps: true})
export class Products extends Document {
  @Prop({required: true})
  productName: string;

  @Prop({required: true})
  description: string;

  @Prop({default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWz9tftw9qculFH1gxieWkxL6rbRk_hrXTSg&s"})
  image?: string;

  @Prop({required: true, enum: [categoryType.applicationSoftware, categoryType.operatingSystem]})
  category: string;

  @Prop({required: true, enum: [platformType.android, platformType.ios, platformType.linux, platformType.mac, platformType.windows]})
  platformType: string;

  @Prop({required: true, enum: [baseType.computer, baseType.mobile]})
  baseType: string;

  @Prop({required: true})
  productUrl: string;

  @Prop({required: true})
  downloadUrl: string;

  @Prop()
  avgRating: number;

  @Prop([{type: FeedbackerSchema }])
  feedbackDetails: Feedbackers[];

  @Prop([{type: SkuDetailSchema}])
  skuDetails: SkuDetails[];

  @Prop({type: Object})
  imageDetails: Record<string, any>;

  @Prop()
  requirementSpecification: Record<string, any>[];

  @Prop()
  highlights: string[];
}

export const ProductsSchema = SchemaFactory.createForClass(Products);
