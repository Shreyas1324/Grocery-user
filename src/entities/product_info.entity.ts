import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './products.entity';

@Entity('product_info')
export class ProductInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  product_info: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ingredients: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  benefits: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nutritional_facts: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  other_product_info: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  image1: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  image2: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  image3: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  image4: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_date: Date;

  @ManyToOne(() => Product, (product) => product.productsInfo, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_product_id' })
  product: Product;

  @Column({ type: 'int' })
  fk_product_id: number;
}
