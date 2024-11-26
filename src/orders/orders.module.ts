import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Orders, orderSchema } from 'src/shared/schema/orders.schema';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { ProductRepository } from 'src/shared/repositories/product.repository';
import { OrderRepository } from 'src/shared/repositories/order.repository';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/shared/guards/roles.guard';
import { Products, ProductsSchema } from 'src/shared/schema/products';
import { Users, UserSchema } from 'src/shared/schema/users';
import { License, licenseSchema } from 'src/shared/schema/license.schema';
import { AuthMiddleware } from 'src/shared/middlewares/auth.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Products.name, schema: ProductsSchema},
      {name: Users.name, schema: UserSchema},
      {name: License.name, schema: licenseSchema},
      {name: Orders.name, schema: orderSchema}
    ])
  ],
  controllers: [OrdersController],
  providers: [OrdersService, UserRepository, ProductRepository, OrderRepository,
      {
        provide: APP_GUARD,
        useClass: RoleGuard
      }
    ],
})
export class OrdersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: `/orders/webhook`, method: RequestMethod.POST }
      )
      .forRoutes(OrdersController);
  }
}
