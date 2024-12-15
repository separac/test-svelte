import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { products, brands, categories, productImages } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
    try {
        const productId = parseInt(params.id);
        
        if (isNaN(productId)) {
            throw error(400, 'Invalid product ID');
        }

        // First get the product with its relations
        const [product] = await db
            .select({
                id: products.id,
                name: products.name,
                description: products.description,
                msrp: products.msrp,
                productLink: products.product_link,
                affiliateLink: products.affiliate_link,
                warrantyInfo: products.warranty_info,
                countryOfOrigin: products.country_of_origin,
                yearIntroduced: products.year_introduced,
                containsPfas: products.contains_pfas,
                likes: products.likes,
                dislikes: products.dislikes,
                authorNotes: products.author_notes,
                updatedAt: products.updated_at,
                brand: {
                    id: brands.id,
                    name: brands.name,
                    website: brands.website
                },
                category: {
                    main: categories.main_category,
                    sub: categories.subcategory
                }
            })
            .from(products)
            .leftJoin(brands, eq(products.brand_id, brands.id))
            .leftJoin(categories, eq(products.category_id, categories.id))
            .where(eq(products.id, productId));

        if (!product) {
            throw error(404, 'Product not found');
        }

        // Then get the images separately
        const images = await db
            .select({
                url: productImages.url
            })
            .from(productImages)
            .where(eq(productImages.product_id, productId));

        // Combine product and images
        const productWithImages = {
            ...product,
            images
        };

        return {
            product: productWithImages
        };

    } catch (err) {
        console.error('Error loading product:', err);
        throw error(500, 'Failed to load product');
    }
};