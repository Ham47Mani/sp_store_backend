import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// --- Type of update user 'Update User DTO'
export class UpdateUserDto extends PartialType(CreateUserDto) {
  name?: string;
  oldPassword?: string;
  newPassword?: string
}
