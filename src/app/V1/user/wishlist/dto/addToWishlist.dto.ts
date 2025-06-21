import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsNotEmpty, Min } from 'class-validator';

export class addToWishlistDto {
  @ApiProperty({ name: 'product_id', example: 51 })
  @IsNotEmpty()
  product_id: number;
}

export class GetWishlistDto {
  @ApiProperty({ name: 'page', example: '1' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiProperty({ name: 'limit', example: '10' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;
}
