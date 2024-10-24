import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from 'src/shared/schema/users';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Users.name, schema: UserSchema}]),
    MailModule
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
})
export class UsersModule {}
