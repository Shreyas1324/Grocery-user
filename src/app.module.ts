import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config'; // Ensure this is correctly configured
import { ResponseService } from './common/response.service'; // Custom service for handling responses
import { UserModule } from './app/V1/user/user/user.module'; // User module for handling user-related logic
import { JwtService } from '@nestjs/jwt'; // For JWT-based authentication
import { AuthGuard } from './guard/auth.guard';
import { NonAuthHeader } from './guard/nonAuth.guard';
import { addUserEntity } from './entities/addUser.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DeviceRelationEntity } from './entities/device_relation.entity';
import { AddressModule } from './app/V1/user/userAddress/address.module';
import { WishlistModule } from './app/V1/user/wishlist/wishlist.module';
import { BasketModule } from './app/V1/user/basket/basket.module';
import { ReviewModule } from './app/V1/user/userReview/review.module';
import { HomeScreenModule } from './app/V1/user/homeScreen/home.module';
import { OrderModule } from './app/V1/user/order/order.module';
import { ProductModule } from './app/V1/user/product/product.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
    TypeOrmModule.forFeature([addUserEntity, DeviceRelationEntity]),
    TypeOrmModule.forRoot(databaseConfig),
    UserModule,
    AddressModule,
    WishlistModule,
    BasketModule,
    ReviewModule,
    HomeScreenModule,
    OrderModule,
    ProductModule,
  ],
  controllers: [],
  providers: [JwtService, ResponseService, AuthGuard, NonAuthHeader],
})
export class AppModule {}
