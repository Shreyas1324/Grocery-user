import { Controller, Req, Res, UseGuards, Get, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { productInfoDto, similarProduct } from './dto/product.dto';
import { ResponseService } from '../../../../common/response.service';
import { ApiNonAuthHeaders } from 'src/common/swagger.decorators';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { Request, Response } from 'express';

@Controller('groceryusers/product')
export class ProductController {
  constructor(
    private readonly userService: ProductService,
    private readonly responseService: ResponseService,
  ) {}

  /********************PRODUCT_INFO********************/
  @Get('/productinfo')
  @UseGuards(AuthGuard)
  @ApiNonAuthHeaders()
  @ApiOperation({ summary: 'Get ProductInfo API' })
  async ProductInfoController(
    @Req() req: Request,
    @Res() res: Response,
    @Query() params: productInfoDto,
  ) {
    try {
      const requestData = req as unknown as { userId: number };
      const data = await this.userService.ProductInfoService(
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

  /********************SIMILAR_PRODUCT********************/
  @Get('/similarproducts')
  @UseGuards(AuthGuard)
  @ApiNonAuthHeaders()
  @ApiOperation({ summary: 'Get Similar Products API' })
  async SimilarProductsController(
    @Req() req: Request,
    @Res() res: Response,
    @Query() params: similarProduct,
  ) {
    try {
      const requestData = req as unknown as { userId: number };
      const data = await this.userService.SimilarProductsService(
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
}
