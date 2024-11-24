<!-- src/routes/brands/+layout.svelte -->
<script lang="ts">
    import { page } from '$app/stores';
    import type { Navigation } from '$lib/types';
  
    // Types for navigation config
    type SubPage = {
      label: string;
      href: string;
      description: string;
    };
  
    let navigationConfig = {
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
          },
          {
            label: 'Community Favorites',
            href: '/explore/community-favorites',
            description: 'Top-rated brands by the BIFL community'
          }
        ]
      }
    };
  
    // Use state for computed values
    let currentPath = $state($page.url.pathname);
    let isExploreHome = $derived(currentPath === '/explore');
    let currentPageLabel = $derived(() => {
      if (isExploreHome) return '';
      return navigationConfig.explore.subPages.find(
        page => page.href === currentPath
      )?.label || '';
    });
  </script>
  
  <div class="min-h-screen">
    <!-- Navigation would go here -->
    <div class="max-w-screen-xl mx-auto px-4 py-2">
      <nav class="text-sm" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li>
            <a href="/" class="text-gray-500 hover:text-gray-700">Home</a>
          </li>
          <li class="text-gray-400">/</li>
          <li>
            <a href="/explore" class="text-gray-500 hover:text-gray-700">
              Explore Brands
            </a>
          </li>
          {#if !isExploreHome}
            <li class="text-gray-400">/</li>
            <li class="text-gray-900 font-medium">
              {currentPageLabel}
            </li>
          {/if}
        </ol>
      </nav>
    </div>
  
    <!-- Page Content -->
    <main class="max-w-screen-xl mx-auto px-4 py-8">
      <slot />
    </main>
  </div>
  
  <style>
    /* Add any component-specific styles here */
  </style>