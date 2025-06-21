import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAddressEntity } from 'src/entities/addUserAddress.entity';
import { Product } from 'src/entities/products.entity';
import { Add_To_Cart } from 'src/entities/add_to_cart.entity';
import { Coupon } from 'src/entities/coupon.entity';
import { Order } from 'src/entities/orders.entity';
import { Order_Products } from 'src/entities/order_products.entity';
import { Manage_Tax } from 'src/entities/tax.entity';
import { DeviceRelationEntity } from 'src/entities/device_relation.entity';
import {
  addToBasketDto,
  checkOutDto,
  CompleteCartDto,
  CouponVerifyDto,
  deleteFromBasketDto,
} from './dto/Basket.dto';

interface CartItemRaw {
  quantity: number;
  product_id: number;
  product_price: number;
  discount: number;
  discount_price: number;
  product_name: string;
  image: string;
  default_variation: string;
}

@Injectable()
export class BasketService {
  constructor(
    @InjectRepository(UserAddressEntity)
    private userAddressRepository: Repository<UserAddressEntity>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Add_To_Cart)
    private Add_To_CartRepository: Repository<Add_To_Cart>,
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Order_Products)
    private orderProductsRepository: Repository<Order_Products>,
    @InjectRepository(Manage_Tax)
    private TaxRepository: Repository<Manage_Tax>,
    @InjectRepository(DeviceRelationEntity)
    private deviceRelationRepository: Repository<DeviceRelationEntity>,
  ) {}

  async addToBasketService(req: { userId: number }, body: addToBasketDto) {
    try {
      const deviceExists = await this.deviceRelationRepository.findOne({
        where: { fk_user_id: req.userId },
      });
      if (!deviceExists) {
        throw new Error('USER_NOT_REGISTERED');
      }

      const { Quantity, product_id } = body;

      const product = await this.productRepository.findOne({
        where: { id: product_id },
      });
      if (!product) {
        throw new Error('INVALID_PRODUCT');
      }

      const data = {
        Quantity: 1,
        fk_product_id: product_id,
        fk_user_id: req.userId,
        product_price: product?.product_price,
        discount: product?.discount,
        // variation: variation,
      };

      const checkItem = await this.Add_To_CartRepository.findOne({
        where: { fk_product_id: product_id, fk_user_id: req.userId },
      });

      if (checkItem) {
        let updateQuntity;
        if (Quantity == 1) {
          updateQuntity = 1;
        } else if (Quantity == 0) {
          updateQuntity = -1;
        } else {
          throw new Error('INVALID_QUANTITY_VALUE');
        }

        await this.Add_To_CartRepository.update(
          {
            fk_product_id: product_id,
            fk_user_id: req.userId,
          },
          {
            Quantity: () => `Quantity + ${updateQuntity}`,
            // variation: () => `${variation}`,
          },
        );

        const checkInBasket = await this.Add_To_CartRepository.findOne({
          where: { fk_product_id: product_id, fk_user_id: req.userId },
        });
        if (checkInBasket?.Quantity == 0) {
          await this.Add_To_CartRepository.createQueryBuilder()
            .delete()
            .where('fk_product_id = :product_id AND fk_user_id = :user_id', {
              product_id,
              user_id: req.userId,
            })
            .execute();
        }
        return { message: 'CART_UPDATED' };
      } else {
        if (product.stock_status == 1) {
          if (Quantity == 1) {
            await this.Add_To_CartRepository.save(data);
            return { message: 'ADD_TO_CART' };
          } else {
            throw new Error('MIN_1_QUANTITY');
          }
        } else {
          throw new Error('PRODUCT_OUT_OF_STOCK');
        }
      }
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async deleteFromBasketService(
    req: { userId: number },
    body: deleteFromBasketDto,
  ) {
    try {
      const deviceExists = await this.deviceRelationRepository.findOne({
        where: { fk_user_id: req.userId },
      });
      if (!deviceExists) {
        throw new Error('USER_NOT_REGISTERED');
      }

      const { product_id } = body;

      const product = await this.productRepository.findOne({
        where: { id: product_id },
      });
      if (!product) {
        throw new Error('INVALID_PRODUCT');
      }

      const checkItem = await this.Add_To_CartRepository.findOne({
        where: { fk_product_id: product_id, fk_user_id: req.userId },
      });

      if (checkItem) {
        await this.Add_To_CartRepository.createQueryBuilder()
          .delete()
          .where('fk_product_id = :product_id AND fk_user_id = :user_id', {
            product_id,
            user_id: req.userId,
          })
          .execute();
        return true;
      } else {
        throw new Error('PRODUCT_NOT_IN_BASKET');
      }
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async getBasketCountService(req: { userId: number }) {
    try {
      const deviceExists = await this.deviceRelationRepository.findOne({
        where: { fk_user_id: req.userId },
      });
      if (!deviceExists) {
        throw new Error('USER_NOT_REGISTERED');
      }

      let Total_count: string;
      const query = this.Add_To_CartRepository.createQueryBuilder(
        'basket',
      ).where('fk_user_id = :user_id', { user_id: req.userId });

      Total_count = `${await query.getCount()}`;

      const checkBasket = await this.Add_To_CartRepository.findOne({
        where: { fk_user_id: req.userId },
      });

      if (!checkBasket) {
        Total_count = '';
      }

      return { Total_count };
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async getCompleteBasketService(
    req: { userId: number },
    body: CompleteCartDto,
  ) {
    try {
      const deviceExists = await this.deviceRelationRepository.findOne({
        where: { fk_user_id: req.userId },
      });
      if (!deviceExists) {
        throw new Error('USER_NOT_REGISTERED');
      }

      const checkBasket = await this.Add_To_CartRepository.findOne({
        where: { fk_user_id: req.userId },
      });

      if (!checkBasket) {
        return { message: 'EMPTY_CART' };
      }

      const userId = req.userId;

      const cartItems: CartItemRaw[] =
        await this.Add_To_CartRepository.createQueryBuilder('cart')
          .leftJoinAndSelect('cart.product', 'product')
          .leftJoinAndSelect('product.brand', 'brand')
          .select([
            'cart.Quantity AS Quantity',
            'cart.fk_product_id AS product_id',
            'product.product_price AS product_price',
            'product.discount AS discount',
            'product.discount_price AS discount_price',
            'product.product_name AS product_name',
            'product.image AS image',
            'product.default_variation AS default_variation',
            'brand.brand_name AS brand_name',
          ])
          .where('cart.fk_user_id = :userId', { userId })
          .getRawMany();

      if (cartItems.length === 0) {
        return { message: 'EMPTY_CART' };
      }

      let totalPrice = 0; // before discount
      let subTotal = 0; // after discount
      let totalDiscount = 0;

      const formattedCartItems = cartItems.map((item: CartItemRaw) => {
        const product_price = item.product_price;
        const discount = item.discount;
        const discount_price = item.discount_price;
        const quantity = item.quantity;
        const price = product_price * quantity; // Original price before discount

        const discountAmount = Math.min(
          (price * discount) / 100,
          discount_price * quantity,
        );
        const finalPrice = price - discountAmount;

        totalPrice += price;
        totalDiscount += discountAmount;
        subTotal += finalPrice;

        return {
          ...item,
          original_price: price,
          final_price: finalPrice,
        };
      });

      const tax_rate = (await this.TaxRepository.createQueryBuilder()
        .select('tax')
        // .getRawOne();
        .getRawOne()) as { tax: number };
      const TAX_RATE: number = tax_rate.tax / 100;
      const DELIVERY_CHARGE = 50;

      const tax = subTotal * TAX_RATE;
      const deliveryCharge = subTotal > 500 ? 0 : DELIVERY_CHARGE; //if total is greater than 500 then and then only delivery is free

      let grandTotal = subTotal + tax + deliveryCharge;
      let totalSaving = totalDiscount;
      let couponApplied: string | null = null;
      let couponExpiresIn: string | null = null;
      let couponDiscount: number | null = null;

      // Apply coupon if present
      if (body?.coupon_code) {
        const { coupon_code } = body;
        const coupon = await this.couponRepository.findOne({
          where: { coupon_code: coupon_code, is_deleted: 0 },
        });

        if (!coupon) {
          throw new Error('INVALID_COUPON');
        }

        const createdDate = new Date(coupon.created_date);
        const expiryDate = new Date(
          createdDate.getTime() + 6 * 24 * 60 * 60 * 1000,
        ); // + 6 days
        const now = new Date();

        const timeDiff = expiryDate.getTime() - now.getTime();
        const expiresInDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        if (expiresInDays < 0) {
          throw new Error('COUPON_EXPIRED');
        }

        if (subTotal < coupon.min_purchase) {
          return {
            message: `Subtotal must be at least ${coupon.min_purchase} to use this coupon`,
          };
        }

        couponDiscount = coupon.discount_price;
        grandTotal -= coupon.discount_price;
        totalSaving += coupon.discount_price;
        couponApplied = coupon.coupon_name;
        couponExpiresIn = `${expiresInDays} day(s)`;
      }

      return {
        cart_items: formattedCartItems,
        main_price: Number((totalPrice + tax).toFixed(2)),
        sub_total: Number((subTotal + tax).toFixed(2)), // After discount
        // tax: +tax.toFixed(2), // Added tax calculation
        delivery_charge: deliveryCharge === 0 ? 0 : DELIVERY_CHARGE,
        delivery_savings: deliveryCharge === 0 ? 50 : 0,
        grand_total: +grandTotal.toFixed(2),
        total_saving: +totalSaving.toFixed(2),
        coupon_applied: couponApplied,
        coupon_expires_in: couponExpiresIn,
        coupon_discount: couponDiscount,
      };
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async checkoutService(req: { userId: number }, body: checkOutDto) {
    try {
      const deviceExists = await this.deviceRelationRepository.findOne({
        where: { fk_user_id: req.userId },
      });
      if (!deviceExists) {
        throw new Error('USER_NOT_REGISTERED');
      }

      const checkBasket = await this.Add_To_CartRepository.findOne({
        where: { fk_user_id: req.userId },
      });

      if (!checkBasket) {
        throw new Error('EMPTY_CART');
      }

      const userId = req.userId;
      const { address_id, coupon_code } = body;

      const checkaddress = await this.userAddressRepository.findOne({
        where: { address_id: address_id, user_id: req.userId },
      });
      if (!checkaddress) {
        throw new Error('Invalid user_id Or address_id');
      }

      let coupon_id: number | undefined = undefined;

      if (coupon_code) {
        const couponExist = await this.couponRepository.findOne({
          where: { coupon_code: coupon_code, is_deleted: 0 },
        });

        if (!couponExist) {
          throw new Error('INVALID_COUPON');
        } else {
          const coupon = (await this.couponRepository
            .createQueryBuilder('coupon')
            .select('*')
            .where({ coupon_code: coupon_code })
            .execute()) as { coupon_id: number };
          coupon_id = coupon.coupon_id;
        }
      }
      const address = await this.userAddressRepository.findOne({
        where: { address_id: address_id },
      });

      const data = await this.getCompleteBasketService(req, body);

      const checkUserBasket = await this.Add_To_CartRepository.find({
        where: { fk_user_id: userId },
      });

      const order_status = Math.floor(Math.random() * 4) + 1;

      let isUnique = false,
        random6Digit: number | undefined = undefined;
      while (!isUnique) {
        random6Digit = Math.floor(100000 + Math.random() * 900000);
        const existing = await this.orderRepository.findOne({
          where: { order_no: random6Digit },
        });
        if (!existing) {
          isUnique = true;
        }
      }

      if (checkUserBasket.length > 0) {
        const delivery_charge = data.delivery_charge;
        const data1 = {
          fk_coupon_id: coupon_id,
          fk_address_id: address?.address_id,
          address_type: address?.type,
          fk_user_id: userId,
          delivery_charge: delivery_charge,
          total_amount: data.sub_total,
          total_discount: data.total_saving,
          total_quantity: data.cart_items?.length,
          grand_total: data.grand_total,
          order_no: random6Digit,
          order_status: order_status,
        };

        const result = await this.orderRepository.save(data1);

        await Promise.all(
          (data.cart_items || [])?.map((cartItem) => {
            const orderDetails = {
              fk_product_id: +cartItem.product_id,
              fk_order_id: +result.order_id,
              product_quantity: +cartItem.quantity,
              product_price: +cartItem.product_price,
              product_variation: +cartItem.default_variation || 0,
              total_sum: +cartItem.quantity * cartItem.product_price,
              grand_total:
                +cartItem.quantity *
                (cartItem.product_price - cartItem.discount_price),
            };

            return this.orderProductsRepository.save(orderDetails);
          }),
        );

        await this.Add_To_CartRepository.delete({ fk_user_id: req.userId });
      }
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async verifyCouponService(req: { userId: number }, body: CouponVerifyDto) {
    try {
      const { coupon_code } = body;
      const coupon = await this.couponRepository.findOne({
        where: { coupon_code: coupon_code, is_deleted: 0 },
      });

      if (!coupon) {
        return { message: 'INVALID_COUPON' };
      }

      const createdDate = new Date(coupon.created_date);
      const expiryDate = new Date(
        createdDate.getTime() + 6 * 24 * 60 * 60 * 1000,
      ); // + 6 days
      const now = new Date();

      const timeDiff = expiryDate.getTime() - now.getTime();
      const expiresInDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

      if (expiresInDays < 0) {
        return { message: 'COUPON_EXPIRED' };
      }

      return { message: 'Coupon Is Correct' };
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }
}
