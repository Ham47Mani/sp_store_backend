import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from 'src/shared/schema/users';
import { MailModule } from 'src/mail/mail.module';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/shared/guards/roles.guard';
import { AuthMiddleware } from 'src/shared/middlewares/auth.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Users.name, schema: UserSchema}]),
    MailModule
  ],
  controllers: [UsersController],
  providers: [
    UsersService, UserRepository, 
    {
      provide: APP_GUARD,
      useClass: RoleGuard
    }
  ],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(UsersController);
  }
}
