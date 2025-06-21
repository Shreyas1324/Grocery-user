import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  Matches,
  IsNotEmpty,
  IsNumberString,
} from 'class-validator';

export class signupUserDto {
  @ApiProperty({ name: 'firstname', example: 'Virat' })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({ name: 'lastname', example: 'Kohli' })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({ name: 'email', example: 'virat@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class sendOtpDto {
  @ApiProperty({ name: 'mobile', example: '9925798545' })
  @IsNotEmpty()
  @IsNumberString()
  @Matches(/^\d{10}$/, { message: 'Mobile number must be exactly 10 digits' })
  mobile: string;
}

export class loginUserDto {
  @ApiProperty({ name: 'mobile', example: '9925798525' })
  @IsNotEmpty()
  @IsNumberString()
  @Matches(/^\d{10}$/, { message: 'Mobile number must be exactly 10 digits' })
  mobile: string;

  @ApiProperty({ name: 'otp', example: '1234' })
  @IsNotEmpty()
  @IsNumberString()
  otp: number;
}

export class UploadIImageDto {
  @IsNotEmpty()
  // @IsString()
  image: string;
}
