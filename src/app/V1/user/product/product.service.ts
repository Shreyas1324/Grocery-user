import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Category } from 'src/entities/category.entity';
import { Product } from 'src/entities/products.entity';
import { Wishlist } from 'src/entities/wishlist.entity';
import { productInfoDto, similarProduct } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async ProductInfoService(req: { userId: number }, params: productInfoDto) {
    try {
      const isProductExist = await this.productRepository.findOne({
        where: { id: params.product },
      });

      if (!isProductExist) {
        throw new Error('INVALID_PRODUCT');
      }

      const productInfo = (await this.productRepository
        .createQueryBuilder('product')
        .leftJoin('product.productsInfo', 'product_info')
        .leftJoin('product.brand', 'brands')
        .leftJoin(
          Wishlist,
          'wishlist',
          'wishlist.fk_product_id = product.id AND wishlist.fk_user_id = :userId AND wishlist.is_deleted = 0',
          { userId: req.userId },
        )
        .select([
          'product.id AS product_id',
          'product.product_name AS product_name',
          'product.product_price AS product_price',
          'product.discount AS discount',
          'product.discount_price AS discount_price',
          'product.description AS product_description',
          'product.variation AS variation',
          'product.default_variation AS default_variation',
          'product.fk_category_id AS category_id',
          'product.stock_status AS stock_status',
          'product.image AS image',
          'product_info.image1 AS image1',
          'product_info.image2 AS image2',
          'product_info.image3 AS image3',
          'product_info.image4 AS image4',
          'product_info.product_info AS product_info',
          'product_info.ingredients AS ingredients',
          'product_info.benefits AS benefits',
          'product_info.nutritional_facts AS nutritional_facts',
          'product_info.other_product_info AS other_product_info',
          'brands.brand_name AS brand_name',
          'CASE WHEN wishlist.id IS NOT NULL THEN 1 ELSE 0 END AS existInWishlist',
        ])
        .where({ id: params.product })
        .getRawOne()) as Partial<Product>;

      return productInfo;
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async SimilarProductsService(
    req: { userId: number },
    params: similarProduct,
  ) {
    try {
      const page = params.page || 1;
      const limit = params.limit || 3;
      const skip = (page - 1) * limit;

      const isCagetoryExist = await this.categoryRepository.findOne({
        where: { id: params.category },
      });
      const isProductExist = await this.productRepository.findOne({
        where: { id: params.product },
      });
      const isProductWithCategoryExist = await this.productRepository.findOne({
        where: { id: params.product, fk_category_id: params.category },
      });

      if (!isCagetoryExist) {
        throw new Error('Invalid Category');
      }
      if (!isProductExist) {
        throw new Error('INVALID_PRODUCT');
      }
      if (!isProductWithCategoryExist) {
        throw new Error('Product Is Not In Given Category');
      }

      const Query = this.productRepository
        .createQueryBuilder('product')
        .leftJoin('product.brand', 'brands')
        .leftJoin(
          Wishlist,
          'wishlist',
          'wishlist.fk_product_id = product.id AND wishlist.fk_user_id = :userId AND wishlist.is_deleted = 0',
          { userId: req.userId },
        )
        .select([
          'product.id AS product_id',
          'product.fk_category_id AS category_id',
          'product.product_name AS product_name',
          'product.product_price AS product_price',
          'product.discount AS discount',
          'product.discount_price AS discount_price',
          'product.description AS product_description',
          'product.variation AS variation',
          'product.default_variation AS default_variation',
          'product.stock_status AS stock_status',
          'product.image AS image',
          'brands.brand_name AS brand_name',
          'CASE WHEN wishlist.id IS NOT NULL THEN 1 ELSE 0 END AS existInWishlist',
        ])
        .where({ fk_category_id: params.category, id: Not(params.product) });

      const product = await Query.offset(skip).limit(limit).getRawMany();
      const Total_count = await Query.getCount();

      return { product, Total_count };
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }
}
