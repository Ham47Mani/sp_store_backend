import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

// ---------------- Product Sku DTO ----------------
export class ProductSkuDto {
  @IsNotEmpty()
  @IsString()
  skuName: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  validty: number; // In days

  @IsNotEmpty()
  @IsBoolean()
  lifetime: boolean;

  @IsOptional()
  @IsString()
  skuCode?: string
}

// ---------------- Product Sku DTO Array ----------------
export class ProductSkuArrayDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({each: true})
  @IsNotEmpty()
  skus: ProductSkuDto[];
}