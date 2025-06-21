import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  host: process.env.POSTGRES_HOST,

  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [join(__dirname, '../entities/**/*.entity{.ts,.js}')],
  synchronize: false,
  autoLoadEntities: true,
  logging: true,
  ssl: false,
};
