import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/products.entity';
import { Wishlist } from 'src/entities/wishlist.entity';
import { DeviceRelationEntity } from 'src/entities/device_relation.entity';
import { addToWishlistDto, GetWishlistDto } from './dto/addToWishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(DeviceRelationEntity)
    private deviceRelationRepository: Repository<DeviceRelationEntity>,
  ) {}

  async addToWishlistService(req: { userId: number }, body: addToWishlistDto) {
    try {
      const deviceExists = await this.deviceRelationRepository.findOne({
        where: { fk_user_id: req.userId },
      });
      if (!deviceExists) {
        throw new Error('USER_NOT_REGISTERED');
      }

      const { product_id } = body;
      const data = { fk_product_id: product_id, fk_user_id: req.userId };

      const wishlistAction = await this.wishlistRepository.findOne({
        where: { fk_user_id: req.userId, fk_product_id: product_id },
      });

      const isProductExist = await this.productRepository.findOne({
        where: { id: product_id },
      });
      if (!isProductExist) {
        throw new Error('INVALID_PRODUCT');
      }

      if (wishlistAction) {
        if (wishlistAction.is_deleted == 0) {
          await this.wishlistRepository.update(
            { fk_user_id: req.userId, fk_product_id: product_id },
            { is_deleted: 1 },
          );

          return { message: 'WISHLIST_REMOVED' };
        } else {
          await this.wishlistRepository.update(
            { fk_user_id: req.userId, fk_product_id: product_id },
            { is_deleted: 0 },
          );

          return { message: 'WISHLIST_ADDED' };
        }
      } else {
        await this.wishlistRepository.save(data);

        return { message: 'WISHLIST_ADDED' };
      }
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async getWishlistService(req: { userId: number }, params: GetWishlistDto) {
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

      const query = this.wishlistRepository
        .createQueryBuilder('wishlist')
        .leftJoin('wishlist.product', 'product')
        .leftJoin('product.brand', 'brands')
        .select([
          'wishlist.id',
          'wishlist.is_deleted',
          'product.id AS product_id',
          'product.fk_category_id AS category_id',
          'product.product_name AS product_name',
          'product.product_price AS product_price',
          'product.discount AS discount',
          'product.discount_price AS discount_price',
          'product.description AS product_description',
          'product.variation AS variation',
          'product.default_variation AS default_variation',
          'product.image AS image',
          'product.stock_status AS stock_status',
          'brands.brand_name AS brand_name',
          'CASE WHEN wishlist.id IS NOT NULL THEN 1 ELSE 0 END AS existInWishlist',
        ])
        .where({ fk_user_id: req.userId, is_deleted: 0 });

      const wishlist = await query.offset(skip).limit(limit).getRawMany();
      const Total_count = await query.getCount();

      return { wishlist, Total_count };
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }
}
