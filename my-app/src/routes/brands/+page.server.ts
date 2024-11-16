// +page.server.ts
import { db } from "$lib/server/db";
import { brands, categories } from "$lib/server/db/schema";
import { eq, count } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    // Get pagination parameters from URL
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    const sortField = url.searchParams.get('sortField') || 'brandName';
    const sortDirection = url.searchParams.get('sortDirection') || 'asc';
    
    // Calculate offset
    const offset = (page - 1) * pageSize;
    
    // Get total count using Drizzle's count
    const [{ value: totalBrands }] = await db
        .select({ value: count() })
        .from(brands);

    // Get brands with pagination
    const allBrands = await db.select({
        id: brands.id,
        mainCategory: categories.main_category,
        subCategory: categories.subcategory,
        brandName: brands.name,
        brandDescription: brands.description,
        brandWebsite: brands.website,
    })
    .from(categories)
    .rightJoin(brands, eq(brands.category_id, categories.id))
    .limit(pageSize)
    .offset(offset);

    return {
        brands: allBrands,
        total: totalBrands
    };
};