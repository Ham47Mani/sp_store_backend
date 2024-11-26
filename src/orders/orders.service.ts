import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OrderCheckoutArrDto } from './dto/order-checkout.dto';
import { OrderRepository } from 'src/shared/repositories/order.repository';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { ProductRepository } from 'src/shared/repositories/product.repository';
import { userTypes } from 'src/enums/users.enums';

@Injectable()
export class OrdersService {

  constructor (
    @Inject(OrderRepository) private readonly orderDb: OrderRepository,
    @Inject(ProductRepository) private readonly productDb: ProductRepository,
    @Inject(UserRepository) private readonly userDb: UserRepository,
  ) {}

  // --- Fetch All Orders
  async findAllOrders(status: string, reqUser: Record<string, any>) {
    try {
      // Get User From DB
      const user = await this.userDb.findById(reqUser._id);
      if (!user)
        throw new NotFoundException('This User does not exists');

      // Create a query
      const query = {} as Record<string, any>;
      if (user.type === userTypes.CUSTOMER)
        query.userId = user._id.toString();
      if (status)
        query.status = status

      // Fetch the orders
      const orders = await this.orderDb.findOrders(query);

      return {
        message: "Fetch all order sucessfully",
        success: true,
        result: orders
      }

    } catch (error) {
      console.log("Find All Order Error");
      throw error;
    }
  }

  // --- Fetch One Order
  async findOneOrder(id: string) {
    try {
      // Fetch the order
      const order = await this.orderDb.findOrders({_id: id});

      return {
        message: "Fetch One order sucessfully",
        success: true,
        result: order
      }

    } catch (error) {
      console.log("Find One Order Error");
      throw error;
    }
  }

  // --- Order Checkout
  async orderCheckOut(body: OrderCheckoutArrDto, user: Record<string, any>) {
    try {
      const lineItems = [];
      const cartItems = body.checkoutDetails;
      for(const item of cartItems) {
        const itemAreInStock = await this.productDb.findLicense({productSku: item.skuId, isSold: false});
        if (itemAreInStock.length > item.quantity) {
          lineItems.push({
            price: item.skuPriceId,
            quantity: item.quantity,
            adjustable_quantity: {
              enabled: true,
              maximum: 5,
              minimum: 1
            }
          });
        }
      };

      if (lineItems.length === 0)
        throw new BadRequestException('This Product are not available right now');

      // Strp Session
      /*
      const session = await this.stripeClient.checkout.sessions.create({
        line_items: lineItems,
        metadata: {
          userId: user._id.toString()
        },
        mode: 'payment',
        billing_address_collection: 'required',
        phone_number_collection: {
          enabled: true
        },
        customer_email: user.email,
        success_url: process.env.STRIP_SUCCESS_URL, // http://localhost:3000/order-success
        cancel_url: process.env.STRIP_CANCEL_URL // http://localhost:3000/order-cencel
      })
      */

      return {
        message: "Payment checkout session successfully created",
        sucess: true,
        result: null // session.url
      }
    } catch (error) {
      console.log(`Order Checkout service method errro: ${error.message}`);
      throw error
    }
  }

  // --- WebHook
  async orderWebHook (rawBody: Buffer, sig: string) {
    // try {
    //   let event;
    //   try {
    //     event = this.stripeClient.webhooks.constructEvent(
    //       rawBody,
    //       sig,
    //       config.get('stripe.webhookSecret'),
    //     );
    //   } catch (err) {
    //     throw new BadRequestException('Webhook Error:', err.message);
    //   }

    //   if (event.type === 'checkout.session.completed') {
    //     const session = event.data.object as Stripe.Checkout.Session;
    //     const orderData = await this.createOrderObject(session);
    //     const order = await this.create(orderData);
    //     if (session.payment_status === paymentStatus.paid) {
    //       if (order.orderStatus !== orderStatus.completed) {
    //         for (const item of order.orderedItems) {
    //           const licenses = await this.getLicense(orderData.orderId, item);
    //           item.licenses = licenses;
    //         }
    //       }
    //       await this.fullfillOrder(session.id, {
    //         orderStatus: orderStatus.completed,
    //         isOrderDelivered: true,
    //         ...orderData,
    //       });
    //       this.sendOrderEmail(
    //         orderData.customerEmail,
    //         orderData.orderId,
    //         `${config.get('emailService.emailTemplates.orderSuccess')}${
    //           order._id
    //         }`,
    //       );
    //     }
    //   } else {
    //     console.log('Unhandled event type', event.type);
    //   }
    // } catch (error) {
    //   throw error;
    // }
  }

  async fullfillOrder( checkoutSessionId: string, updateOrderDto: Record<string, any>) {
    // try {
    //   return await this.orderDB.findOneAndUpdate(
    //     { checkoutSessionId },
    //     updateOrderDto,
    //     { new: true },
    //   );
    // } catch (error) {
    //   throw error;
    // }
  }
}
