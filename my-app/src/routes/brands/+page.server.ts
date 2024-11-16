// +page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { brands, categories } from '$lib/server/db/schema';
import { eq, ilike, or, desc, asc, count } from 'drizzle-orm';
import type { Brand } from './types'; // Updated import

export const load: PageServerLoad = async ({ url }) => {
    try {
        // Get query parameters
        const page = Number(url.searchParams.get('page')) || 1;
        const pageSize = Number(url.searchParams.get('pageSize')) || 10;
        const sortField = (url.searchParams.get('sortField') as keyof Brand) || 'brandName';
        const sortDirection = (url.searchParams.get('sortDirection') as 'asc' | 'desc') || 'asc';
        const searchTerm = url.searchParams.get('search') || '';
        
        // Calculate offset
        const offset = (page - 1) * pageSize;

        // Build where conditions for search
        const searchCondition = searchTerm 
            ? or(
                ilike(brands.name, `%${searchTerm}%`),
                ilike(categories.main_category, `%${searchTerm}%`),
                ilike(categories.subcategory, `%${searchTerm}%`),
                ilike(brands.description, `%${searchTerm}%`)
            )
            : undefined;

        // Get total count with search filter
        const [{ value: totalBrands }] = await db
            .select({ value: count(brands.id) })
            .from(brands)
            .leftJoin(categories, eq(brands.category_id, categories.id))
            .where(searchCondition);

        // Build main query
        const query = db
            .select({
                id: brands.id,
                mainCategory: categories.main_category,
                subCategory: categories.subcategory,
                brandName: brands.name,
                brandDescription: brands.description,
                brandWebsite: brands.website,
            })
            .from(brands)
            .leftJoin(categories, eq(brands.category_id, categories.id))
            .where(searchCondition)
            .orderBy(
                sortField === 'brandName'
                    ? sortDirection === 'desc' ? desc(brands.name) : asc(brands.name)
                    : sortField === 'mainCategory'
                        ? sortDirection === 'desc' ? desc(categories.main_category) : asc(categories.main_category)
                        : sortField === 'subCategory'
                            ? sortDirection === 'desc' ? desc(categories.subcategory) : asc(categories.subcategory)
                            : asc(brands.name) // Fallback to default
            );

        // Add pagination
        const allBrands = await query
            .limit(pageSize)
            .offset(offset);

        return {
            brands: allBrands,
            total: totalBrands
        };
    } catch (err) {
        console.error('Error in +page.server.ts load function:', err);
        throw error(500, 'Internal Server Error');
    }
};