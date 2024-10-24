import { IsBoolean, IsIn, isNotEmpty, IsNotEmpty, IsOptional, isString, IsString } from "class-validator";
import { userTypes } from "src/enums/users.enums";

// --- Type of new user 'User DTO'
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsIn([userTypes.ADMIN, userTypes.CUSTOMER])
  type: string;

  @IsString()
  @IsOptional()
  secretToken?: string

  @IsBoolean()
  @IsOptional()
  isVerified?: boolean
}
