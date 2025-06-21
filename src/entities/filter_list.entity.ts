import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('discount_list')
export class DiscountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: number;

  @Column()
  label: string;

  @Column({ nullable: true })
  min: number;

  @Column({ nullable: true })
  max: number;
}

@Entity('sortby_list')
export class SortbyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: number;

  @Column()
  label: string;

  @Column({ nullable: true })
  column: string;

  @Column({ nullable: true })
  order: string;
}
