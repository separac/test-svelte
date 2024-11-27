// src/routes/brands/+page.ts
import type { PageLoad } from './$types';
import type { PageData } from './types';

export const load: PageLoad = async ({ data }) => {
    console.log('Page.ts data:', data); // Debug log
    return {
        features: data.features,
        brands: data.brands,
        total: data.total
    } satisfies PageData;
};