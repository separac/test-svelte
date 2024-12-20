import { error } from '@sveltejs/kit';
import { db } from "$lib/server/db";
import type { PageServerLoad } from './$types';
import type { Product, PageData } from '$lib/types';
import { brands as brandsTable, categories as categoriesTable, products as productsTable } from "$lib/server/db/schema";
import { eq, asc, desc, or, ilike, and, gte, lt, sql } from 'drizzle-orm';

export const load = (async ({ url }) => {
  try {
    // Parse URL params
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = url.searchParams.get('pageSize') || '20';
    const sortField = url.searchParams.get('sortField') || 'name';
    const sortDirection = url.searchParams.get('sortDirection') || 'asc';
    const search = url.searchParams.get('search')?.trim() || '';

    // Get filter data first
    const filterOptions = {
      categories: await getCategories(),
      brands: await getBrands(),
      priceRanges: getPriceRanges(),
      products: await getProducts()
    };

    // Base query
    let query = db
      .select({
        id: productsTable.id,
        name: productsTable.name,
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
        .limit(pageSize === 'all' ? undefined : parseInt(pageSize))
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

// Helper functions
async function getCategories() {
  const categoriesData = await db
    .select({
      mainCategory: categoriesTable.main_category,
      subCategory: categoriesTable.subcategory
    })
    .from(categoriesTable)
    .orderBy(categoriesTable.main_category, categoriesTable.subcategory);

  const categoryFilters: CategoryFilter[] = [];
  
  categoriesData.forEach(({ mainCategory, subCategory }) => {
    const existing = categoryFilters.find(c => c.mainCategory === mainCategory);
    if (existing) {
      if (subCategory && !existing.subCategories.includes(subCategory)) {
        existing.subCategories.push(subCategory);
      }
    } else {
      categoryFilters.push({
        mainCategory,
        subCategories: subCategory ? [subCategory] : []
      });
    }
  });

  return categoryFilters;
}

async function getBrands() {
  const brands = await db
    .selectDistinct({ 
      name: brandsTable.name 
    })
    .from(brandsTable)
    .orderBy(brandsTable.name);
    
  return brands.map(b => b.name);
}

async function getProducts() {
  const products = await db
    .selectDistinct({ 
      name: productsTable.name 
    })
    .from(productsTable)
    .orderBy(productsTable.name);
    
  return products.map(p => p.name);
}

function getPriceRanges(): PriceRange[] {
  return [
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50 to $100', min: 50, max: 100 },
    { label: '$100 to $200', min: 100, max: 200 },
    { label: '$200 to $500', min: 200, max: 500 },
    { label: '$500 to $1000', min: 500, max: 1000 },
    { label: '$1000 and up', min: 1000 }
  ];
}


