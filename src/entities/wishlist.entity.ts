import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { addUserEntity } from './addUser.entity';
import { Product } from './products.entity';

@Entity('wishlist')
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => addUserEntity, (user) => user.wishlist, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_user_id' })
  user: addUserEntity;

  @Column()
  fk_user_id: number;

  @ManyToOne(() => Product, (product) => product.wishlist, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_product_id' })
  product: Product;

  @Column()
  fk_product_id: number;

  @Column({ type: 'integer', default: 0 })
  is_deleted: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_date: Date;
}
