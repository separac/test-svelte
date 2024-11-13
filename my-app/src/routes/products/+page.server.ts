import { error } from '@sveltejs/kit';
import { db } from "$lib/server/db";
import { brands, categories, products } from "$lib/server/db/schema";
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

/** export const load: PageServerLoad = async () => {
    let allProducts = await db.select({
        mainCategory: categories.main_category,
        subCategory: categories.subcategory,
        brandName: brands.name,
        productName: products.name,
        productDescription: products.description,
        productMSRP: products.msrp,
        productLink: products.product_link,
        affiliateLink: products.affiliate_link
    })
    .from(categories)
    .rightJoin(products, eq(products.id, categories.id))
    .from(brands)
    .rightJoin(products, eq(products.brand_id, brands.id));
    return {
        allProducts
    }
};**/

export const load: PageServerLoad = async () => {
  try {
    const allProducts = await db
      .select({
        // Product information
        id: products.id,
        name: products.name,
        description: products.description,
        msrp: products.msrp,
        productLink: products.product_link,
        affiliateLink: products.affiliate_link,
        
        // Category information
        mainCategory: categories.main_category,
        subCategory: categories.subcategory,
        
        // Brand information
        brandName: brands.name,
        brandWebsite: brands.website
      })
      .from(products)
      .leftJoin(categories, eq(products.category_id, categories.id))
      .leftJoin(brands, eq(products.brand_id, brands.id));
    
      // Debug logging
    console.log('Server Data:', {
      productCount: allProducts.length,
      sampleProduct: allProducts[0]
    });

    return {
      products: allProducts
    };
} catch (err) {
    console.error('Error fetching products:', err);
    throw error(500, 'Failed to load products');
  }
};