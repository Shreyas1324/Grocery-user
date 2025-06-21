import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from 'src/entities/products.entity';
import { Review } from 'src/entities/review.entity';
import { Order } from 'src/entities/orders.entity';
import { orderReview } from 'src/entities/order_review.entity';
import { DeviceRelationEntity } from 'src/entities/device_relation.entity';
import {
  AddReviewDto,
  GetReviewDetailsDto,
  GetReviewsDto,
} from './dto/productReview.dto';
import { addOrderReviewDto } from './dto/addOrderReview.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(orderReview)
    private orderreviewRepository: Repository<orderReview>,
    @InjectRepository(DeviceRelationEntity)
    private deviceRelationRepository: Repository<DeviceRelationEntity>,
  ) {}

  async addReviewService(req: { userId: number }, body: AddReviewDto) {
    try {
      const deviceExists = await this.deviceRelationRepository.findOne({
        where: { fk_user_id: req.userId },
      });
      if (!deviceExists) {
        throw new Error('USER_NOT_REGISTERED');
      }

      const { ratings, description, product_id } = body;

      const data = {
        ratings,
        description,
        fk_product_id: product_id,
        fk_user_id: req.userId,
      };

      const isProductExist = await this.productRepository.findOne({
        where: { id: product_id },
      });
      if (!isProductExist) {
        throw new Error('Invalid Product Please Check Product_id');
      }

      await this.reviewRepository.save(data);
      return true;
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async getReviewService(params: GetReviewsDto) {
    try {
      const page = params.page || 1;
      const limit = params.limit || 3;
      const skip = (page - 1) * limit;

      const isProductExist = await this.productRepository.findOne({
        where: { id: params.product_id },
      });
      if (!isProductExist) {
        throw new Error('Invalid Product Please Check Product_id');
      }

      const isRatingExist = await this.reviewRepository.find({
        where: { fk_product_id: params.product_id },
      });
      if (!isRatingExist || isRatingExist.length <= 0) {
        return { message: 'NO_PRODUCT_REVIEW' };
      }

      if (params.sort == 1) {
        //Not Workable Yet
      }

      let reviews: SelectQueryBuilder<Review>;
      if (params.sort == 2) {
        reviews = this.reviewRepository
          .createQueryBuilder('review')
          .leftJoin('review.user', 'user')
          .where(
            'review.fk_product_id = :product_id AND review.description IS NOT NULL',
            {
              product_id: params.product_id,
            },
          )
          .select([
            'review.ratings AS ratings',
            'review.description AS description',
            'review.created_date AS created_date',
          ])
          .addSelect("CONCAT(user.firstname, ' ', user.lastname)", 'fullname');
      } else if (params.sort == 3) {
        reviews = this.reviewRepository
          .createQueryBuilder('review')
          .leftJoin('review.user', 'user')
          .where(
            'review.fk_product_id = :product_id AND review.description IS NOT NULL',
            {
              product_id: params.product_id,
            },
          )
          .select([
            'review.ratings AS ratings',
            'review.description AS description',
            'review.created_date AS created_date',
          ])
          .addSelect("CONCAT(user.firstname, ' ', user.lastname)", 'fullname')
          .orderBy('review.ratings', 'DESC');
      } else if (params.sort == 4) {
        reviews = this.reviewRepository
          .createQueryBuilder('review')
          .leftJoin('review.user', 'user')
          .where(
            'review.fk_product_id = :product_id AND review.description IS NOT NULL',
            {
              product_id: params.product_id,
            },
          )
          .select([
            'review.ratings AS ratings',
            'review.description AS description',
            'review.created_date AS created_date',
          ])
          .addSelect("CONCAT(user.firstname, ' ', user.lastname)", 'fullname')
          .orderBy('review.ratings', 'ASC');
      } else {
        reviews = this.reviewRepository
          .createQueryBuilder('review')
          .leftJoin('review.user', 'user')
          .where(
            'review.fk_product_id = :product_id AND review.description IS NOT NULL',
            {
              product_id: params.product_id,
            },
          )
          .select([
            'review.ratings AS ratings',
            'review.description AS description',
            'review.created_date AS created_date',
          ])
          .addSelect("CONCAT(user.firstname, ' ', user.lastname)", 'fullname');
      }

      const reviewsList: Partial<Review>[] = await reviews
        .offset(skip)
        .limit(limit)
        .getRawMany();
      const Total_count: number = await reviews.getCount();
      const data = { reviewsList, Total_count };

      return { data, message: 'GET_REVIEWS_SUCCESS' };
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async getReviewDetailsService(params: GetReviewDetailsDto) {
    try {
      const isProductExist = await this.productRepository.findOne({
        where: { id: params.product_id },
      });
      if (!isProductExist) {
        throw new Error('Invalid Product Please Check Product_id');
      }

      const isRatingExist = await this.reviewRepository.find({
        where: { fk_product_id: params.product_id },
      });

      const rawReviewDetails = (await this.reviewRepository
        .createQueryBuilder('review')
        .where('review.fk_product_id = :product_id', {
          product_id: params.product_id,
        })
        .select(['ROUND(AVG(review.ratings),1) AS average_rating'])
        .addSelect(
          'COUNT(CASE WHEN review.ratings = 5 THEN 1 END) AS five_star_count',
        )
        .addSelect(
          'COUNT(CASE WHEN review.ratings = 4 THEN 1 END) AS four_star_count',
        )
        .addSelect(
          'COUNT(CASE WHEN review.ratings = 3 THEN 1 END) AS three_star_count',
        )
        .addSelect(
          'COUNT(CASE WHEN review.ratings = 2 THEN 1 END) AS two_star_count',
        )
        .addSelect(
          'COUNT(CASE WHEN review.ratings = 1 THEN 1 END) AS one_star_count',
        )
        .addSelect('COUNT(review.ratings) AS total_ratings_count')
        .addSelect('COUNT(review.description) AS total_reviews_count')
        .getRawOne()) as {
        average_rating: string;
        five_star_count: string;
        four_star_count: string;
        three_star_count: string;
        two_star_count: string;
        one_star_count: string;
        total_ratings_count: string;
        total_reviews_count: string;
      };

      const ReviewDetails = {
        average_rating: parseFloat(rawReviewDetails.average_rating),
        five_star_count: +(
          parseInt(rawReviewDetails.five_star_count) /
          parseInt(rawReviewDetails.total_ratings_count)
        ).toFixed(2),
        four_star_count: +(
          parseInt(rawReviewDetails.four_star_count) /
          parseInt(rawReviewDetails.total_ratings_count)
        ).toFixed(2),
        three_star_count: +(
          parseInt(rawReviewDetails.three_star_count) /
          parseInt(rawReviewDetails.total_ratings_count)
        ).toFixed(2),
        two_star_count: +(
          parseInt(rawReviewDetails.two_star_count) /
          parseInt(rawReviewDetails.total_ratings_count)
        ).toFixed(2),
        one_star_count: +(
          parseInt(rawReviewDetails.one_star_count) /
          parseInt(rawReviewDetails.total_ratings_count)
        ).toFixed(2),
        total_ratings_count: parseInt(rawReviewDetails.total_ratings_count),
        total_reviews_count: parseInt(rawReviewDetails.total_reviews_count),
      };

      // if (!rawReviewDetails) {
      //   throw new Error('No review data found for this product.');
      // }

      if (!isRatingExist || isRatingExist.length <= 0) {
        const ReviewDetails = {
          average_rating: 0,
          five_star_count: 0,
          four_star_count: 0,
          three_star_count: 0,
          two_star_count: 0,
          one_star_count: 0,
          total_ratings_count: parseInt(rawReviewDetails.total_ratings_count),
          total_reviews_count: parseInt(rawReviewDetails.total_reviews_count),
        };
        return { ReviewDetails, message: 'NO_PRODUCT_REVIEW' };
      }

      return { ReviewDetails, message: 'GET_REVIEWS_SUCCESS' };
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async addOrderReviewService(
    req: { userId: number },
    body: addOrderReviewDto,
  ) {
    try {
      const deviceExists = await this.deviceRelationRepository.findOne({
        where: { fk_user_id: req.userId },
      });

      if (!deviceExists) {
        throw new Error('USER_NOT_REGISTERED');
      }

      const { order_id, ratings } = body;

      const isUserOrderExist = await this.orderRepository.findOne({
        where: { order_id: order_id, fk_user_id: req.userId },
      });
      if (!isUserOrderExist) {
        throw new Error(
          'Invalid order Or user Please Check order_id and user_id',
        );
      }

      const isReviewExistByUser = await this.orderreviewRepository.findOne({
        where: { fk_order_id: order_id, fk_user_id: req.userId },
      });

      if (isReviewExistByUser) {
        throw new Error('ALREADY_REVIEWED');
      } else {
        const data = {
          fk_order_id: order_id,
          ratings: ratings,
          fk_user_id: req.userId,
        };
        await this.orderreviewRepository.save(data);
        return true;
      }
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }
}
