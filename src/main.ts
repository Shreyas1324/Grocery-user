import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { resolve } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { SwaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
  );

  const document = SwaggerModule.createDocument(app, SwaggerConfig);
  SwaggerModule.setup('api', app, document); // swagger

  app.useStaticAssets(resolve('./uploads'));
  app.use('/uploads', express.static(resolve('./uploads')));

  //validation
  const validationOptions = { whitelist: true };
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();