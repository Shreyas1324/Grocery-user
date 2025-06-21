import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { addUserEntity } from '.././../../../entities/addUser.entity';
import { JwtService } from '@nestjs/jwt';
import { DeviceRelationEntity } from 'src/entities/device_relation.entity';
import { loginUserDto, sendOtpDto, signupUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(addUserEntity)
    private userRepository: Repository<addUserEntity>,
    @InjectRepository(DeviceRelationEntity)
    private deviceRelationRepository: Repository<DeviceRelationEntity>,
  ) {}

  async sendOtpService(body: sendOtpDto) {
    try {
      const { mobile } = body;

      const otp = 1234;
      const data = { mobile, otp };

      const isUserExist = await this.userRepository.findOne({
        where: { mobile: mobile },
      });

      if (isUserExist) {
        await this.userRepository.update({ mobile: mobile }, { otp: otp });
      } else {
        await this.userRepository.save(data);
      }

      return true;
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async loginUserService(
    req: {
      userId: number;
      headers: {
        language: string;
        device_id: string;
        device_type: number;
        app_version: string;
        os: string;
        device_token: string;
      };
    },
    body: loginUserDto,
  ) {
    try {
      const { mobile, otp } = body;
      const {
        language,
        device_id,
        device_type,
        app_version,
        os,
        device_token,
      } = req.headers;

      if (!mobile || !otp) {
        throw new Error('OTP_AND_MOBILE_REQUIRE');
      }

      const isUserExist = await this.userRepository.findOne({
        where: { mobile: mobile },
      });

      if (!isUserExist) {
        throw new Error('USER_NOT_FOUND');
      }

      if (isUserExist.otp == otp) {
        await this.userRepository.update(
          { user_id: isUserExist.user_id },
          { is_verified: 1, otp: null },
        );
      } else {
        throw new Error('INVALID_OTP');
      }

      const token: string = this.jwtService.sign(
        { userId: isUserExist.user_id, is_admin: 0 },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: process.env.JWT_EXPIRE_TIME,
        },
      );

      const refresh_token: string = this.jwtService.sign(
        { userId: isUserExist.user_id, is_admin: 0 },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: process.env.REFRESH_EXPIRE_TIME,
        },
      );

      const isDeviceUserExist = await this.deviceRelationRepository.findOne({
        where: {
          device_id: req.headers.device_id,
          fk_user_id: isUserExist.user_id,
        },
      });
      if (isDeviceUserExist) {
        await this.deviceRelationRepository.update(
          { device_id: req.headers.device_id, fk_user_id: isUserExist.user_id },
          {
            auth_token: token,
            refresh_token: refresh_token,
          },
        );
      } else {
        await this.deviceRelationRepository.save({
          device_id,
          device_type,
          os,
          app_version,
          language,
          device_token,
          fk_user_id: isUserExist.user_id,
          auth_token: token,
          refresh_token: refresh_token,
        });
      }

      return {
        auth_token: token,
        refresh_token: refresh_token,
        is_profileCreated: isUserExist.is_profileCreated,
      };
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async resendOtpService(body: sendOtpDto) {
    try {
      const { mobile } = body;
      const otp = 1234;

      const isUserExist = await this.userRepository.findOne({
        where: { mobile: mobile },
      });

      if (isUserExist) {
        await this.userRepository.update({ mobile: mobile }, { otp: otp });
      } else {
        throw new Error('USER_NOT_FOUND');
      }

      return true;
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async signUpService(req: { userId: number }, body: signupUserDto) {
    try {
      const deviceExists = await this.deviceRelationRepository.findOne({
        where: { fk_user_id: req.userId },
      });
      if (!deviceExists) {
        throw new Error('USER_NOT_REGISTERED');
      }

      const { firstname, lastname, email } = body;

      const isUserExist = await this.userRepository.findOne({
        where: { user_id: req.userId },
      });

      if (isUserExist?.is_profileCreated == 0) {
        const isEmailExist = await this.userRepository.findOne({
          where: { email: email },
        });

        if (isEmailExist) {
          throw new Error('EMAIL_ALREADY_EXITS');
        } else {
          await this.userRepository.update(
            { user_id: req.userId },
            {
              firstname: firstname,
              lastname: lastname,
              email: email,
              is_profileCreated: 1,
            },
          );

          return { message: 'SIGNUP_SUCCESS' };
        }
      } else {
        if (email) {
          const isEmailExist = await this.userRepository.findOne({
            where: {
              email: email,
              user_id: Not(req.userId),
            },
          });

          if (isEmailExist) {
            throw new Error('EMAIL_ALREADY_EXITS');
          }

          await this.userRepository.update(
            { user_id: req.userId },
            {
              firstname: firstname,
              lastname: lastname,
              email: email,
              is_profileCreated: 1,
            },
          );

          return { message: 'UPDATE_SUCCESS' };
        }
      }
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async getUserByIdService(req: { userId: number }) {
    try {
      const deviceExists = await this.deviceRelationRepository.findOne({
        where: { fk_user_id: req.userId },
      });
      if (!deviceExists) {
        throw new Error('USER_NOT_REGISTERED');
      }

      const userDetails = (await this.userRepository
        .createQueryBuilder('user')
        .select([
          'user.firstname AS firstname',
          'user.lastname AS lastname',
          'user.email AS email',
          'user.mobile AS mobile',
        ])
        .where({ user_id: req.userId })
        .getRawOne()) as Partial<addUserEntity>;

      return userDetails;
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async logoutService(req: { userId: number; headers: { device_id: string } }) {
    try {
      const deviceExists = await this.deviceRelationRepository.findOne({
        where: { fk_user_id: req.userId },
      });
      if (!deviceExists) {
        throw new Error('USER_NOT_REGISTERED');
      }

      const isDeviceUserExist = await this.deviceRelationRepository.findOne({
        where: {
          device_id: req.headers.device_id,
          fk_user_id: req.userId,
        },
      });
      if (!isDeviceUserExist) {
        throw new Error('Incorrect Device_id or User_id');
      }

      await this.deviceRelationRepository.delete(isDeviceUserExist);

      return true;
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async refresh_token(req: {
    userId: number;
    headers: { refresh_token: string; device_id: string };
  }) {
    try {
      if (!req.headers.refresh_token) {
        throw new Error('REFRESH_TOKEN_REQUIRED');
      }

      const refreshData = await this.deviceRelationRepository.findOne({
        where: {
          refresh_token: req.headers.refresh_token,
        },
      });

      if (!refreshData) {
        throw new Error('REFRESH_MALFORMED');
      }

      const token: string = this.jwtService.sign(
        { userId: refreshData.fk_user_id, isUser: true },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: process.env.JWT_EXPIRE_TIME,
        },
      );

      await this.deviceRelationRepository.update(
        {
          fk_user_id: refreshData.fk_user_id,
          device_id: req.headers.device_id,
        },
        {
          auth_token: token,
        },
      );

      return { auth_token: token };
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }
}
