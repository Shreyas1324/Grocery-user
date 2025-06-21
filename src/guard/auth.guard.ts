/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NonAuthHeader } from './nonAuth.guard';
import { ResponseService } from 'src/common/response.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as dotenv from 'dotenv';
import { addUserEntity } from 'src/entities/addUser.entity';
import { Request , Response} from 'express';

dotenv.config();


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private nonAuth: NonAuthHeader,
    private responseService: ResponseService,
    @InjectRepository(addUserEntity)
    private userRepo: Repository<addUserEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request  = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const token:  string | undefined = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException('AUTH_TOKEN_REQUIRED');
    }

    try {
      const payload = await this.jwtService.verifyAsync<{ userId: number; is_admin?: number }>(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      if (!payload?.userId) {
        throw new UnauthorizedException('INVALID_TOKEN_PAYLOAD');
      }

      request['userId'] = payload.userId;

      // Check for non-admin (user) header validations
      if (payload.is_admin === 0) {
        // const error: string | null = await this.nonAuth.validateHeaders(request);
        // if (error) {
        //   await this.responseService.error(request, response, error, 501, 'en');
        //   return false;
        // }

        try {
           this.nonAuth.validateHeaders(request);
        } catch (err) {
           this.responseService.error(request, response, err, 501, 'en');
          return false;
        }
      
      }

      const user = await this.userRepo.findOne({
        where: { user_id: payload.userId },
      });

      if (!user) {
        throw new UnauthorizedException('USER_NOT_FOUND');
      }

      return true;

    } catch (err : unknown) {
      const error = err as { message?: string; code?: number; status?: number };
       this.responseService.error(
        request,
        response,
        error.message || 'UNAUTHORIZED',
        error.code || error.status || 401,
      );
      return false;
    }
  }
}
