// src/lib/server/db/schema.ts
import { text, integer, numeric, boolean, timestamp, pgTable } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';  // Add this import

export const products = pgTable('products', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  msrp: numeric('msrp', { precision: 10, scale: 2 }),
  current_price: numeric('current_price', { precision: 10, scale: 2 }),
  price_last_updated: timestamp('price_last_updated'),
  product_link: text('product_link'),
  affiliate_link: text('affiliate_link'),
  warranty_info: text('warranty_info'),
  country_of_origin: text('country_of_origin'),
  year_introduced: integer('year_introduced'),
  contains_pfas: boolean('contains_pfas'),
  likes: text('likes'),
  dislikes: text('dislikes'),
  author_notes: text('author_notes'),
  category_id: integer('category_id').references(() => categories.id),
  brand_id: integer('brand_id').references(() => brands.id),
  updated_at: timestamp('updated_at'),
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
  location: text('location'),
  category_id: integer('category_id').references(() => categories.id),
});

export const productmaterials = pgTable('productmaterials', {
  product_id: integer('product_id').references(() => products.id),
  material_id: integer('material_id').references(() => materials.id),
  percentage: numeric('percentage'),
});

export const materials = pgTable('materials', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
});

export const productsRelations = relations(products, ({ many, one }) => ({
  materials: many(productmaterials),
  brand: one(brands, {
    fields: [products.brand_id],
    references: [brands.id]
  }),
  category: one(categories, {
    fields: [products.category_id],
    references: [categories.id]
  })
}));

export const materialsRelations = relations(materials, ({ many }) => ({
  products: many(productmaterials),
}));

export const productMaterialsRelations = relations(productmaterials, ({ one }) => ({
  product: one(products, {
    fields: [productmaterials.product_id],
    references: [products.id],
  }),
  material: one(materials, {
    fields: [productmaterials.material_id],
    references: [materials.id],
  }),
}));

// Add these relations to your existing schema:
export const brandsRelations = relations(brands, ({ many, one }) => ({
  products: many(products),
  category: one(categories, {
    fields: [brands.category_id],
    references: [categories.id],
  }),
}));

// Example schema definition
export const productImages = pgTable('product_images', {
    id: integer('id').primaryKey(),
    product_id: integer('product_id').references(() => products.id),
    url: text('url')
});