import { Injectable, Logger } from '@nestjs/common';
import * as messages from './messages.json';
import { Request, Response } from 'express';

@Injectable()
export class ResponseService {
  private readonly logger = new Logger(ResponseService.name);

  error(
    req: Request,
    res: Response,
    msg: unknown,
    statusCode = 500,
    language = 'en',
  ) {
    if (typeof msg === 'string') {
      if (msg.includes(' ') == false) msg = this.getMessage(msg, language);
    }
    const response = {
      code: 0,
      status: 'FAIL',
      message: msg,
    };

    if (msg == 'TOKEN_MALFORMED' || msg == 'TOKEN_NOT_PRESENT') {
      statusCode = 403;
    }

    if (
      msg == 'EMAIL_NOT_EXIST' ||
      msg == 'EMAIL_EXISTS' ||
      msg == 'INVALID_EMAIL' ||
      msg == 'EMAIL_NOT_VERIFIED' ||
      msg == 'INVALID_PASSWORD' ||
      msg == 'INVALID_OLD_PASSWORD' ||
      msg == 'TOKEN_REQUIRED'
    ) {
      statusCode = 400;
    }
    if (msg == 'USER_NOT_FOUND') {
      statusCode = 404;
    }
    if (msg == 'INTERNAL_SERVER_ERROR') {
      statusCode = 500;
    }
    if (msg == 'RECORD_NOT_FOUND') {
      statusCode = 404;
    }
    if (msg == 'USER_BANNED') {
      statusCode = 406;
    }
    if (msg == 'USER_DEACTIVED') {
      statusCode = 403;
    }
    if (msg == 'USER_BLOCKED') {
      statusCode = 406;
    }
    if (msg == 'USER_DELETED') {
      statusCode = 405;
    }
    if (msg == 'RESTAURANT_DEACTIVED_BY_ADMIN') {
      statusCode = 403;
    }
    if (msg == 'ACCOUNT_DELETED') {
      statusCode = 405;
    }
    if (msg == 'INVALID_APP_VERSION' || msg == 'CURRENT_APP_VERSION_EXPIRED') {
      statusCode = 426;
    }
    if (msg == 'jwt expired' || msg == 'TOKEN_EXPIRED') {
      statusCode = 401;
    }
    if (response.code == 500) {
      response.message = 'Internal server error';
    }
    if (statusCode == 22001) {
      console.log('checking:::$$$');

      response.code = 0; // or any other appropriate status code
      statusCode = 400; // or any other appropriate status code
    }

    const d = new Date();
    const formatted_date = `${d.getFullYear()}-${
      d.getMonth() + 1
    }-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    msg = typeof msg == 'object' ? JSON.stringify(msg) : msg;
    this.logger.error(
      `[${formatted_date}] ${req.method}:${req.originalUrl} ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`,
    );

    res.status(statusCode).json(response);
  }

  success(
    res: Response,
    msg: unknown,
    data: unknown,
    statusCode = 200,
    language = 'en',
    total: number | null = null,
  ) {
    try {
      if (typeof msg === 'string') {
        msg = this.getMessage(msg, language);
      }
      const response = {
        code: 1,
        status: 'SUCCESS',
        message: msg,
        data: data /* ? data : {} */,
      };

      if (total) {
        response['total'] = total;
      }
      res.status(statusCode).json(response);
    } catch (error) {
      console.error(`\nsuccess error ->> `, error);
      return;
    }
  }

  getMessage(msg: string, language: string): string {
    const lang = language || 'en';
    const langMessages = messages as Record<string, Record<string, string>>;
    return langMessages[lang]?.[msg] || msg;
    // return messages[lang][msg] || msg;
  }
}
