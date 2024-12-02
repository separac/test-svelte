// src/routes/brands/[id]/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { brands, products, categories } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
    try {
        const brandId = parseInt(params.id);
        
        // Verify brandId is a valid number
        if (isNaN(brandId)) {
            throw error(400, 'Invalid brand ID');
        }

        // Get brand with its category
        const [brand] = await db
            .select({
                id: brands.id,
                name: brands.name,
                description: brands.description,
                website: brands.website,
                category: {
                    id: categories.id,
                    mainCategory: categories.main_category,
                    subCategory: categories.subcategory
                }
            })
            .from(brands)
            .leftJoin(categories, eq(brands.category_id, categories.id))
            .where(eq(brands.id, brandId));

        if (!brand) {
            throw error(404, 'Brand not found');
        }

        // Get brand's products
        const brandProducts = await db
            .select({
                id: products.id,
                name: products.name,
                description: products.description,
                msrp: products.msrp,
                currentPrice: products.current_price,
                productLink: products.product_link,
                affiliateLink: products.affiliate_link,
                category: {
                    mainCategory: categories.main_category,
                    subCategory: categories.subcategory
                }
            })
            .from(products)
            .leftJoin(categories, eq(products.category_id, categories.id))
            .where(eq(products.brand_id, brandId));

        return {
            brand,
            products: brandProducts
        };
    } catch (err) {
        console.error('Error loading brand:', err);
        if (err instanceof Error) {
            throw error(500, err.message);
        }
        throw error(500, 'Failed to load brand');
    }
};