import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

import { addUserEntity } from './addUser.entity';
import { Order } from './orders.entity';

@Entity('order_reviews')
export class orderReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  ratings: number;

  @ManyToOne(() => addUserEntity, (user) => user.orderReview, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_user_id' })
  user: addUserEntity;

  @ManyToOne(() => Order, (order) => order.orderReview, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_order_id' })
  order: Order;

  @Column()
  fk_user_id: number;

  @Column()
  fk_order_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_date: Date;
}
