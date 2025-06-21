import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Coupon } from './coupon.entity';
import { Product } from './products.entity';
import { addUserEntity } from './addUser.entity';

@Entity('add_to_cart')
export class Add_To_Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  Quantity: number;

  @Column({ type: 'varchar', nullable: true })
  variation: string;

  @Column({ type: 'double precision' })
  product_price: number;

  @Column({ type: 'double precision' })
  discount: number;

  @Column({ type: 'double precision', default: 0 })
  delivery_charge: number;

  @ManyToOne(() => Product, (product) => product.add_to_cart, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_product_id' })
  product: Product;

  @Column()
  fk_product_id: number;

  @ManyToOne(() => addUserEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_user_id' })
  user: addUserEntity;

  @Column({ unique: false })
  fk_user_id: number;

  @ManyToOne(() => Coupon, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_coupon_id' })
  coupon: Coupon;

  @Column({ nullable: true, unique: false })
  fk_coupon_id: number;

  @Column({ type: 'integer', default: 0 })
  is_deleted: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_date: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_date: Date;
}
