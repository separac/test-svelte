// src/lib/config/navigation.ts
export const navigationConfig = {
    explore: {
      label: 'Explore Brands',
      href: '/explore',
      subPages: [
        {
          label: 'Featured Highlights',
          href: '/explore',
          description: 'Discover curated BIFL brand highlights and new additions'
        },
        {
          label: 'Brands Database',
          href: '/explore/database',
          description: 'Browse our comprehensive database of BIFL brands'
        },
        {
          label: 'Categories',
          href: '/explore/categories',
          description: 'Find brands by product categories'
        }/**,
        {
          label: 'Community Favorites',
          href: '/explore/community-favorites',
          description: 'Top-rated brands by the BIFL community'
        }**/
      ]
    }
  };