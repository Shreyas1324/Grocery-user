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
import { Category } from './category.entity';
import { Brand } from './brand.entity';
import { Product } from './products.entity';

@Entity('sub_category')
export class SubCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  subcategory_name: string;

  @Column({ type: 'varchar', length: 100 })
  image: string;

  @Column({ type: 'integer', default: 0 })
  status: number;

  @Column()
  fk_category_id: number;

  @ManyToOne(() => Category, (category) => category.sub_category, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_category_id' })
  category: Category;

  @Column({ type: 'integer', default: 0 })
  is_deleted: number;

  @OneToMany(() => Brand, (brand) => brand.subcategory, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  brand: Brand;

  @OneToMany(() => Product, (product) => product.sub_category, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  product: Product;

  @CreateDateColumn({ type: 'timestamp' })
  created_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_date: Date;
  fk_subcategory_id: any;
}
