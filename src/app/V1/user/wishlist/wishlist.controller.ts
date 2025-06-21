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
import { WishlistService } from './wishlist.service';
import { ResponseService } from '../../../../common/response.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { addToWishlistDto, GetWishlistDto } from './dto/addToWishlist.dto';
import { ApiAuthHeaders } from 'src/common/swagger.decorators';
import { ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';

@Controller('groceryusers/wishlist')
export class WishlistController {
  constructor(
    private readonly userService: WishlistService,
    private readonly responseService: ResponseService,
  ) {}

  /********************ADD_PRODUCT_TO_WISHLIST********************/
  @Post('/addtowishlist')
  @UseGuards(AuthGuard)
  @ApiAuthHeaders()
  @ApiOperation({ summary: 'Add To Wishlist API' })
  async addToWishlistController(
    @Body() body: addToWishlistDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const requestData = req as unknown as { userId: number };
      const data = await this.userService.addToWishlistService(
        requestData,
        body,
      );

      return this.responseService.success(res, data.message, true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }

  /********************GET_ALL_PRODUCTS_FROM_WISHLIST********************/
  @Get('/getwishlist')
  @UseGuards(AuthGuard)
  @ApiAuthHeaders()
  @ApiOperation({ summary: 'Get Wishlist API' })
  async getWishlistController(
    @Req() req: Request,
    @Res() res: Response,
    @Query() params: GetWishlistDto,
  ) {
    try {
      const requestData = req as unknown as { userId: number };
      const data = await this.userService.getWishlistService(
        requestData,
        params,
      );

      return this.responseService.success(res, 'GET_WISHLIST_SUCCESS', data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }
}
