// import {
// 	Column,
// 	CreateDateColumn,
// 	Entity,
// 	PrimaryGeneratedColumn,
// 	UpdateDateColumn,
// } from 'typeorm';

// @Entity('product_variation')
// export class ProductVariation {
// 	@PrimaryGeneratedColumn()
// 	id: number;

// 	@Column({ type: 'integer', nullable: true })
// 	fk_product_id: number;

// 	@Column({ type: 'double precision' })
// 	product_price: number;

// 	@Column({ type: 'double precision' })
// 	discount: number;

// 	@Column({ type: 'double precision' })
// 	discount_price: number;

// 	@Column({ type: 'varchar', length: 100 })
// 	title: string;

// 	@Column({ type: 'varchar', length: 100 })
// 	description: string;

// 	@Column({ type: 'varchar', length: 100})
// 	variation: string;

// 	@CreateDateColumn({ type: 'timestamp' })
// 	created_date: Date;

// 	@UpdateDateColumn({ type: 'timestamp' })
// 	updated_date: Date;

// }
