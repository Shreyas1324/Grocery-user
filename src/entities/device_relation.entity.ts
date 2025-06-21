import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { addUserEntity } from './addUser.entity';

@Entity('device_relation')
export class DeviceRelationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  language: string;

  @Column({ type: 'text', nullable: true })
  refresh_token: string;

  @Column({ type: 'text', nullable: true })
  auth_token: string;

  @Column({ type: 'varchar', nullable: true })
  device_id: string;

  @Column({ type: 'int', nullable: true })
  device_type: number;

  @Column({ type: 'varchar', nullable: true })
  app_version: string;

  @Column({ type: 'varchar', nullable: true })
  os: string;

  @Column({ type: 'text', nullable: true })
  device_token: string;

  @ManyToOne(() => addUserEntity, (user) => user.device, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_user_id' })
  user: addUserEntity;

  @Column({ unique: false, nullable: true })
  fk_user_id: number;
}
