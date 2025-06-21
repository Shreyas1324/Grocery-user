import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { signupUserDto, sendOtpDto, loginUserDto } from './dto/user.dto';
import { ResponseService } from '.././../../../common/response.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { NonAuthHeader } from 'src/guard/nonAuth.guard';
import {
  ApiAuthHeaders,
  ApiNonAuthHeaders,
  ApiRefreshHeaders,
} from 'src/common/swagger.decorators';
import { ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';

@Controller('groceryusers')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly responseService: ResponseService,
  ) {}

  /********************SEND OTP********************/
  @Post('/sendotp')
  @UseGuards(NonAuthHeader)
  @ApiNonAuthHeaders()
  @ApiOperation({ summary: 'Send Otp API' })
  async sendOtpController(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: sendOtpDto,
  ) {
    try {
      const data = await this.userService.sendOtpService(body);
      return this.responseService.success(res, 'OTP_SENT', data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }

  /********************LOGIN********************/
  @Post('/login')
  @UseGuards(NonAuthHeader)
  @ApiNonAuthHeaders()
  @ApiOperation({ summary: 'Login API' })
  async loginUserController(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: loginUserDto,
  ) {
    try {
      const requestData = req as unknown as {
        userId: number;
        headers: {
          language: string;
          device_id: string;
          device_type: number;
          app_version: string;
          os: string;
          device_token: string;
        };
      };
      const data = await this.userService.loginUserService(requestData, body);
      return this.responseService.success(res, 'USER_LOGIN_SUCCESS', data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }

  /********************RESEND OTP********************/
  @Post('/resendotp')
  @UseGuards(NonAuthHeader)
  @ApiNonAuthHeaders()
  @ApiOperation({ summary: 'Resend Otp API' })
  async resendOtpController(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: sendOtpDto,
  ) {
    try {
      const data = await this.userService.resendOtpService(body);
      return this.responseService.success(res, 'OTP_RESENT', data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }

  /********************SIGNUP & UPDATE USER DETAILS********************/
  @Post('/signup')
  @UseGuards(AuthGuard)
  @ApiAuthHeaders()
  @ApiOperation({ summary: 'Singup And UpdateUser API' })
  async signUpController(
    @Body() body: signupUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const requestData = req as unknown as { userId: number };
      const data = await this.userService.signUpService(requestData, body);
      return this.responseService.success(res, data?.message, true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }

  /********************GET_USER_BY_ID FOR SHOWING USERDATA********************/
  @Get('/getuserbyid')
  @UseGuards(AuthGuard)
  @ApiAuthHeaders()
  @ApiOperation({ summary: 'Get User Details By Id API' })
  async getUserByIdController(@Req() req: Request, @Res() res: Response) {
    try {
      const requestData = req as unknown as { userId: number };
      const data = await this.userService.getUserByIdService(requestData);

      return this.responseService.success(res, 'SUCCESS', data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }

  /********************LOGOUT********************/
  @Post('/logout')
  @UseGuards(AuthGuard)
  @ApiAuthHeaders()
  @ApiOperation({ summary: 'Logout API' })
  async logoutController(@Req() req: Request, @Res() res: Response) {
    try {
      const requestData = req as unknown as {
        userId: number;
        headers: { device_id: string };
      };
      const data = await this.userService.logoutService(requestData);
      return this.responseService.success(res, 'LOGOUT_SUCCESS', data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }

  @Post('/refreshToken')
  @UseGuards(NonAuthHeader)
  @ApiRefreshHeaders()
  @ApiOperation({ summary: 'Refresh Token API' })
  async refresh_token(@Req() req: Request, @Res() res: Response) {
    try {
      const requestData = req as unknown as {
        userId: number;
        headers: { refresh_token: string; device_id: string };
      };
      const data = await this.userService.refresh_token(requestData);
      return this.responseService.success(res, 'TOKEN_REFRESHED', data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.responseService.error(req, res, error.message);
      } else {
        this.responseService.error(req, res, 'An unknown error occurred');
      }
    }
  }
}
