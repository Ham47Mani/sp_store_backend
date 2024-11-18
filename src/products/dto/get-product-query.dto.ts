import { IsEnum, IsOptional, IsString } from "class-validator";
import { baseType, categoryType, platformType } from "src/enums/products.enum";


// ---------------- Get Product Query DTO ----------------
export class GetProductQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(categoryType)
  category?: string;

  @IsOptional()
  @IsEnum(platformType)
  platformType?: string;

  @IsOptional()
  @IsEnum(baseType)
  baseType?: string;

  @IsOptional()
  @IsString()
  homePage?: string;
}