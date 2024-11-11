import { IsArray, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { baseType, categoryType, platformType } from "src/enums/products.enum";
import { SkuDetails } from "src/shared/schema/skuDetails.schema";

// ---------------- Create Products DTO ----------------
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  image?: string;

  @IsOptional()
  @IsObject()
  imageDetails?: Record<string, any>;

  @IsString()
  @IsNotEmpty()
  @IsEnum(categoryType)
  category: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(platformType)
  platformType: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(baseType)
  baseType: string;

  @IsString()
  @IsNotEmpty()
  productUrl: string;

  @IsString()
  @IsNotEmpty()
  downloadUrl: string;

  @IsArray()
  @IsNotEmpty()
  requirementSpecification: Record<string, any>[];

  @IsArray()
  @IsOptional()
  skuDetails: SkuDetails[];

  @IsArray()
  @IsNotEmpty()
  highlights: string[];
}
