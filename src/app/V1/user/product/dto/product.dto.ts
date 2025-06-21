import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class productInfoDto {
  @ApiProperty({ name: 'product', example: '51' })
  @IsNotEmpty()
  @IsNumberString()
  product: number;
}

export class similarProduct {
  @ApiProperty({ name: 'product', example: '51' })
  @IsNotEmpty()
  @IsNumberString()
  product: number;

  @ApiProperty({ name: 'category', example: '1' })
  @IsNotEmpty()
  @IsNumberString()
  category: number;

  @ApiProperty({ name: 'page', example: '1' })
  @IsNotEmpty()
  @IsNumberString()
  page: number;

  @ApiProperty({ name: 'limit', example: '3' })
  @IsNotEmpty()
  @IsNumberString()
  limit: number;
}
