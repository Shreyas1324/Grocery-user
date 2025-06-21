import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Brand } from './brand.entity';
import { SubCategory } from './sub_category.entity';
import { Product } from './products.entity';
import { ShopByCategory } from './shop_by_category.entity';

@Entity('category')
export class Category {
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

  @OneToMany(() => Brand, (brand) => brand.category, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_brand_id' })
  brand: Brand;

  @OneToMany(() => SubCategory, (sub_category) => sub_category.category, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  sub_category: SubCategory;

  @OneToMany(() => Product, (product) => product.category, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  product: Product;

  @OneToMany(
    () => ShopByCategory,
    (ShopByCategory) => ShopByCategory.category,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  shop_by_category: ShopByCategory;

  @CreateDateColumn({ type: 'timestamp' })
  created_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_date: Date;
  fk_category_id: any;
}
