import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumberString } from 'class-validator';

export class GetCategoriesQueryDto {
  @ApiProperty({ name: 'page', example: '1' })
  @IsOptional()
  @IsNumberString()
  page?: number;

  @ApiProperty({ name: 'limit', example: '3' })
  @IsOptional()
  @IsNumberString()
  limit?: number;

  @ApiProperty({ name: 'category', example: '1' })
  @IsOptional()
  @IsNumberString()
  category?: number;

  @ApiProperty({ name: 'sub_category', example: '2' })
  @IsOptional()
  @IsNumberString()
  sub_category?: number;

  @ApiProperty({ name: 'brand', example: '4' })
  @IsOptional()
  @IsNumberString()
  brand?: number;
}
