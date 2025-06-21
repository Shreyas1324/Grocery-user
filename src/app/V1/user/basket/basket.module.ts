import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { addUserEntity } from '../../../../entities/addUser.entity';
import { ResponseService } from 'src/common/response.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/guard/auth.guard';
import { NonAuthHeader } from 'src/guard/nonAuth.guard';
import { UserAddressEntity } from 'src/entities/addUserAddress.entity';
import { Category } from 'src/entities/category.entity';
import { Brand } from 'src/entities/brand.entity';
import { Banner } from 'src/entities/banner.entity';
import { SubCategory } from 'src/entities/sub_category.entity';
import { Product } from 'src/entities/products.entity';
import { Wishlist } from 'src/entities/wishlist.entity';
import { Review } from 'src/entities/review.entity';
import { Add_To_Cart } from 'src/entities/add_to_cart.entity';
import { Coupon } from 'src/entities/coupon.entity';
import { Order } from 'src/entities/orders.entity';
import { Order_Products } from 'src/entities/order_products.entity';
import { orderReview } from 'src/entities/order_review.entity';
import { DiscountEntity, SortbyEntity } from 'src/entities/filter_list.entity';
import { Manage_Tax } from 'src/entities/tax.entity';
import { DeviceRelationEntity } from 'src/entities/device_relation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      addUserEntity,
      UserAddressEntity,
      Category,
      Brand,
      Banner,
      SubCategory,
      Product,
      Wishlist,
      Review,
      Add_To_Cart,
      Coupon,
      Order,
      Order_Products,
      orderReview,
      DiscountEntity,
      SortbyEntity,
      Manage_Tax,
      DeviceRelationEntity,
    ]),
  ],
  providers: [
    BasketService,
    ResponseService,
    JwtService,
    AuthGuard,
    NonAuthHeader,
  ],
  controllers: [BasketController],
})
export class BasketModule {}
