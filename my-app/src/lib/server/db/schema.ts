import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

export const brands = pgTable('brands', {
	id: serial('id').primaryKey(),
	name: text('name'),
	description: text('description'),
	website: text('website'),
	category_id: text('category_id')
});

export const categories = pgTable('categories', {
	id: serial('id').primaryKey(),
	main_category: text('main_category'),
	subcategory: text('subcategory')
});