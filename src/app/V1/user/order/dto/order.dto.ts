import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  Min,
} from 'class-validator';

export class getOrderDetailDto {
  @ApiProperty({ name: 'order_id', example: 11 })
  @IsNotEmpty()
  @IsNumberString()
  order_id: number;
}

export class GetOrderListDto {
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
