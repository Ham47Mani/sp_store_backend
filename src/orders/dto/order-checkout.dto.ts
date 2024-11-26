import { ArrayMinSize, IsArray, IsMongoId, IsNotEmpty, IsNumber, IsString, MinLength, ValidateNested } from "class-validator";


// -------------------- Order Checkout DTO --------------------
export class OrderCheckoutDto {
  @IsNotEmpty()
  @IsString()
  skuPriceId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  skuId: string
}

// -------------------- Order Checkout Array DTO --------------------
export class OrderCheckoutArrDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({each: true})
  @ArrayMinSize(1)
  checkoutDetails: OrderCheckoutDto[];
}