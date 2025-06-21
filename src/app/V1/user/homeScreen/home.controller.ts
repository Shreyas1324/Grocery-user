import { Controller, Req, Res, UseGuards, Get, Query } from '@nestjs/common';
import { HomeScreenService } from './home.service';
import { ResponseService } from '../../../../common/response.service';
import {
  BrandListDto,
  GetBannersDto,
  searchParamsDto,
  ShopByBrandDto,
} from './dto/searchParams.dto';
import { GetCategoriesQueryDto } from './dto/homeParams.dto';
import { NonAuthHeader } from 'src/guard/nonAuth.guard';
import { ApiNonAuthHeaders } from 'src/common/swagger.decorators';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { Request, Response } from 'express';

@Controller('groceryusers/home')
export class HomeScreenController {
  constructor(
    private readonly userService: HomeScreenService,
    private readonly responseService: ResponseService,
  ) {}

  /********************GET_BANNERS_FOR_HOMEPAGE********************/
  @Get('/getbanners')
  @UseGuards(NonAuthHeader)
  @ApiNonAuthHeaders()
  @ApiOperation({ summary: 'Get Banners API' })
  async getBannerController(
    @Req() req: Request,
    @Res() res: Response,
    @Query() params: GetBannersDto,
  ) {
    try {
      const data = await this.userService.getBannerService(params);
      return this.responseService.success(res, 'GET_BANNER_SUCCESS', data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }

  /********************SEARCH-GET********************/
  @Get('/searchfilter')
  @UseGuards(AuthGuard)
  @ApiNonAuthHeaders()
  @ApiOperation({ summary: 'Search Filter API' })
  async searchProductController(
    @Req() req: Request,
    @Res() res: Response,
    @Query() params: searchParamsDto,
  ) {
    try {
      const requestData = req as unknown as { userId: number };
      const data = await this.userService.searchProductService(
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

  /********************Brands_List********************/
  @Get('/brandlist')
  @UseGuards(NonAuthHeader)
  @ApiNonAuthHeaders()
  @ApiOperation({ summary: 'Get BrandList API' })
  async brandListController(
    @Req() req: Request,
    @Res() res: Response,
    @Query() params: BrandListDto,
  ) {
    try {
      const data = await this.userService.brandListService(params);
      return this.responseService.success(res, 'GET_BRANDLIST_SUCCESS', data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }

  /********************Discount_List********************/
  @Get('/discountlist')
  @UseGuards(NonAuthHeader)
  @ApiNonAuthHeaders()
  @ApiOperation({ summary: 'Get DiscountList API' })
  async discountListController(
    @Req() req: Request,
    @Res() res: Response,
    @Query() params: GetBannersDto,
  ) {
    try {
      const data = await this.userService.discountListService(params);
      return this.responseService.success(
        res,
        'GET_DISCOUNTLIST_SUCCESS',
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

  /********************Sortby_List********************/
  @Get('/sortby')
  @UseGuards(NonAuthHeader)
  @ApiNonAuthHeaders()
  @ApiOperation({ summary: 'Get SortByList API' })
  async sortbyController(
    @Req() req: Request,
    @Res() res: Response,
    @Query() params: GetBannersDto,
  ) {
    try {
      const data = await this.userService.sortbyService(params);
      return this.responseService.success(res, 'GET_SORTBY_SUCCESS', data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }

  /********************GET_CATEGORY_SUB-CATEGORY_PRODUCTS********************/
  @Get('/getcategories')
  @UseGuards(AuthGuard)
  @ApiNonAuthHeaders()
  @ApiOperation({ summary: 'Get Categories API' })
  async getCategoriesController(
    @Req() req: Request,
    @Res() res: Response,
    @Query() params: GetCategoriesQueryDto,
  ) {
    try {
      const requestData = req as unknown as { userId: number };
      const data = await this.userService.getCategoriesService(
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

  /********************GET_SHOP_BRANDS_FOR_HOMEPAGE********************/
  @Get('/shopBybrands')
  @UseGuards(AuthGuard)
  @ApiNonAuthHeaders()
  @ApiOperation({ summary: 'Shop By Brands API' })
  async shopByBrandsController(
    @Req() req: Request,
    @Res() res: Response,
    @Query() params: ShopByBrandDto,
  ) {
    try {
      const requestData = req as unknown as { userId: number };
      const data = await this.userService.shopByBrandsService(
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

  /********************GET_BEST_SELLER_PRODUCTS********************/
  @Get('/getbestsellerproducts')
  @UseGuards(AuthGuard)
  @ApiNonAuthHeaders()
  @ApiOperation({ summary: 'Get Best Seller Products API' })
  async getBestSellerProductsController(
    @Req() req: Request,
    @Res() res: Response,
    @Query() params: GetBannersDto,
  ) {
    try {
      const requestData = req as unknown as { userId: number };
      const data = await this.userService.getBestSellerProductsService(
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

  /********************GET_CATEGORY_SUB-CATEGORY_PRODUCTS********************/
  @Get('/shopbycategory')
  @UseGuards(AuthGuard)
  @ApiNonAuthHeaders()
  @ApiOperation({ summary: 'Shop By Category API' })
  async ShopByCategoryController(
    @Req() req: Request,
    @Res() res: Response,
    @Query() params: GetCategoriesQueryDto,
  ) {
    try {
      const requestData = req as unknown as { userId: number };
      const data = await this.userService.ShopByCategoryService(
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
