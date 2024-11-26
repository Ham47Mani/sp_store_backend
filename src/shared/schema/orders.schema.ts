import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { OrderItem } from "./orderItem.schema";
import { orderStatus, paymentStatus } from "src/enums/orders.num";


// -------------------------------- Orders Documents ---------------------
@Schema({timestamps: true})
export class Orders extends Document {
  @Prop({required: true})
  orderId: string;

  @Prop({required: true, type: mongoose.Types.ObjectId, ref: 'Users'})
  user: string

  @Prop({required: true, type: Object})
  customerAddress: {
    line1: string,
    line2?: string,
    city?: string,
    state?: string,
    country: string,
    postal_code?: string
  }

  @Prop({required: true})
  customerPhoneNumber: string;

  @Prop({required: true})
  orderItems: OrderItem[];

  @Prop({required: true, type: Object})
  paymentInfo: {
    paymentMethod: string,
    paymentStatus: paymentStatus,
    paymentAmout: number,
    paymentDate: Date,
    paymentIntentId: string
  };

  @Prop({required: true, default: orderStatus.pending})
  orderStatus: orderStatus;

  @Prop({required: true, default: false})
  isOrderDelivered: boolean;

  @Prop({default: null})
  checkoutSessionId: string
}

export const orderSchema = SchemaFactory.createForClass(Orders); 