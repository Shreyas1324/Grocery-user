import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './orders.entity';
import { Add_To_Cart } from './add_to_cart.entity';

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  coupon_name: string;

  @Column({ type: 'double precision' })
  min_purchase: number;

  @Column({ type: 'double precision' })
  discount_price: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'varchar', length: 100 })
  coupon_code: string;

  @Column({ type: 'integer', default: 0 })
  is_deleted: number;

  @OneToMany(() => Order, (order) => order.coupon, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  order: Order;

  @OneToMany(() => Add_To_Cart, (order) => order.coupon, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  cart: Add_To_Cart;

  @CreateDateColumn({ type: 'timestamp' })
  created_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_date: Date;
}
