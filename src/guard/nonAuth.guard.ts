/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request} from 'express';

@Injectable()
export class NonAuthHeader implements CanActivate {
  constructor(
  ) {}

   canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    // use validateHeaders here
   this.validateHeaders(request);

    return true;
  }

     validateHeaders(request: Request): void {
    const headers = request.headers;

    const requiredHeaders = [
      'language',
      'device_id',
      'device_type',
      'app_version',
      'os',
      'device_token',
    ];

    for (const header of requiredHeaders) {
      const headerValue = headers[header] as string | undefined;

        if (!headerValue || headerValue.trim() === '') {
          throw new UnauthorizedException(`${header.toUpperCase()}_REQUIRED`);
        }
    }

  }
}

