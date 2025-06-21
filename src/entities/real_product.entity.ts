// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   OneToMany,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from 'typeorm';
// import { Brand } from './brand.entity';
// import { Category } from './category.entity';
// import { SubCategory } from './sub_category.entity';
// import { Add_To_Cart } from './add_to_cart.entity';
// import { Order_Products } from './order_products.entity';
// import { Wishlist } from './wishlist.entity';
// import { Review } from './review.entity';
// import { ProductInfo } from './product_info.entity';

// @Entity('real_products')
// export class RealProduct {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'varchar', length: 100 })
//   product_name: string;

// 	@Column({ type: 'integer', default: 0 })
//   stock_status: number;

//   @Column({ type: 'varchar', length: 100 })
//   image: string;

//   @ManyToOne(() => Category, (category) => category.product, {
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE',
//   })
//   @JoinColumn({ name: 'fk_category_id' })
//   category: Category;

//   @ManyToOne(() => SubCategory, (subcategory) => subcategory.product, {
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE',
//   })
//   @JoinColumn({ name: 'fk_subcategory_id' })
//   sub_category: SubCategory;

//   @ManyToOne(() => Brand, (brand) => brand.product, {
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE',
//   })
//   @JoinColumn({ name: 'fk_brand_id' })
//   brand: Brand;

//   @Column({ type: 'integer', default: 0 })
//   is_deleted: number;

//   @OneToMany(() => Add_To_Cart, (add_to_cart) => add_to_cart.product, {
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE',
//   })
//   @JoinColumn({ name: 'fk_addtocart_id' })
//   add_to_cart: Add_To_Cart;

//   @Column({ type: 'int' })
//   fk_category_id: number;

//   @OneToMany(() => Order_Products, (order_products) => order_products.product, {
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE',
//   })
//   order_products: Order_Products;

//   @OneToMany(() => Wishlist, (wishlist) => wishlist.product, {
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE',
//   })
//   wishlist: Wishlist;

//   @CreateDateColumn({ type: 'timestamp' })
//   created_date: Date;

//   @UpdateDateColumn({ type: 'timestamp' })
//   updated_date: Date;

//   @OneToMany(() => Review, (review) => review.product, {
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE',
//   })
//   review: Review;

//   @OneToMany(() => ProductInfo, (productInfo) => productInfo.product, {
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE',
//   })
//   productsInfo: ProductInfo;

// }
