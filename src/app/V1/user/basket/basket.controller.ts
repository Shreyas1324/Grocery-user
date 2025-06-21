import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  Get,
} from '@nestjs/common';
import { BasketService } from './basket.service';
import { ResponseService } from '../../../../common/response.service';
import { AuthGuard } from 'src/guard/auth.guard';
import {
  addToBasketDto,
  checkOutDto,
  CompleteCartDto,
  CouponVerifyDto,
  deleteFromBasketDto,
} from './dto/Basket.dto';
import { ApiAuthHeaders } from 'src/common/swagger.decorators';
import { ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { NonAuthHeader } from 'src/guard/nonAuth.guard';

@Controller('groceryusers/basket')
export class BasketController {
  constructor(
    private readonly userService: BasketService,
    private readonly responseService: ResponseService,
  ) {}

  /********************ADD_PRODUCT_TO_BASKET********************/
  @Post('/addtobasket')
  @UseGuards(AuthGuard)
  @ApiAuthHeaders()
  @ApiOperation({ summary: 'Add To Basket API' })
  async addToBasketController(
    @Body() body: addToBasketDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const requestData = req as unknown as { userId: number };
      const data = await this.userService.addToBasketService(requestData, body);
      return this.responseService.success(res, data.message, true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }

  /********************DELETE_PRODUCT_FROM_BASKET********************/
  @Post('/deletefrombasket')
  @UseGuards(AuthGuard)
  @ApiAuthHeaders()
  @ApiOperation({ summary: 'Delete From Basket API' })
  async deleteFromBasketController(
    @Body() body: deleteFromBasketDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const requestData = req as unknown as { userId: number };
      const data = await this.userService.deleteFromBasketService(
        requestData,
        body,
      );

      return this.responseService.success(res, 'PRODUCT_DELETED', data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }

  /********************GET_BASKET********************/
  @Get('/getbasketcount')
  @UseGuards(AuthGuard)
  @ApiAuthHeaders()
  @ApiOperation({ summary: 'Get Basket Count API' })
  async getBasketCountController(@Req() req: Request, @Res() res: Response) {
    try {
      const requestData = req as unknown as { userId: number };
      const data = await this.userService.getBasketCountService(requestData);

      return this.responseService.success(res, 'SUCCESS', data.Total_count);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }

  /********************GET_COMPLETE_BASKET********************/
  @Get('/getCompleteBasket')
  @UseGuards(AuthGuard)
  @ApiAuthHeaders()
  @ApiOperation({ summary: 'Get Complete Basket API' })
  async getCompleteBasketController(
    @Body() body: CompleteCartDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const requestData = req as unknown as { userId: number };
      const data = await this.userService.getCompleteBasketService(
        requestData,
        body,
      );

      return this.responseService.success(res, 'SUCCESS', data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }

  /********************CHECKOUT********************/
  @Post('/checkout')
  @UseGuards(AuthGuard)
  @ApiAuthHeaders()
  @ApiOperation({ summary: 'Checkout API' })
  async checkoutController(
    @Body() body: checkOutDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const requestData = req as unknown as { userId: number };
      const data = await this.userService.checkoutService(requestData, body);
      return this.responseService.success(res, 'SUCCESS', data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }

  /********************VERIFY_COUPON********************/
  @Post('/verifyCoupon')
  @UseGuards(NonAuthHeader)
  @ApiAuthHeaders()
  @ApiOperation({ summary: 'verify Coupon API' })
  async verifyCouponController(
    @Body() body: CouponVerifyDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const requestData = req as unknown as { userId: number };
      const data = await this.userService.verifyCouponService(
        requestData,
        body,
      );
      return this.responseService.success(res, data?.message, true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }
}
