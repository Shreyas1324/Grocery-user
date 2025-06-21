import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class searchParamsDto {
  @ApiProperty({ name: 'search', required: false, example: 'amul' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ name: 'discount', required: false, example: '1,2' })
  @IsOptional()
  @IsString()
  discount?: string;

  @ApiProperty({ name: 'sortby', required: false, example: 1 })
  @IsOptional()
  @IsIn([1, 2, 3, 4, 5, 6, 7])
  @Type(() => Number)
  sortby?: number;

  @ApiProperty({ name: 'page', example: '1' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiProperty({ name: 'brands', required: false, example: '1,2' })
  @IsOptional()
  @IsString()
  brands?: string;

  @ApiProperty({ name: 'maxPrice', required: false, example: '1000' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number;

  @ApiProperty({ name: 'minPrice', required: false, example: '50' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number;

  @ApiProperty({ name: 'limit', example: '3' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @ApiProperty({ name: 'product_id', required: false, example: '51' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  product_id?: number;

  @ApiProperty({ name: 'brand', required: false, example: '4' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  brand?: number;
}

export class ShopByBrandDto {
  @ApiProperty({ name: 'page', example: '1' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiProperty({ name: 'limit', example: '3' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @ApiProperty({ name: 'brand', required: false, example: '4' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  brand?: number;
}

export class BrandListDto {
  @ApiProperty({ name: 'search', required: false, example: 'amul' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ name: 'page', example: '1' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiProperty({ name: 'limit', example: '3' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;
}

export class GetBannersDto {
  @ApiProperty({ name: 'page', example: '1' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiProperty({ name: 'limit', example: '3' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;
}
