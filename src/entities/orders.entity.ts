import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Coupon } from './coupon.entity';
import { addUserEntity } from './addUser.entity';
import { Order_Products } from './order_products.entity';
import { UserAddressEntity } from './addUserAddress.entity';
import { orderReview } from './order_review.entity';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;

  @Column({ type: 'integer' })
  order_no: number;

  @Column({ type: 'integer' })
  delivery_charge: number;

  @Column({ type: 'double precision' })
  total_amount: number;

  @Column({ type: 'double precision' })
  total_discount: number;

  @Column({ type: 'double precision' })
  total_quantity: number;

  @Column({ type: 'double precision' })
  grand_total: number;

  @ManyToOne(() => addUserEntity, (user) => user.order, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_user_id' })
  user: addUserEntity;

  @ManyToOne(() => UserAddressEntity, {
    // onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_address_id' })
  userAddress: UserAddressEntity;

  @Column({ type: 'integer' })
  fk_user_id: number;

  @Column({ type: 'integer' })
  address_type: number;

  @Column({ type: 'integer' })
  fk_address_id: number;

  @Column({ type: 'integer', nullable: true })
  fk_coupon_id: number;

  @ManyToOne(() => Coupon, (coupon) => coupon.order, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_coupon_id' })
  coupon: Coupon;

  @Column({ type: 'integer', default: 0 })
  is_deleted: number;

  @OneToMany(() => Order_Products, (order_products) => order_products.order, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  order_products: Order_Products[];

  @OneToMany(() => orderReview, (order_products) => order_products.order, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  orderReview: orderReview;

  @CreateDateColumn({ type: 'timestamp' })
  created_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_date: Date;

  @Column({ type: 'integer', default: 0 })
  order_type: number;

  @Column({ type: 'integer', default: 0 })
  payment_type: number;

  @Column({ type: 'integer', default: 0 })
  order_status: number;
}
