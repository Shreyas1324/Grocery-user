import {
  IsString,
  IsEmail,
  Matches,
  IsNotEmpty,
  IsNumberString,
} from 'class-validator';

export class signupUserDto {
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class sendOtpDto {
  @IsNotEmpty()
  @IsNumberString()
  @Matches(/^\d{10}$/, { message: 'Mobile number must be exactly 10 digits' })
  mobile: string;
}

export class loginUserDto {
  @IsNotEmpty()
  @IsNumberString()
  @Matches(/^\d{10}$/, { message: 'Mobile number must be exactly 10 digits' })
  mobile: string;

  @IsNotEmpty()
  @IsNumberString()
  otp: number;
}
