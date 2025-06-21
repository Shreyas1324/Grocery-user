import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/entities/orders.entity';
import { DeviceRelationEntity } from 'src/entities/device_relation.entity';
import { Order_Products } from 'src/entities/order_products.entity';
import { getOrderDetailDto, GetOrderListDto } from './dto/order.dto';
import { Product } from 'src/entities/products.entity';
import { Add_To_Cart } from 'src/entities/add_to_cart.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Order_Products)
    private Order_ProductsRepository: Repository<Order_Products>,
    @InjectRepository(DeviceRelationEntity)
    private deviceRelationRepository: Repository<DeviceRelationEntity>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Add_To_Cart)
    private Add_To_CartRepository: Repository<Add_To_Cart>,
  ) {}

  async getOrderListService(req: { userId: number }, params: GetOrderListDto) {
    try {
      const deviceExists = await this.deviceRelationRepository.findOne({
        where: { fk_user_id: req.userId },
      });
      if (!deviceExists) {
        throw new Error('USER_NOT_REGISTERED');
      }

      const page = params.page || 1;
      const limit = params.limit || 3;
      const skip = (page - 1) * limit;

      const query = this.orderRepository
        .createQueryBuilder('order')
        .select([
          'order.order_id AS order_id',
          'order.order_no AS order_no',
          'order.order_status AS order_status',
          'order.grand_total AS grand_total',
          'order.created_date AS created_date',
          'order.address_type AS address_type',
        ])
        .where({ fk_user_id: req.userId })
        .orderBy('order.created_date', 'DESC');

      const orders = await query.offset(skip).limit(limit).getRawMany();
      const Total_count = await query.getCount();

      return { orders, Total_count };
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async getOrderDetailService(
    req: { userId: number },
    params: getOrderDetailDto,
  ) {
    try {
      const isOrderExist = await this.orderRepository.findOne({
        where: { order_id: params.order_id, fk_user_id: req.userId },
      });
      if (!isOrderExist) {
        throw new Error('Invalid Order Id Please Check order_id and user_id');
      }

      const orderWithProducts = await this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.userAddress', 'userAddress')
        .leftJoinAndSelect('order.order_products', 'order_products')
        .leftJoinAndSelect('order_products.product', 'product')
        .where('order.fk_user_id = :userId', { userId: req.userId })
        .andWhere('order.order_id = :orderId', { orderId: params.order_id })
        .getOne();

      if (!orderWithProducts) {
        throw new Error('Order not found');
      }

      const result = {
        order_no: orderWithProducts.order_no,
        order_status: orderWithProducts.order_status,
        sub_total: orderWithProducts.total_amount,
        grand_total: orderWithProducts.grand_total,
        created_date: orderWithProducts.created_date,
        delivery_charge: orderWithProducts.delivery_charge,
        delivery_savings: orderWithProducts.delivery_charge === 50 ? 0 : 50,
        address_line:
          orderWithProducts.userAddress?.address_line1 +
          ' ' +
          orderWithProducts.userAddress?.address_line2,
        delivery_date: new Date(
          new Date(orderWithProducts.created_date).getTime() +
            5 * 24 * 60 * 60 * 1000,
        ),
        products: orderWithProducts.order_products.map((op) => ({
          product_id: op.product?.id,
          product_name: op.product?.product_name,
          image: op.product?.image,
          product_quantity: op.product_quantity,
          product_price: op.product_price,
          product_variation: op.product.default_variation,
        })),
        total_items: orderWithProducts.order_products.reduce(
          (sum, op) => sum + op.product_quantity,
          0,
        ),
      };

      return result;
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async ReOrderService(req: { userId: number }, body: getOrderDetailDto) {
    try {
      const { order_id } = body;

      const isOrderExist = await this.orderRepository.findOne({
        where: { order_id: order_id, fk_user_id: req.userId },
      });
      if (!isOrderExist) {
        throw new Error('Invalid Order Id Please Check order_id and user_id');
      }

      const orderProducts = await this.Order_ProductsRepository.find({
        where: { fk_order_id: order_id },
      });

      if (!orderProducts.length) {
        throw new Error('No products found for this order.');
      }

      for (const item of orderProducts) {
        const product_id = item.fk_product_id;

        const product = await this.productRepository.findOne({
          where: { id: product_id },
        });

        if (!product) continue;

        const checkItem = await this.Add_To_CartRepository.findOne({
          where: { fk_product_id: product_id, fk_user_id: req.userId },
        });

        if (checkItem) {
          await this.Add_To_CartRepository.update(
            {
              fk_product_id: product_id,
              fk_user_id: req.userId,
            },
            {
              Quantity: () => `"Quantity" + ${item.product_quantity}`,
            },
          );
        } else {
          if (product.stock_status == 1) {
            const newItem = {
              Quantity: item.product_quantity,
              fk_product_id: product_id,
              fk_user_id: req.userId,
              product_price: product.product_price,
              discount: product.discount,
            };

            await this.Add_To_CartRepository.save(newItem);
          }
        }
      }

      return true;
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }
}
