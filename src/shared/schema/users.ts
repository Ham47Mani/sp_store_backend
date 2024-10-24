import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { userTypes } from "src/enums/users.enums";


@Schema({timestamps: true})
export class Users extends Document {
  @Prop({required: true})
  name: string

  @Prop({required: true})
  email: string

  @Prop({required: true})
  password: string

  @Prop({default: false})
  isVerified: boolean

  @Prop({default: null})
  otp: string

  @Prop({default: null})
  otpExpiry: Date

  @Prop({required: true, enum: userTypes})
  type: string
}

export const UserSchema = SchemaFactory.createForClass(Users);