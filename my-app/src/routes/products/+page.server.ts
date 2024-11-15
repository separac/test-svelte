// +page.server.ts
import { error } from '@sveltejs/kit';
import { db } from "$lib/server/db";
import { brands, categories, products } from "$lib/server/db/schema";
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { Product, PageData } from './types';

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

    const transformedProducts: Product[] = productsData.map(p => ({
      ...p,
      description: p.description ?? '',
      msrp: p.msrp ? parseFloat(p.msrp) : null, // Convert to number
      productLink: p.productLink ?? '',
      affiliateLink: p.affiliateLink ?? '',
      mainCategory: p.mainCategory ?? '',
      subCategory: p.subCategory ?? '',
      brandName: p.brandName ?? '',
      brandWebsite: p.brandWebsite ?? ''
    }));

    return { products: transformedProducts } as PageData;
  } catch (err) {
    console.error('Error fetching products:', err);
    throw error(500, 'Failed to load products');
  }
};

