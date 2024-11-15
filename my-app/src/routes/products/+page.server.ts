// +page.server.ts
import { error } from '@sveltejs/kit';
import { db } from "$lib/server/db";
import { brands, categories, products } from "$lib/server/db/schema";
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  try {
    const productsData = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        msrp: products.msrp,
        productLink: products.product_link,
        affiliateLink: products.affiliate_link,
        mainCategory: categories.main_category,
        subCategory: categories.subcategory,
        brandName: brands.name,
        brandWebsite: brands.website
      })
      .from(products)
      .leftJoin(categories, eq(products.category_id, categories.id))
      .leftJoin(brands, eq(products.brand_id, brands.id));

    return {
      products: productsData
    };
    
  } catch (err) {
    console.error('Error fetching products:', err);
    throw error(500, {
      message: 'Failed to load products',
      cause: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};