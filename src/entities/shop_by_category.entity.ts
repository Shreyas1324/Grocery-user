import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity('shop_by_category')
export class ShopByCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  category_name: string;

  @Column({ type: 'varchar', length: 100 })
  image: string;

  @Column({ type: 'integer', default: 0 })
  status: string;

  @Column({ type: 'integer', default: 0 })
  is_deleted: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_date: Date;

  @Column({ type: 'integer', nullable: true })
  fk_category_id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  offer: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  offer_percentage: string;

  @Column({ type: 'integer', nullable: true })
  fk_section_id: number;

  @ManyToOne(() => Category, (category) => category.shop_by_category, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_category_id' })
  category: Category;
}
