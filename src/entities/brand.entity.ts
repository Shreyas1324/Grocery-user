import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { SubCategory } from './sub_category.entity';
import { Product } from './products.entity';

@Entity('brand')
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  brand_name: string;

  @Column({ type: 'varchar', length: 100 })
  image: string;

  @Column({ type: 'integer', default: 0 })
  status: number;

  @Column()
  fk_category_id: number;

  @Column()
  fk_subcategory_id: number;

  @ManyToOne(() => Category, (category) => category.brand, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_category_id' })
  category: Category;

  @ManyToOne(() => SubCategory, (subcategory) => subcategory.brand, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_subcategory_id' })
  subcategory: SubCategory;

  @Column({ type: 'integer', default: 0 })
  is_deleted: number;

  @OneToMany(() => Product, (product) => product.brand, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  product: Product;

  @CreateDateColumn({ type: 'timestamp' })
  created_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_date: Date;
}
