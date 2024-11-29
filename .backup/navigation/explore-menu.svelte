<!-- src/lib/components/navigation/explore-menu.svelte -->
<script lang="ts">
    import { slide, fade } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    import { Card } from "$lib/components/ui/card";
    import { 
      Compass, 
      Database, 
      Grid, 
      Heart,
      ChevronDown 
    } from "lucide-svelte";
    import type { ComponentType } from 'svelte';
  
    // TypeScript Interfaces
    interface Icon {
      new (...args: any[]): ComponentType;
    }
  
    interface SubPage {
      label: string;
      href: string;
      description: string;
      icon: Icon;
    }
  
    interface NavigationItem {
      label: string;
      href: string;
      subPages: SubPage[];
    }
  
    const subPages: SubPage[] = [
      {
        label: 'Featured Highlights',
        href: '/brands',
        description: 'Discover curated BIFL brand highlights and new additions',
        icon: Compass
      },
      {
        label: 'Brands Database',
        href: '/brands/database',
        description: 'Browse our comprehensive database of BIFL brands',
        icon: Database
      },
      {
        label: 'Categories',
        href: '/brands/categories',
        description: 'Find brands by product categories',
        icon: Grid
      }/**,
      {
        label: 'Community Favorites',
        href: '/explore/community-favorites',
        description: 'Top-rated brands by the BIFL community',
        icon: Heart
      }**/
    ];
  
    let isExpanded = $state(false);
    let hoveredIndex = $state<number | null>(null);
  
    // Animation configuration
    const slideConfig = {
      duration: 200,
      easing: cubicOut
    };
  
    const fadeConfig = {
      duration: 150,
      easing: cubicOut
    };
  </script>
  
  <div class="w-full bg-black text-white">
    <div class="max-w-screen-xl mx-auto">
      <div class="relative">
        <!-- Main Navigation Item -->
        <button
          class="flex items-center gap-2 px-4 py-3 text-lg font-medium hover:text-blue-400 transition-all duration-300"
          on:click={() => isExpanded = !isExpanded}
          on:mouseenter={() => isExpanded = true}
        >
          <span>Explore Brands</span>
          <ChevronDown
            class="h-4 w-4 transition-transform duration-300"
            class:rotate-180={isExpanded}
          />
        </button>
  
        <!-- Dropdown Panel -->
        {#if isExpanded}
          <div 
            class="absolute top-full left-0 w-full z-50"
            on:mouseleave={() => isExpanded = false}
            transition:slide={slideConfig}
          >
            <div transition:fade={fadeConfig}>
              <Card class="w-screen max-w-2xl mt-1 shadow-2xl bg-black border-gray-800">
                <div class="p-6 grid grid-cols-2 gap-4 bg-black rounded-lg">
                  {#each subPages as page, index}
                    {@const isHovered = hoveredIndex === index}
                    
                      href={page.href}
                      class="group relative p-4 rounded-lg transition-all duration-300"
                      style:background={isHovered 
                        ? 'linear-gradient(to right, rgb(26, 26, 26), rgb(38, 38, 38))' 
                        : 'transparent'}
                      on:mouseenter={() => hoveredIndex = index}
                      on:mouseleave={() => hoveredIndex = null}
                    >
                      <div class="flex items-center gap-3 mb-2">
                        <div 
                          class="p-2 rounded-lg transition-all duration-300"
                          class:bg-blue-900/50={isHovered}
                          class:text-blue-400={isHovered}
                          class:bg-gray-800={!isHovered}
                          class:text-gray-400={!isHovered}
                        >
                          <svelte:component 
                            this={page.icon} 
                            class="h-5 w-5 transition-transform duration-300 group-hover:scale-110" 
                          />
                        </div>
                        <h3 
                          class="font-medium transition-colors duration-300"
                          class:text-blue-400={isHovered}
                          class:text-gray-100={!isHovered}
                        >
                          {page.label}
                        </h3>
                      </div>
                      <p 
                        class="text-sm ml-11 transition-colors duration-300"
                        class:text-gray-300={isHovered}
                        class:text-gray-400={!isHovered}
                      >
                        {page.description}
                      </p>
                      
                      <!-- Highlight Border -->
                      <div 
                        class="absolute inset-0 border border-transparent rounded-lg transition-all duration-300"
                        class:border-blue-800={isHovered}
                      />
                    </a>
                  {/each}
                </div>
              </Card>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>