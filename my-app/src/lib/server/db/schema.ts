// src/lib/server/db/schema.ts
import { text, integer, numeric, boolean, timestamp, pgTable } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  msrp: numeric('msrp', { precision: 10, scale: 2 }),
  current_price: numeric('current_price', { precision: 10, scale: 2 }),
  product_link: text('product_link'),
  affiliate_link: text('affiliate_link'),
  category_id: integer('category_id').references(() => categories.id),
  brand_id: integer('brand_id').references(() => brands.id),
});

export const categories = pgTable('categories', {
  id: integer('id').primaryKey(),
  main_category: text('main_category').notNull(),
  subcategory: text('subcategory').notNull(),
});

export const brands = pgTable('brands', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  website: text('website'),
  category_id: integer('category_id').references(() => categories.id),
});