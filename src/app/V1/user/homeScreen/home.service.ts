import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/entities/category.entity';
import { Brand } from 'src/entities/brand.entity';
import { Banner } from 'src/entities/banner.entity';
import { SubCategory } from 'src/entities/sub_category.entity';
import { Product } from 'src/entities/products.entity';
import { DiscountEntity, SortbyEntity } from 'src/entities/filter_list.entity';
import { Wishlist } from 'src/entities/wishlist.entity';
import {
  BrandListDto,
  GetBannersDto,
  searchParamsDto,
  ShopByBrandDto,
} from './dto/searchParams.dto';
import { GetCategoriesQueryDto } from './dto/homeParams.dto';

@Injectable()
export class HomeScreenService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Banner)
    private bannerRepository: Repository<Banner>,
    @InjectRepository(DiscountEntity)
    private discountListRepository: Repository<DiscountEntity>,
    @InjectRepository(SortbyEntity)
    private sortbyListRepository: Repository<SortbyEntity>,
  ) {}

  async getBannerService(params: GetBannersDto) {
    try {
      const page = params.page || 1;
      const limit = params.limit || 3;
      const skip = (page - 1) * limit;

      const banner = this.bannerRepository
        .createQueryBuilder('b')
        .select(['b.id AS id', 'b.image AS image'])
        .orderBy('b.id', 'ASC');

      const banners = await banner.offset(skip).limit(limit).getRawMany();

      const Total_count = await banner.getCount();

      return { banners, Total_count };
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async searchProductService(req: { userId: number }, params: searchParamsDto) {
    try {
      const search = params.search;
      const minPrice = params.minPrice;
      const maxPrice = params.maxPrice;
      const discount = params.discount;
      const sortby = params.sortby;
      const page = params.page || 1;
      const limit = params.limit || 3;
      const skip = (page - 1) * limit;

      const query = this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.brand', 'brand')
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
          'product.stock_status AS stockStatus',
          'product.discount_price AS discount_price',
          'product.variation AS variation',
          'product.image AS image',
          'product.default_variation AS default_variation',
          'brand.brand_name AS brand_name',
          'brand.id AS brand_id',
          'CASE WHEN wishlist.id IS NOT NULL THEN 1 ELSE 0 END AS existInWishlist',
        ]);

      if (search) {
        query.where(
          'product.product_name ILIKE :search  OR brand.brand_name ILIKE :search',
          {
            search: `%${search}%`,
          },
        );
      }

      let brandIds: number[] = [];
      if (params.brands) {
        // Split and convert to numbers
        brandIds = params.brands
          .split(',')
          .map((b) => Number(b.trim()))
          .filter((b) => !isNaN(b));

        if (brandIds.length === 0) {
          throw new Error('Brand array is empty or contains invalid numbers');
        }

        query.andWhere('product.fk_brand_id IN (:...brandIds)', { brandIds });
      }

      if (minPrice && maxPrice) {
        query.andWhere(
          'product.product_price BETWEEN :minPrice AND :maxPrice',
          { minPrice, maxPrice },
        );
      }

      let discountIds: string[] = [];
      if (discount) {
        discountIds =
          typeof discount === 'string'
            ? discount
                .split(',')
                .map((d) => d.trim())
                .filter(Boolean)
            : discount;

        if (!Array.isArray(discountIds) || discountIds.length === 0) {
          throw new Error('Invalid discount array');
        }

        const discountRanges = await this.discountListRepository
          .createQueryBuilder()
          .where('id IN (:...ids)', { ids: discountIds })
          .getMany();

        const conditions: string[] = [];
        const params = {};

        discountRanges.forEach((r, i) => {
          if (r.min != null && r.max != null) {
            conditions.push(`(product.discount BETWEEN :min${i} AND :max${i})`);
            params[`min${i}`] = r.min;
            params[`max${i}`] = r.max;
          }
        });

        if (conditions.length) {
          query.andWhere(conditions.join(' OR '), params);
        }
      }

      if (sortby) {
        const sortOption = await this.sortbyListRepository
          .createQueryBuilder()
          .where('type = :type', { type: sortby })
          .getOne();

        if (sortOption?.column && sortOption?.order) {
          let order: 'ASC' | 'DESC'; //“The only values order is allowed to hold are "ASC" or "DESC" — nothing else.”
          const upperOrder = sortOption.order.toUpperCase();

          if (upperOrder === 'ASC') {
            order = 'ASC';
          } else if (upperOrder === 'DESC') {
            order = 'DESC';
          } else {
            order = 'ASC';
          }

          query.orderBy(`product.${sortOption.column}`, order);
        }
      }

      const products = await query.offset(skip).limit(limit).getRawMany();

      const Total_count = await query.getCount();

      return { products, Total_count };
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async brandListService(params: BrandListDto) {
    try {
      const page = params.page || 1;
      const limit = params.limit || 3;
      const skip = (page - 1) * limit;
      const query = this.brandRepository
        .createQueryBuilder('brands')
        .select(['brands.brand_name', 'brands.id'])
        .orderBy('brands.brand_name', 'ASC')
        .offset(skip)
        .limit(limit);

      let brands: { id: number; brand_name: string }[];

      if (params.search) {
        brands = await query
          .where('brands.brand_name ILIKE :search', {
            search: `%${params.search}%`,
          })
          .getMany();
      } else {
        brands = await query.getMany();
      }

      const Total_count = await query.getCount();
      return { brands, Total_count };
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async discountListService(params: GetBannersDto) {
    try {
      const page = params.page || 1;
      const limit = params.limit || 3;
      const skip = (page - 1) * limit;
      const discount = this.discountListRepository
        .createQueryBuilder()
        .select(['type', 'label']);

      const discountList = await discount
        .offset(skip)
        .limit(limit)
        .getRawMany();
      const Total_count = await discount.getCount();

      return { discountList, Total_count };
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async sortbyService(params: GetBannersDto) {
    try {
      const page = params.page || 1;
      const limit = params.limit || 3;
      const skip = (page - 1) * limit;
      const sortby = this.sortbyListRepository
        .createQueryBuilder()
        .select(['type', 'label']);

      const sortbyList = await sortby
        .offset(skip)
        .limit(limit)
        .orderBy('type', 'ASC')
        .getRawMany();
      const Total_count = await sortby.getCount();

      return { sortbyList, Total_count };
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async getCategoriesService(
    req: { userId: number },
    params: GetCategoriesQueryDto,
  ) {
    try {
      const page = params.page || 1;
      const limit = params.limit || 3;
      const skip = (page - 1) * limit;

      if (!params.category) {
        const query = this.categoryRepository
          .createQueryBuilder('category')
          .leftJoin('category.shop_by_category', 'shop_by_category')
          .select([
            'category.id AS id',
            'category.category_name AS category_name',
            'category.image AS image',
            'category.status AS status',
            'category.is_deleted AS is_deleted',
            'shop_by_category.offer AS offer',
            'shop_by_category.offer_percentage AS offer_percentage',
          ]);

        const categories = await query.offset(skip).limit(limit).getRawMany();
        const Total_count = await query.getCount();

        return { categories, Total_count };
      } else if (params.category && params.sub_category && params.brand) {
        const isCategoryexist = await this.categoryRepository.findOne({
          where: { id: params.category },
        });
        if (!isCategoryexist) {
          {
            throw new Error('Category Id Not Exist');
          }
        }
        const isSubCategoryexist = await this.subCategoryRepository.findOne({
          where: { id: params.sub_category },
        });
        if (!isSubCategoryexist) {
          {
            throw new Error('Sub_Category Id Not Exist');
          }
        }
        const isBrandexist = await this.brandRepository.findOne({
          where: { id: params.brand },
        });
        if (!isBrandexist) {
          {
            throw new Error('Brand Id Not Exist');
          }
        }

        const brand = await this.brandRepository.findOne({
          where: { id: params.brand },
        });
        const brand_name = brand?.brand_name;

        const query = this.productRepository
          .createQueryBuilder('product')
          .leftJoin('product.brand', 'brands')
          .leftJoin(
            Wishlist,
            'wishlist',
            'wishlist.fk_product_id = product.id AND wishlist.fk_user_id = :userId AND wishlist.is_deleted = 0',
            { userId: req.userId },
          )
          .where('product.fk_category_id = :category', {
            category: params.category,
          })
          .andWhere('product.fk_subcategory_id = :sub_category', {
            sub_category: params.sub_category,
          })
          .andWhere('product.fk_brand_id = :brand', { brand: params.brand })
          .andWhere('brands.fk_subcategory_id = :sub_category', {
            sub_category: params.sub_category,
          })
          .andWhere('brands.fk_category_id = :category', {
            category: params.category,
          })
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
            'product.image AS image',
            'product.stock_status AS stock_status',
            'brands.brand_name AS brand_name',
            'CASE WHEN wishlist.id IS NOT NULL THEN 1 ELSE 0 END AS existInWishlist',
          ]);

        const products = await query.offset(skip).limit(limit).getRawMany();
        const Total_count = await query.getCount();

        return { brand_name, products, Total_count };
      } else if (params.category && params.brand) {
        const isCategoryexist = await this.categoryRepository.findOne({
          where: { id: params.category },
        });
        if (!isCategoryexist) {
          {
            throw new Error('Category Id Not Exist');
          }
        }

        const isBrandexist = await this.brandRepository.findOne({
          where: { id: params.brand },
        });
        if (!isBrandexist) {
          {
            throw new Error('Brand Id Not Exist');
          }
        }

        const brand = await this.brandRepository.findOne({
          where: { id: params.brand },
        });
        const brand_name = brand?.brand_name;

        const query = this.productRepository
          .createQueryBuilder('product')
          .leftJoin('product.brand', 'brands')
          .leftJoin(
            Wishlist,
            'wishlist',
            'wishlist.fk_product_id = product.id AND wishlist.fk_user_id = :userId AND wishlist.is_deleted = 0',
            { userId: req.userId },
          )
          .where('product.fk_category_id = :category', {
            category: params.category,
          })
          .andWhere('product.fk_brand_id = :brand', { brand: params.brand })
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
            'product.image AS image',
            'product.stock_status AS stock_status',
            'brands.brand_name AS brand_name',
            'CASE WHEN wishlist.id IS NOT NULL THEN 1 ELSE 0 END AS existInWishlist',
          ]);

        const products = await query.offset(skip).limit(limit).getRawMany();
        const Total_count = await query.getCount();

        return { brand_name, products, Total_count };
      } else if (params.category && params.sub_category) {
        const isCategoryexist = await this.categoryRepository.findOne({
          where: { id: params.category },
        });
        if (!isCategoryexist) {
          {
            throw new Error('Category Id Not Exist');
          }
        }
        const isSubCategoryexist = await this.subCategoryRepository.findOne({
          where: { id: params.sub_category },
        });
        if (!isSubCategoryexist) {
          {
            throw new Error('Sub_Category Id Not Exist');
          }
        }

        const brandsquery = this.brandRepository
          .createQueryBuilder('brands')
          .where({
            fk_category_id: params.category,
            fk_subcategory_id: params.sub_category,
          })
          .select([
            'brands.id AS brand_id',
            'brands.brand_name AS brand_name',
            'brands.image AS image',
            'brands.status AS status',
            'brands.is_deleted AS is_deleted',
          ]);

        const brands = await brandsquery.offset(skip).limit(limit).getRawMany();
        const Total_Brand_count = await brandsquery.getCount();

        const productsquery = this.productRepository
          .createQueryBuilder('product')
          .leftJoin('product.sub_category', 'sub_category')
          .leftJoin('product.brand', 'brands')
          .leftJoin(
            Wishlist,
            'wishlist',
            'wishlist.fk_product_id = product.id AND wishlist.fk_user_id = :userId AND wishlist.is_deleted = 0',
            { userId: req.userId },
          )
          .where('product.fk_category_id = :category', {
            category: params.category,
          })
          .andWhere('product.fk_subcategory_id = :sub_category', {
            sub_category: params.sub_category,
          })
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
            'product.image AS image',
            'product.stock_status AS stock_status',
            'brands.brand_name AS brand_name',
            'CASE WHEN wishlist.id IS NOT NULL THEN 1 ELSE 0 END AS existInWishlist',
          ]);

        const products = await productsquery
          .offset(skip)
          .limit(limit)
          .getRawMany();
        const Total_Product_count = await productsquery.getCount();

        return { brands, products, Total_Brand_count, Total_Product_count };
      } else if (params.category) {
        const isCategoryexist = await this.categoryRepository.findOne({
          where: { id: params.category },
        });
        if (!isCategoryexist) {
          {
            throw new Error('Category Id Not Exist');
          }
        }

        const brandsquery = this.brandRepository
          .createQueryBuilder('brands')
          .where({ fk_category_id: params.category })
          .select([
            'brands.id AS brand_id',
            'brands.brand_name AS brand_name',
            'brands.image AS image',
            'brands.status AS status',
            'brands.is_deleted AS is_deleted',
          ]);

        const brands = await brandsquery.offset(skip).limit(limit).getRawMany();
        const Total_Brand_count = await brandsquery.getCount();

        const sub_categoryquery = this.subCategoryRepository
          .createQueryBuilder('sub_category')
          .where('sub_category.fk_category_id = :category_id', {
            category_id: params.category,
          })
          .select([
            'sub_category.fk_category_id AS category_id',
            'sub_category.id AS subcategory_id',
            'sub_category.subcategory_name AS subcategory_name',
            'sub_category.image AS image',
            'sub_category.status AS status',
            'sub_category.is_deleted AS is_deleted',
          ]);

        const sub_category = await sub_categoryquery
          .offset(skip)
          .limit(limit)
          .getRawMany();
        const Total_subcategory_count = await sub_categoryquery.getCount();

        return {
          brands,
          sub_category,
          Total_Brand_count,
          Total_subcategory_count,
        };
      }
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async shopByBrandsService(req: { userId: number }, params: ShopByBrandDto) {
    try {
      const page = params.page || 1;
      const limit = params.limit || 3;
      const skip = (page - 1) * limit;

      if (!params.brand) {
        const query = this.brandRepository
          .createQueryBuilder('brand')
          .select([
            'brand.id AS brand_id',
            'brand.brand_name AS brand_name',
            'brand.image AS brand_image',
          ]);

        const brandList = await query.offset(skip).limit(limit).getRawMany();
        const Total_count = await query.getCount();

        return { brandList, Total_count };
      }

      if (params.brand) {
        if (!params.brand) {
          {
            throw new Error('Brand Is Empty');
          }
        }
        const isBrandexist = await this.brandRepository.findOne({
          where: { id: params.brand },
        });
        if (!isBrandexist) {
          {
            throw new Error('Brand Id Not Exist');
          }
        }

        const brand = await this.brandRepository.findOne({
          where: { id: params.brand },
        });
        const brand_name = brand?.brand_name;

        const query = this.productRepository
          .createQueryBuilder('product')
          .leftJoin('product.brand', 'brand')
          .leftJoin(
            Wishlist,
            'wishlist',
            'wishlist.fk_product_id = product.id AND wishlist.fk_user_id = :userId AND wishlist.is_deleted = 0',
            { userId: req.userId },
          )
          // .andWhere('product.fk_subcategory_id = :sub_category', {
          //   sub_category: params.sub_category,
          // })
          .where('product.fk_brand_id = :brand', { brand: params.brand })
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
            'product.image AS image',
            'product.stock_status AS stock_status',
            'brand.brand_name AS brand_name',
            'CASE WHEN wishlist.id IS NOT NULL THEN 1 ELSE 0 END AS existInWishlist',
          ]);

        const products = await query.offset(skip).limit(limit).getRawMany();
        const Total_count = await query.getCount();

        return { brand_name, products, Total_count };
      }
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async getBestSellerProductsService(
    req: { userId: number },
    params: GetBannersDto,
  ) {
    try {
      const page = params.page || 1;
      const limit = params.limit || 3;
      const skip = (page - 1) * limit;

      const query = this.productRepository
        .createQueryBuilder('product')
        .innerJoin('product.order_products', 'order_products') //innerJoin
        .leftJoin('product.brand', 'brand')
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
          'product.default_variation AS default_variation',
          'product.variation AS variation',
          'product.image AS image',
          'product.stock_status AS stock_status',
          'brand.brand_name AS brand_name',
          'CASE WHEN wishlist.id IS NOT NULL THEN 1 ELSE 0 END AS existInWishlist',
        ])
        // .addSelect('COUNT(order_products.id)', 'sales_count')
        .groupBy('product.id')
        .addGroupBy('brand.id')
        .addGroupBy('wishlist.id')
        .orderBy('COUNT(order_products.id)', 'DESC');

      const bestSellerProducts = await query
        .offset(skip)
        .limit(limit)
        .getRawMany();
      const Total_count = await query.getCount();

      return { bestSellerProducts, Total_count };
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async ShopByCategoryService(
    req: { userId: number },
    params: GetCategoriesQueryDto,
  ) {
    try {
      const page = params.page || 1;
      const limit = params.limit || 3;
      const skip = (page - 1) * limit;

      if (!params.sub_category) {
        const query = await this.categoryRepository
          .createQueryBuilder('category')
          .leftJoin('category.sub_category', 'sub_category')
          .select([
            'category.id',
            'category.category_name',
            'category.is_deleted',
            'sub_category.id',
            'sub_category.subcategory_name',
          ])
          .getMany();
        return query;
      } else if (params.sub_category) {
        const isSubCategoryexist = await this.subCategoryRepository.findOne({
          where: { id: params.sub_category },
        });
        if (!isSubCategoryexist) {
          {
            throw new Error('Sub_Category Id Not Exist');
          }
        }

        const sub_category = await this.subCategoryRepository.findOne({
          where: { id: params.sub_category },
        });
        const subCategory_name = sub_category?.subcategory_name;
        const brandsquery = this.brandRepository
          .createQueryBuilder('brands')
          .where({
            fk_subcategory_id: params.sub_category,
          })
          .select([
            'brands.id AS brand_id',
            'brands.brand_name AS brand_name',
            'brands.image AS image',
            'brands.status AS status',
            'brands.is_deleted AS is_deleted',
          ]);

        const brands = await brandsquery.offset(skip).limit(limit).getRawMany();
        const Total_Brand_count = await brandsquery.getCount();

        const productsquery = this.productRepository
          .createQueryBuilder('product')
          .leftJoin('product.sub_category', 'sub_category')
          .leftJoin('product.brand', 'brands')
          .leftJoin(
            Wishlist,
            'wishlist',
            'wishlist.fk_product_id = product.id AND wishlist.fk_user_id = :userId AND wishlist.is_deleted = 0',
            { userId: req.userId },
          )
          .andWhere('product.fk_subcategory_id = :sub_category', {
            sub_category: params.sub_category,
          })
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
            'product.image AS image',
            'product.stock_status AS stock_status',
            'brands.brand_name AS brand_name',
            'CASE WHEN wishlist.id IS NOT NULL THEN 1 ELSE 0 END AS existInWishlist',
          ]);

        const products = await productsquery
          .offset(skip)
          .limit(limit)
          .getRawMany();
        const Total_Product_count = await productsquery.getCount();

        return {
          subCategory_name,
          brands,
          products,
          Total_Brand_count,
          Total_Product_count,
        };
      }
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }
}
