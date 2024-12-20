import { error } from '@sveltejs/kit';
import { db } from "$lib/server/db";
import type { PageServerLoad } from './$types';
import type { Product, PageData, FilterOptions, FilterValue, CategoryFilter, PriceRange } from '$lib/types';
import { brands as brandsTable, categories as categoriesTable, products as productsTable } from "$lib/server/db/schema";
import { eq, asc, desc, or, ilike, and, gte, lt, sql } from 'drizzle-orm';

async function getFilterOptions(): Promise<FilterOptions> {
  // Get unique categories with their subcategories
  const categories = await db
    .selectDistinct({
      main_category: categoriesTable.main_category,
      subcategory: categoriesTable.subcategory
    })
    .from(categoriesTable)
    .where(sql`${categoriesTable.main_category} is not null`);

  // Process categories to group subcategories
  const categoryMap = new Map<string, string[]>();
  categories.forEach(({ main_category, subcategory }) => {
    if (!categoryMap.has(main_category)) {
      categoryMap.set(main_category, []);
    }
    if (subcategory) {
      categoryMap.get(main_category)?.push(subcategory);
    }
  });

  const processedCategories = Array.from(categoryMap.entries()).map(([main, subs]) => ({
    mainCategory: main,
    subCategories: subs,
    value: main,
    label: main
  }));

  // Get unique brands
  const brands = await db
    .selectDistinct({
      value: brandsTable.name,
      label: brandsTable.name
    })
    .from(brandsTable)
    .where(sql`${brandsTable.name} is not null`);

  // Get unique products
  const products = await db
    .selectDistinct({
      value: productsTable.name,
      label: productsTable.name
    })
    .from(productsTable)
    .where(sql`${productsTable.name} is not null`);

  return {
    categories: {
      type: 'category',
      values: processedCategories
    },
    brands: {
      type: 'brand',
      values: brands
    },
    prices: {
      type: 'price',
      values: [
        { value: '0-50', label: 'Under $50', min: 0, max: 50 },
        { value: '50-100', label: '$50 to $100', min: 50, max: 100 },
        { value: '100-200', label: '$100 to $200', min: 100, max: 200 },
        { value: '200-500', label: '$200 to $500', min: 200, max: 500 },
        { value: '500-1000', label: '$500 to $1000', min: 500, max: 1000 },
        { value: '1000-', label: '$1000 and up', min: 1000 }
      ]
    },
    products: {
      type: 'product',
      values: products
    }
  };
}

export const load = (async ({ url }) => {
  try {
    // Get filter options first
    const filterOptions = await getFilterOptions();
    
    // Parse URL params
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = url.searchParams.get('pageSize') || '20';
    const sortField = url.searchParams.get('sortField') || 'name';
    const sortDirection = url.searchParams.get('sortDirection') || 'asc';
    const search = url.searchParams.get('search')?.trim() || '';

    // Base query
    let query = db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        description: productsTable.description, // Add this line
        msrp: productsTable.msrp,
        categoryMain: categoriesTable.main_category,
        categorySub: categoriesTable.subcategory,
        brandName: brandsTable.name,
        brandWebsite: brandsTable.website,
      })
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.category_id, categoriesTable.id))
      .leftJoin(brandsTable, eq(productsTable.brand_id, brandsTable.id));

    // Build where conditions
    const whereConditions = [];

    // Search condition
    if (search) {
      whereConditions.push(
        or(
          ilike(productsTable.name, `%${search}%`),
          ilike(brandsTable.name, `%${search}%`),
          ilike(categoriesTable.main_category, `%${search}%`)
        )
      );
    }

    // Filter conditions
    const filterParams = Object.fromEntries(
      [...url.searchParams.entries()]
        .filter(([key]) => key.startsWith('filter_'))
        .map(([key, value]) => [
          key.replace('filter_', ''),
          value.split(',').filter(Boolean)
        ])
    );

    // Apply filters
    Object.entries(filterParams).forEach(([column, values]) => {
      if (values.length > 0) {
        switch (column) {
          case 'category':
            whereConditions.push(
              or(
                ...values.map(value => 
                  or(
                    eq(categoriesTable.main_category, value),
                    eq(categoriesTable.subcategory, value)
                  )
                )
              )
            );
            break;
          case 'brand':
            whereConditions.push(or(...values.map(value => eq(brandsTable.name, value))));
            break;
          case 'price':
            values.forEach(range => {
              const [min, max] = range.split('-').map(Number);
              if (!isNaN(min)) {
                if (!isNaN(max)) {
                  whereConditions.push(and(
                    gte(productsTable.msrp, min),
                    lt(productsTable.msrp, max)
                  ));
                } else {
                  whereConditions.push(gte(productsTable.msrp, min));
                }
              }
            });
            break;
          case 'product':
            whereConditions.push(or(...values.map(value => eq(productsTable.name, value))));
            break;
        }
      }
    });

    // Apply where conditions
    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }

    // Add sorting
    const sortColumn = {
      name: productsTable.name,
      description: productsTable.description, // Add this line
      categoryMain: categoriesTable.main_category,
      brandName: brandsTable.name,
      msrp: productsTable.msrp
    }[sortField] || productsTable.name;

    query = query.orderBy(sortDirection === 'asc' ? asc(sortColumn) : desc(sortColumn));

    // Get total count with subquery
    const countQuery = db
      .select({ count: sql<number>`count(*)::int` })
      .from(query.as('filtered_query'));

    // Execute both queries in parallel
    const [countResult, results] = await Promise.all([
      countQuery,
      query
        .limit(pageSize === 'all' ? 2147483647 : parseInt(pageSize))
        .offset(pageSize === 'all' ? 0 : (page - 1) * parseInt(pageSize))
    ]);

    return {
      products: results,
      total: countResult[0].count,
      filterOptions,
      page,
      pageSize
    } satisfies PageData;

  } catch (err) {
    console.error('Load error:', err);
    error(500, {
      message: 'Failed to load products',
      error: err instanceof Error ? err.message : String(err)
    });
  }
}) satisfies PageServerLoad;


