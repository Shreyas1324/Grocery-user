import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAddressEntity } from 'src/entities/addUserAddress.entity';
import { DeviceRelationEntity } from 'src/entities/device_relation.entity';
import {
  CreateUserAddressDto,
  DeleteUserAddressDto,
  GetAddressesDto,
  UpdateUserAddressDto,
} from './dto/address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(UserAddressEntity)
    private userAddressRepository: Repository<UserAddressEntity>,
    @InjectRepository(DeviceRelationEntity)
    private deviceRelationRepository: Repository<DeviceRelationEntity>,
  ) {}

  async addAddressService(req: { userId: number }, body: CreateUserAddressDto) {
    try {
      const deviceExists = await this.deviceRelationRepository.findOne({
        where: { fk_user_id: req.userId },
      });
      if (!deviceExists) {
        throw new Error('USER_NOT_REGISTERED');
      }

      const { address_line1, address_line2, recepient_name, type } = body;

      if (!type) {
        throw new Error('ADDRESS_TYPE_REQUIRE');
      }

      const data = {
        address_line1,
        address_line2,
        recepient_name,
        type,
        user_id: req.userId,
      };

      await this.userAddressRepository.save(data);

      return true;
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async updateAddressService(
    req: { userId: number },
    body: UpdateUserAddressDto,
  ) {
    try {
      const deviceExists = await this.deviceRelationRepository.findOne({
        where: { fk_user_id: req.userId },
      });
      if (!deviceExists) {
        throw new Error('USER_NOT_REGISTERED');
      }

      const { address_id, address_line1, address_line2, recepient_name, type } =
        body;

      const isUserAddressExists = await this.userAddressRepository.findOne({
        where: { address_id: address_id, user_id: req.userId },
      });

      if (!isUserAddressExists) {
        throw new Error('INVALID_ADDRESS');
      }

      await this.userAddressRepository.update(
        { user_id: req.userId, address_id: address_id },
        {
          address_line1: address_line1,
          address_line2: address_line2,
          recepient_name: recepient_name,
          type: +type,
        },
      );

      return true;
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async deleteAddressService(
    req: { userId: number },
    body: DeleteUserAddressDto,
  ) {
    try {
      const deviceExists = await this.deviceRelationRepository.findOne({
        where: { fk_user_id: req.userId },
      });
      if (!deviceExists) {
        throw new Error('USER_NOT_REGISTERED');
      }

      const { address_id } = body;

      const isUserAddressExists = await this.userAddressRepository.findOne({
        where: { address_id: address_id, user_id: req.userId, is_deleted: 0 },
      });

      if (!isUserAddressExists) {
        throw new Error('INVALID_ADDRESS');
      } else {
        await this.userAddressRepository.update(
          { user_id: req.userId, address_id: address_id },
          {
            is_deleted: 1,
          },
        );

        return true;
      }
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }

  async getAddressService(req: { userId: number }, params: GetAddressesDto) {
    try {
      const page = params.page || 1;
      const limit = params.limit || 3;
      const skip = (page - 1) * limit;

      const deviceExists = await this.deviceRelationRepository.findOne({
        where: { fk_user_id: req.userId },
      });
      if (!deviceExists) {
        throw new Error('USER_NOT_REGISTERED');
      }

      const addresses = this.userAddressRepository
        .createQueryBuilder('a')
        .select([
          'a.address_id AS address_id',
          'a.address_line1 AS address_line1',
          'a.address_line2 AS address_line2',
          'a.recepient_name AS recepient_name',
          'a.type AS type',
        ])
        .where({ user_id: req.userId, is_deleted: 0 }) // .groupBy("a.type")
        .orderBy('a.created_date', 'ASC');

      const address = await addresses.offset(skip).limit(limit).getRawMany();

      const Total_count = await addresses.getCount();

      return { Total_count, address };
    } catch (error) {
      console.log('errr', error);
      throw error;
    }
  }
}
