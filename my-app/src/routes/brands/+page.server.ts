import { db } from "$lib/server/db";
import { brands } from "$lib/server/db/schema";
import { categories } from "$lib/server/db/schema";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    let allBrands = await db.select().from(brands);
    let allCategories = await db.select().from(categories);
    return {
        allBrands,
        allCategories
    }
};
