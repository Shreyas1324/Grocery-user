import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('manage_delivery')
export class DeliveryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'double precision', nullable: true })
  free_delivery_upto: number;

  @Column({ type: 'double precision', nullable: true })
  delivery_charge: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_date: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_date: Date;
}
