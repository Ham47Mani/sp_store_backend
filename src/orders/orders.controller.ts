import { Body, Controller, Get, Headers, Param, Post, Query, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderCheckoutArrDto } from './dto/order-checkout.dto';
import { ValidateMongoID } from 'src/shared/pipes/ValidateMongoId.pipe';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAllOrders(@Query('status') status: string, @Req() req: any) {
    return await this.ordersService.findAllOrders(status, req.user);
  }

  @Get(':id')
  async findOneOrder(@Param('id', ValidateMongoID) id: string) {
    return await this.ordersService.findOneOrder(id);
  }

  @Post('/checkout')// --- Checkout Route handler
  async orderCheckOut(@Body() body: OrderCheckoutArrDto, @Req() req: any) {
    return await this.ordersService.orderCheckOut(body, req.user);
  }

  @Post('/webhook')
  async orderWebHook(@Body() rawBody:Buffer, @Headers('stripe-signature') sig: string) {
    return await this.ordersService.orderWebHook(rawBody, sig);
  }
}
