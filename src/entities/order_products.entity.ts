import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Product } from './products.entity';
import { Order } from './orders.entity';

@Entity('order_products')
export class Order_Products {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  product_quantity: number;

  @Column({ type: 'double precision' })
  total_sum: number;

  @Column({ type: 'double precision' })
  product_price: number;

  @Column({ type: 'double precision' })
  product_variation: number;

  @Column({ type: 'double precision' })
  grand_total: number;

  @ManyToOne(() => Product, (product) => product.order_products, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_product_id' })
  product: Product;

  @ManyToOne(() => Order, (order) => order.order_products, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_order_id' })
  order: Order;

  @Column({ type: 'integer' })
  fk_product_id: number;

  @Column({ type: 'integer' })
  fk_order_id: number;

  @Column({ type: 'integer', default: 0 })
  is_deleted: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_date: Date;
}
