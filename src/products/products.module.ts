import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductRepository } from 'src/shared/repositories/product.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Products, ProductsSchema } from 'src/shared/schema/products';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/shared/guards/roles.guard';
import { Users, UserSchema } from 'src/shared/schema/users';
import { AuthMiddleware } from 'src/shared/middlewares/auth.middleware';
import { UserRepository } from 'src/shared/repositories/user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Products.name, schema: ProductsSchema},
      {name: Users.name, schema: UserSchema}
    ])
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductRepository, UserRepository,
    {
      provide: APP_GUARD,
      useClass: RoleGuard
    }
  ],
})
export class ProductsModule implements NestModule {
  configure (consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ProductsController);
  }
}
