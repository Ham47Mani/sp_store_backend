import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

// -------------------------------- Feedbackers Documents ---------------------
@Schema({timestamps: true})
export class Feedbackers extends Document {
  @Prop({})
  customerId: string;

  @Prop({})
  customerName: string;

  @Prop({})
  rating: number;

  @Prop({})
  feedbackMsg: string;
}

export const FeedbackerSchema = SchemaFactory.createForClass(Feedbackers);