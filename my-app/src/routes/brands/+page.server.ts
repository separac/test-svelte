import { db } from "$lib/server/db";
import { brands } from "$lib/server/db/schema";
import { categories } from "$lib/server/db/schema";
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    //let allBrands = await db.select().from(brands);
    //let allCategories = await db.select().from(categories);
    let allFucks = await db.select({
        mainCategory: categories.main_category,
        subCategory: categories.subcategory,
        brandName: brands.name,
        brandDescription: brands.description,
        brandWebsite: brands.website,
    }).from(categories).rightJoin(brands, eq(brands.category_id, categories.id));
    return {
        //allBrands,
        //allCategories,
        allFucks
    }
};
