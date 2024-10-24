import { IsNotEmpty, IsString } from "class-validator";

// --- Type of Login user 'Login User DTO'
export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
