import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { ResponseService } from '../../../../common/response.service';
import { AuthGuard } from 'src/guard/auth.guard';
import {
  GetReviewDetailsDto,
  GetReviewsDto,
  AddReviewDto,
} from './dto/productReview.dto';
import { addOrderReviewDto } from './dto/addOrderReview.dto';
import { NonAuthHeader } from 'src/guard/nonAuth.guard';
import {
  ApiAuthHeaders,
  ApiNonAuthHeaders,
} from 'src/common/swagger.decorators';
import { ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';

@Controller('groceryusers/review')
export class ReviewController {
  constructor(
    private readonly userService: ReviewService,
    private readonly responseService: ResponseService,
  ) {}

  /********************ADD_THE_PRODUCT_REVIEW********************/
  @Post('/addreview')
  @UseGuards(AuthGuard)
  @ApiAuthHeaders()
  @ApiOperation({ summary: 'Add Review API' })
  async addReviewController(
    @Body() body: AddReviewDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const requestData = req as unknown as { userId: number };
      const data = await this.userService.addReviewService(requestData, body);

      return this.responseService.success(res, 'REVIEW_ADDED_SUCCESS', data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }

  /********************GET_ALL_REVIEWS_OF_PRETICULAR_PRODUCT********************/
  @Get('/getreviews')
  @UseGuards(NonAuthHeader)
  @ApiNonAuthHeaders()
  @ApiOperation({ summary: 'Get All Reviews API' })
  async getReviewController(
    @Req() req: Request,
    @Res() res: Response,
    @Query() params: GetReviewsDto,
  ) {
    try {
      const data = await this.userService.getReviewService(params);
      return this.responseService.success(res, data.message, data.data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }

  /********************GET_REVIEW_DETAILS_WITH_AVERAGE_RATINGS_FOR_PERTICULAR_PRODUCT********************/
  @Get('/getreviewdetails')
  @UseGuards(NonAuthHeader)
  @ApiNonAuthHeaders()
  @ApiOperation({ summary: 'Get Review Details API' })
  async getReviewDetailsController(
    @Req() req: Request,
    @Res() res: Response,
    @Query() params: GetReviewDetailsDto,
  ) {
    try {
      const data = await this.userService.getReviewDetailsService(params);
      return this.responseService.success(
        res,
        data.message,
        data.ReviewDetails,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }

  /********************ADD_ORDER_REVIEW********************/
  @Post('/addorderreview')
  @UseGuards(AuthGuard)
  @ApiAuthHeaders()
  @ApiOperation({ summary: 'Add Order Review API' })
  async addOrderReviewController(
    @Body() body: addOrderReviewDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const requestData = req as unknown as { userId: number };
      const data = await this.userService.addOrderReviewService(
        requestData,
        body,
      );

      return this.responseService.success(res, 'REVIEW_ADDED_SUCCESS', data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }
}
