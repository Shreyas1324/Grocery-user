import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Banner } from './banner.entity';

@Entity('section')
export class Section {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  slider_with_images: string;

  @Column({ type: 'varchar', length: 100 })
  slider_with_products: string;

  @Column({ type: 'varchar', length: 100 })
  grid_with_images_title_discount: string;

  @Column({ type: 'varchar', length: 100 })
  grid_with_images: string;

  @Column({ type: 'integer', default: 0 })
  is_deleted: number;

  @OneToMany(() => Banner, (banner) => banner.section, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_banner_id' })
  banner: Banner;

  @CreateDateColumn({ type: 'timestamp' })
  created_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_date: Date;
}
