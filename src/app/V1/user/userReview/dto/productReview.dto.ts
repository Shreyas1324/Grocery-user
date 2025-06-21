import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsInt,
  IsNumberString,
  IsIn,
  Min,
  Length,
  IsNotEmpty,
} from 'class-validator';

export class GetReviewDetailsDto {
  @ApiProperty({ name: 'product_id', example: 51 })
  @IsNumberString()
  product_id: number;
}

export class GetReviewsDto {
  @ApiProperty({ name: 'product_id', example: '51' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  product_id: number;

  @ApiProperty({ name: 'sort', required: false, example: '1' })
  @IsOptional()
  @IsIn([1, 2, 3, 4]) // Assuming valid sort options are 1, 2, and 3
  @Type(() => Number)
  sort?: number;

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

export class AddReviewDto {
  @ApiProperty({ name: 'description', example: '10' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  description: string;

  @ApiProperty({ name: 'ratings', example: '10' })
  @IsNotEmpty()
  // @IsString()
  ratings: number;

  @ApiProperty({ name: 'product_id', example: '10' })
  @IsNotEmpty()
  // @IsString()
  product_id: number;
}
