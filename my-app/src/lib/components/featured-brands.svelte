<!-- src/lib/components/featured-brands.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from "$lib/components/ui/button";
  import BrandLogo from "$lib/components/brand-logo.svelte";
  import { cn } from "$lib/utils";
  import { cubicOut } from 'svelte/easing';
  import { slide, fade } from 'svelte/transition';
  
  // Import Heroicons
  import ArrowUpIcon from "~icons/heroicons/arrow-up-right";
  import ChevronLeftIcon from "~icons/heroicons/chevron-left";
  import ChevronRightIcon from "~icons/heroicons/chevron-right";

  // Props
  let { allBrands } = $props<{
    allBrands: any[];
  }>();

  // State
  let currentIndex = $state(0);
  let isAnimating = $state(false);
  let shuffledBrands = $state<any[]>([]);
  let visibleBrands = $state<any[]>([]);

  // Initialize with shuffled brands
  $effect(() => {
    if (allBrands.length > 0) {
      // Create a shuffled copy of allBrands
      shuffledBrands = [...allBrands].sort(() => Math.random() - 0.5);
      updateVisibleBrands(0);
    }
  });

  // Function to update visible brands based on current index
  function updateVisibleBrands(index: number) {
    const length = shuffledBrands.length;
    if (length < 3) return;

    // Get previous, current, and next brand
    const prevIndex = (index - 1 + length) % length;
    const nextIndex = (index + 1) % length;

    visibleBrands = [
      shuffledBrands[prevIndex],
      shuffledBrands[index],
      shuffledBrands[nextIndex]
    ];
  }

  async function next() {
    if (isAnimating) return;
    isAnimating = true;
    
    currentIndex = (currentIndex + 1) % shuffledBrands.length;
    updateVisibleBrands(currentIndex);
    
    setTimeout(() => {
      isAnimating = false;
    }, 500);
  }

  async function prev() {
    if (isAnimating) return;
    isAnimating = true;
    
    currentIndex = (currentIndex - 1 + shuffledBrands.length) % shuffledBrands.length;
    updateVisibleBrands(currentIndex);
    
    setTimeout(() => {
      isAnimating = false;
    }, 500);
  }

  // Handle wheel scrolling
  onMount(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isAnimating) return;
      
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) 
        ? e.deltaX 
        : e.deltaY;
      
      if (delta > 0) {
        next();
      } else {
        prev();
      }
    };

    const carouselEl = document.querySelector('.carousel-track');
    if (carouselEl) {
      carouselEl.addEventListener('wheel', handleWheel as EventListener, { 
        passive: false 
      });
      
      return () => {
        carouselEl.removeEventListener('wheel', handleWheel as EventListener);
      };
    }
  });
  // export { default as FeaturedBrands };
</script>
  
  <section class="w-full max-w-7xl mx-auto px-4 py-8">
    <!-- Header section remains the same -->
    <div class="text-center space-y-4 mb-12">
        <h1 class="text-4xl font-bold tracking-tight">
          explore and discover
          <span class="block">buy it for life brands</span>
        </h1>
        
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          uncover top BIFL brands with our comprehensive database.
        </p>
    </div>


  <!-- Featured Brands Carousel -->
  <div class="mt-12">
    <div class="flex items-center gap-2 mb-6">
      <ArrowUpIcon class="h-5 w-5"></ArrowUpIcon>
      <h2 class="text-xl font-semibold">discover recommended BIFL brands</h2>
    </div>

    <!-- Carousel Container -->
    <div class="relative max-w-5xl mx-auto">
        <Button
            variant="ghost"
            size="icon"
            class="absolute -left-4 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full hover:bg-background/80"
            on:click={() => prev()}
            disabled={isAnimating}
        >
        <ChevronLeftIcon class="h-4 w-4"></ChevronLeftIcon>
      </Button>
      
        <Button
            variant="ghost"
            size="icon"
            class="absolute -right-4 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full hover:bg-background/80"
            on:click={() => next()}
            disabled={isAnimating}
        >
            <ChevronRightIcon class="h-4 w-4"></ChevronRightIcon>
        </Button>

        <div class="overflow-visible px-4 carousel-track">
          <div class="flex justify-center gap-6 transition-all duration-500 ease-out">
            {#each visibleBrands as brand, i (brand.id)}
              <div
                class="w-72 flex-shrink-0 transition-all duration-500 transform"
                style="transform-origin: center"
                in:slide|local={{ duration: 400, easing: cubicOut, axis: 'x' }}
                out:fade|local={{ duration: 300 }}
              >
                <div
                  class="block bg-white rounded-lg p-4 border hover:shadow-lg 
                         transition-all duration-300 hover:-translate-y-1 relative"
                  class:scale-110={i === 1}
                >
                  <div class="aspect-square w-16 mx-auto mb-3 flex items-center justify-center">
                    <BrandLogo brand={brand} size="lg"></BrandLogo>
                  </div>
                  
                  <div class="text-center">
                    <h3 class="font-medium hover:text-primary transition-colors text-sm">
                      {brand.name}
                    </h3>
                    <p class="text-xs text-muted-foreground mt-1">
                      {brand.category}
                    </p>
                    <a 
                      href={`https://${brand.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="text-xs font-mono text-blue-600 mt-2 hover:underline inline-block"
                    >
                      {brand.website}
                    </a>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </section>
    
    <style>
      .transform {
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }
    </style>