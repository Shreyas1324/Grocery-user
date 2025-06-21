import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumberString } from 'class-validator';

export class addOrderReviewDto {
  @ApiProperty({ name: 'order_id', example: 10 })
  @IsNumberString()
  order_id: number;

  @ApiProperty({ name: 'ratings', example: '5' })
  @IsIn([1, 2, 3, 4, 5])
  @Type(() => Number)
  ratings?: number;
}
