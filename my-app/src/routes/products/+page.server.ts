// +page.server.ts
import { error } from '@sveltejs/kit';
import { db } from "$lib/server/db";
import { brands, categories, products } from "$lib/server/db/schema";
import { eq, asc, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { Product, PageData } from './types';

// Updated load function in +page.server.ts
export const load = (async ({ url }) => {
  try {
    // Get pagination params
    const page = parseInt(url.searchParams.get('page') || '1');
    let pageSize = url.searchParams.get('pageSize') || '10';
    const sortField = url.searchParams.get('sortField') || 'name';
    const sortDirection = url.searchParams.get('sortDirection') || 'asc';

    // Get total count first
    const totalResult = await db
      .select()
      .from(products)
      .then(results => results.length);

    // Handle 'all' page size
    const limit = pageSize === 'all' ? totalResult : parseInt(pageSize);
    const offset = page === 1 ? 0 : (page - 1) * limit;

    // Build query
    let query = db
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

    // Add sorting
    if (sortField === 'name') {
      query = query.orderBy(sortDirection === 'asc' ? asc(products.name) : desc(products.name));
    } else if (sortField === 'mainCategory') {
      query = query.orderBy(sortDirection === 'asc' ? asc(categories.main_category) : desc(categories.main_category));
    } else if (sortField === 'brandName') {
      query = query.orderBy(sortDirection === 'asc' ? asc(brands.name) : desc(brands.name));
    } else if (sortField === 'msrp') {
      query = query.orderBy(sortDirection === 'asc' ? asc(products.msrp) : desc(products.msrp));
    }

    // Add pagination
    if (pageSize !== 'all') {
      query = query.limit(limit).offset(offset);
    }

    const productsData = await query;

    const transformedProducts: Product[] = productsData.map(p => ({
      id: p.id,
      name: p.name ?? '',
      description: p.description ?? '',
      msrp: p.msrp ? Number(p.msrp) : null,
      productLink: p.productLink ?? '',
      affiliateLink: p.affiliateLink ?? '',
      mainCategory: p.mainCategory ?? '',
      subCategory: p.subCategory ?? '',
      brandName: p.brandName ?? '',
      brandWebsite: p.brandWebsite ?? ''
    }));

    return {
      products: transformedProducts,
      total: totalResult
    } satisfies PageData;

  } catch (err) {
    console.error('Error fetching products:', err);
    throw error(500, {
      message: 'Failed to load products',
      error: err instanceof Error ? err.message : String(err)
    });
  }
}) satisfies PageServerLoad;