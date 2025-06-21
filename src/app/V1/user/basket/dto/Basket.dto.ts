import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsIn,
  IsNumberString,
  IsInt,
  Min,
} from 'class-validator';

export class addToBasketDto {
  @ApiProperty({ name: 'Quantity', example: '0 OR 1' })
  @IsIn([0, 1])
  @Type(() => Number)
  Quantity?: number;

  @ApiProperty({ name: 'product_id', example: 51 })
  @IsNumberString()
  product_id: number;

  // @ApiProperty({ name: 'variation', example: '1 OR 2,3,4,5,6' })
  // @IsOptional()
  // @IsIn([1, 2, 3, 4, 5, 6])
  // @Type(() => Number)
  // variation?: number;
}

export class deleteFromBasketDto {
  @ApiProperty({ name: 'product_id', example: 51 })
  @IsNumberString()
  product_id: number;
}

export class CompleteCartDto {
  @ApiProperty({ name: 'coupon_code', example: '123456' })
  @IsOptional()
  @IsString()
  coupon_code: string;
}

export class checkOutDto {
  @ApiProperty({ name: 'address_id', example: 51 })
  @IsNumberString()
  address_id: number;

  @ApiProperty({ name: 'coupon_code', example: '123456' })
  @IsOptional()
  @IsString()
  coupon_code: string;
}

export class CouponVerifyDto {
  @ApiProperty({ name: 'coupon_code', example: '123456' })
  @IsOptional()
  @IsString()
  coupon_code: string;
}

export class GetBasketDto {
  @ApiProperty({ name: 'page', example: '1' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiProperty({ name: 'limit', example: '5' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;
}
