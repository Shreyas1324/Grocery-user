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
import { AddressService } from './address.service';
import { ResponseService } from '.././../../../common/response.service';
import { AuthGuard } from 'src/guard/auth.guard';
import {
  CreateUserAddressDto,
  UpdateUserAddressDto,
  DeleteUserAddressDto,
  GetAddressesDto,
} from './dto/address.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ApiAuthHeaders } from 'src/common/swagger.decorators';
import { Request, Response } from 'express';

@Controller('groceryusers/address')
export class AddressController {
  constructor(
    private readonly userService: AddressService,
    private readonly responseService: ResponseService,
  ) {}

  /********************ADD_ADDRESS********************/
  @Post('/addaddress')
  @UseGuards(AuthGuard)
  @ApiAuthHeaders()
  @ApiOperation({ summary: 'Add Address API' })
  async addaddressController(
    @Body() body: CreateUserAddressDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const requestData = req as unknown as { userId: number };
      const data = await this.userService.addAddressService(requestData, body);

      return this.responseService.success(res, 'ADDRESS_ADDED_SUCCESS', data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }

  /********************UPDATE_ADDRESS********************/
  @Post('/updateaddress')
  @UseGuards(AuthGuard)
  @ApiAuthHeaders()
  @ApiOperation({ summary: 'Update Address API' })
  async updateAddressController(
    @Body() body: UpdateUserAddressDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const requestData = req as unknown as { userId: number };
      const data = await this.userService.updateAddressService(
        requestData,
        body,
      );

      return this.responseService.success(res, 'ADDRESS_UPDATED_SUCCESS', data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }

  /********************DELETE_ADDRESS********************/
  @Post('/deleteaddress')
  @UseGuards(AuthGuard)
  @ApiAuthHeaders()
  @ApiOperation({ summary: 'Delete Address API' })
  async deleteAddressController(
    @Body() body: DeleteUserAddressDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const requestData = req as unknown as { userId: number };
      const data = await this.userService.deleteAddressService(
        requestData,
        body,
      );
      return this.responseService.success(res, 'ADDRESS_DELETED_SUCCESS', data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }

  /********************GET_ALL_ADDRESSES_OF_USER********************/
  @Get('/getaddress')
  @UseGuards(AuthGuard)
  @ApiAuthHeaders()
  @ApiOperation({ summary: 'Get All Address API' })
  async getAddressController(
    @Req() req: Request,
    @Res() res: Response,
    @Query() params: GetAddressesDto,
  ) {
    try {
      const requestData = req as unknown as { userId: number };
      const data = await this.userService.getAddressService(
        requestData,
        params,
      );
      return this.responseService.success(res, 'GET_ADDRESS_SUCCESS', data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }
}
