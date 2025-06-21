import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserAddressEntity } from './addUserAddress.entity';
import { Order } from './orders.entity';
import { Review } from './review.entity';
import { Wishlist } from './wishlist.entity';
import { Add_To_Cart } from './add_to_cart.entity';
import { orderReview } from './order_review.entity';
import { DeviceRelationEntity } from './device_relation.entity';

@Entity('grocery_users')
export class addUserEntity {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  firstname: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastname: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'int', default: 1 })
  is_active: number;

  @Column({ type: 'int', default: 0 })
  is_deleted: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_date: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  modified_date: Date;

  @Column({ type: 'int', nullable: true })
  otp: number | null;

  @Column({ type: 'int', default: 0 })
  is_verified: number;

  @Column({ type: 'int', default: 0 })
  is_profileCreated: number;

  @Column({ type: 'varchar', length: 15 })
  mobile: string;

  @Column({ type: 'int', default: 0 })
  is_admin: number;

  @OneToMany(() => UserAddressEntity, (address) => address.user)
  address: UserAddressEntity[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  wishlist: Wishlist;

  @OneToMany(() => Review, (review) => review.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  review: Review;

  @OneToMany(() => orderReview, (orderreview) => orderreview.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  orderReview: orderReview;

  @OneToMany(() => Order, (order) => order.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  order: Order;

  @OneToMany(() => Add_To_Cart, (order) => order.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  cart: Add_To_Cart;

  @OneToMany(() => DeviceRelationEntity, (device) => device.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  device: DeviceRelationEntity;
  androidAppVersion: any;
  iosAppVersion: any;
}
