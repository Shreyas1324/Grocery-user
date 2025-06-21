import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsOptional,
  Length,
  IsEnum,
  IsNotEmpty,
  Min,
  IsNumberString,
} from 'class-validator';

export enum AddressType {
  'Home' = '0',
  'Office' = '1',
  'Hotel' = '2',
  'Other' = '3',
}

export class CreateUserAddressDto {
  @ApiProperty({ name: 'address_line1', example: 'Tristate' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  address_line1: string;

  @ApiProperty({ name: 'address_line2', example: 'Bopal' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  address_line2: string;

  @ApiProperty({ name: 'recepient_name', example: 'Prince' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  recepient_name: string;

  @ApiProperty({ name: 'type', example: '1' })
  @IsNotEmpty()
  @IsNumberString()
  // @IsEnum(AddressType, {
  //   message:
  //     'type must be one of the following values: Home, Office, Hotel, Other',
  // })
  type: number;
}

export class UpdateUserAddressDto {
  @ApiProperty({ name: 'type', example: '1' })
  @IsEnum(AddressType, {
    message:
      'type must be one of the following values: Home, Office, Hotel, Other',
  })
  type: AddressType;

  @ApiProperty({ name: 'address_line1', required: false, example: 'Tristate' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  address_line1?: string;

  @ApiProperty({ name: 'address_line2', required: false, example: 'Bopal' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  address_line2?: string;

  @ApiProperty({ name: 'recepient_name', required: false, example: 'Prince' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  recepient_name?: string;

  @ApiProperty({ name: 'address_id', example: '36' })
  @IsNumberString()
  address_id: number;
}

export class DeleteUserAddressDto {
  @ApiProperty({ name: 'address_id', example: '36' })
  @IsNotEmpty()
  @IsNumberString()
  address_id?: number;
}

export class GetAddressesDto {
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
