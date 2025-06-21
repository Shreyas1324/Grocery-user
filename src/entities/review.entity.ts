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
import { Product } from './products.entity';

@Entity('review')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  ratings: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  description: string;

  @ManyToOne(() => addUserEntity, (user) => user.review, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_user_id' })
  user: addUserEntity;

  @ManyToOne(() => Product, (product) => product.review, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_product_id' })
  product: Product;

  @Column()
  fk_user_id: number;

  @Column()
  fk_product_id: number;

  @Column({ type: 'integer', default: 0 })
  is_deleted: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_date: Date;
}
