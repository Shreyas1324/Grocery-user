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
import { OrderService } from './order.service';
import { ResponseService } from '../../../../common/response.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { getOrderDetailDto, GetOrderListDto } from './dto/order.dto';
import { ApiAuthHeaders } from 'src/common/swagger.decorators';
import { ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';

@Controller('groceryusers/order')
export class OrderController {
  constructor(
    private readonly userService: OrderService,
    private readonly responseService: ResponseService,
  ) {}

  /********************GET_ORDER_LIST********************/
  @Get('/getorderlist')
  @UseGuards(AuthGuard)
  @ApiAuthHeaders()
  @ApiOperation({ summary: 'Get OrderList API' })
  async getOrderListController(
    @Req() req: Request,
    @Res() res: Response,
    @Query() params: GetOrderListDto,
  ) {
    try {
      const requestData = req as unknown as { userId: number };
      const data = await this.userService.getOrderListService(
        requestData,
        params,
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

  /********************GET_ORDER_DETAIL********************/
  @Get('/getorderdetail')
  @UseGuards(AuthGuard)
  @ApiAuthHeaders()
  @ApiOperation({ summary: 'Get OrderDetails API' })
  async getOrderDetailController(
    @Query() params: getOrderDetailDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const requestData = req as unknown as { userId: number };
      const data = await this.userService.getOrderDetailService(
        requestData,
        params,
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

  /********************REORDER********************/
  @Post('/reorder')
  @UseGuards(AuthGuard)
  @ApiAuthHeaders()
  @ApiOperation({ summary: 'ReOrder API' })
  async ReOrderController(
    @Body() body: getOrderDetailDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const requestData = req as unknown as { userId: number };
      const data = await this.userService.ReOrderService(requestData, body);

      return this.responseService.success(
        res,
        'ALL_PRODUCTS_ADDED_TO_CART',
        data,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }
}
