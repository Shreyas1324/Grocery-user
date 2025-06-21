import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { addUserEntity } from './addUser.entity';
import { Order } from './orders.entity';

@Entity('grocery_users_address')
export class UserAddressEntity {
  @PrimaryGeneratedColumn()
  address_id: number;

  @ManyToOne(() => addUserEntity, (user) => user.address, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: addUserEntity;

  @Column({ nullable: true })
  user_id: number;

  @Column({ type: 'varchar', length: 255 })
  address_line1: string;

  @Column({ type: 'varchar', length: 255 })
  address_line2: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_date: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  modified_date: Date;

  @Column({ type: 'varchar', length: 255 })
  recepient_name: string;

  @Column({ type: 'int' }) //(0 for Home, 1 for Office , 3 for Hotel , 4 for Other)
  type: number;

  @Column({ type: 'int', default: 0 })
  is_deleted: number;

  @OneToMany(() => Order, (order) => order.userAddress, {})
  order: Order;
}
