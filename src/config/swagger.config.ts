import { DocumentBuilder } from '@nestjs/swagger';

export const SwaggerConfig = new DocumentBuilder()
  .setTitle('Grocery User')
  .addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    'authorization',
  )
  .setDescription('Grocery API documentation')
  .setVersion('1.0')
  .build();
