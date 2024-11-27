<script lang="ts">
    import { Sparkles, TrendingUp, Users } from 'lucide-svelte';
    import { onMount } from 'svelte';
    import { Button } from "$lib/components/ui/button";
    import BrandLogo from "$lib/components/brand-logo.svelte";
    import { cn } from "$lib/utils";
    import { cubicOut } from 'svelte/easing';
    import { slide, fade } from 'svelte/transition';
    import type { Brand } from '$lib/types';
    import type { PageData } from './$types';

    // Import Heroicons
    import ArrowUpIcon from "~icons/heroicons/arrow-up-right";
    import ChevronLeftIcon from "~icons/heroicons/chevron-left";
    import ChevronRightIcon from "~icons/heroicons/chevron-right";

    // Props and State with Runes
    let { data } = $props<{ data: PageData }>();
    let state = $state({
        isLoading: true,
        currentIndex: 0,
        isAnimating: false,
        shuffledBrands: [] as Brand[],
        visibleBrands: [] as Brand[],
        debug: {
            receivedFeatures: false,
            featuresLength: 0,
            firstFeature: null as Brand | null
        }
    });

    // Initialize carousel
    $effect(() => {
        console.log('Data received:', data);
        state.debug.receivedFeatures = data.features !== undefined;
        state.debug.featuresLength = data.features?.length || 0;
        state.debug.firstFeature = data.features?.[0] || null;
        
        if (data.features?.length > 0) {
            state.shuffledBrands = [...data.features].sort(() => Math.random() - 0.5);
            updateVisibleBrands(0);
            state.isLoading = false;
        }
    });

    $effect(() => {
        if (data.features?.length > 0) {
            const typedFeatures = data.features as Brand[];
            console.log('First feature type check:', typedFeatures[0]);
            state.shuffledBrands = [...typedFeatures].sort(() => Math.random() - 0.5);
            updateVisibleBrands(0);
        }
    });

    function updateVisibleBrands(index: number) {
        const length = state.shuffledBrands.length;
        if (length < 3) return;

        const prevIndex = (index - 1 + length) % length;
        const nextIndex = (index + 1) % length;

        state.visibleBrands = [
            state.shuffledBrands[prevIndex],
            state.shuffledBrands[index],
            state.shuffledBrands[nextIndex]
        ];
        console.log('Updated visible brands:', state.visibleBrands); // Debug log
    }

  async function next() {
    if (state.isAnimating) return;
    state.isAnimating = true;
    state.currentIndex = (state.currentIndex + 1) % state.shuffledBrands.length;
    updateVisibleBrands(state.currentIndex);
    setTimeout(() => state.isAnimating = false, 500);
  }

  async function prev() {
    if (state.isAnimating) return;
    state.isAnimating = true;
    state.currentIndex = (state.currentIndex - 1 + state.shuffledBrands.length) % state.shuffledBrands.length;
    updateVisibleBrands(state.currentIndex);
    setTimeout(() => state.isAnimating = false, 500);
  }

  // Handle wheel scrolling
  onMount(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (state.isAnimating) return;
      
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

// DEBUGGING


</script>

<!-- Add more detailed debug output -->
<pre class="text-xs bg-gray-100 p-4 my-4 rounded">
Debug State:
Received Features: {state.debug.receivedFeatures}
Features Length: {state.debug.featuresLength}
First Feature: {JSON.stringify(state.debug.firstFeature, null, 2)}
---
Shuffled Length: {state.shuffledBrands.length}
Visible Length: {state.visibleBrands.length}
Loading: {state.isLoading}
</pre>

<!-- HERE STARTS THE PAGE -->
<div class="container max-w-screen-xl space-y-8 py-8">
  <div class="space-y-3">
    <h1 class="text-3xl font-bold tracking-tighter md:text-4xl">Explore Brands</h1>
    <p class="text-sm text-muted-foreground font-mono">
    Discover all our curated buy it for life brands.
    </p>
  </div>
  <!-- CONTENT OF THE PAGE BELOW HEADLINE -->
  <div class="space-y-16">
  <!-- Carousel Section -->
    <!-- <FeaturedBrands /> -->
    <!-- Featured Brands Carousel -->
  <div class="mt-12">
    <div class="flex items-center gap-2 mb-6">
      <ArrowUpIcon class="h-5 w-5"></ArrowUpIcon>
      <h2 class="text-xl font-semibold">Discover recommended BIFL brands</h2>
    </div>
  </div>
  <!-- DEBUGGING 
  {JSON.stringify(brands, null, 2)}
  <pre class="text-xs">
    {brands?.length ?? 'no brands'}
  </pre> -->

  <div class="overflow-hidden px-12">
    <div class="flex justify-center gap-6 transition-all duration-500 ease-out">
        {#if state.isLoading}
            <div class="text-center p-8">
                <p class="text-muted-foreground">Loading brands...</p>
            </div>
        {:else if state.visibleBrands.length === 0}
            <div class="text-center p-8">
                <p class="text-muted-foreground">No brands available</p>
            </div>
        {:else}
            {#each state.visibleBrands as brand, i (brand.id)}
                <div
                    class="w-72 flex-shrink-0 transition-all duration-500"
                    class:scale-110={i === 1}
                    in:slide|local={{ duration: 400, easing: cubicOut }}
                    out:fade|local={{ duration: 300 }}
                >
                    <div class="bg-white rounded-lg p-4 border hover:shadow-lg transition-all">
                        <div class="aspect-square w-16 mx-auto mb-3">
                            <BrandLogo {brand} size="lg" />
                        </div>
                        <div class="text-center">
                            <h3 class="font-medium text-sm">{brand.brandName}</h3>
                            <p class="text-xs text-muted-foreground mt-1">
                                {brand.mainCategory}
                            </p>
                            {#if brand.brandWebsite}
                                <a 
                                    href={brand.brandWebsite} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    class="text-xs font-mono text-blue-600 mt-2 hover:underline"
                                >
                                    {brand.brandWebsite}
                                </a>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div>

<!-- Navigation buttons -->
<div class="flex justify-center gap-4 mt-4">
    <Button 
        variant="outline" 
        size="icon" 
        on:click={() => prev()}
        disabled={state.isAnimating}
    >
        <ChevronLeftIcon class="h-4 w-4" />
    </Button>
    <Button 
        variant="outline" 
        size="icon" 
        on:click={() => next()}
        disabled={state.isAnimating}
    >
        <ChevronRightIcon class="h-4 w-4" />
    </Button>
</div>

    <!-- Carousel Container -->
    <div class="relative max-w-5xl mx-auto">
        <Button
            variant="ghost"
            size="icon"
            class="absolute -left-4 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full hover:bg-background/80"
            on:click={() => prev()}
            disabled={state.isAnimating}
        >
        <ChevronLeftIcon class="h-4 w-4"></ChevronLeftIcon>
      </Button>
      
        <Button
            variant="ghost"
            size="icon"
            class="absolute -right-4 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full hover:bg-background/80"
            on:click={() => next()}
            disabled={state.isAnimating}
        >
            <ChevronRightIcon class="h-4 w-4"></ChevronRightIcon>
        </Button>

        <div class="overflow-visible px-4 carousel-track">
          <div class="flex justify-center gap-6 transition-all duration-500 ease-out">
            {#if state.isLoading}
              <div class="flex items-center justify-center p-8">
                <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            {:else if state.visibleBrands.length === 0}
              <div class="text-center p-8">
                <p class="text-muted-foreground">No featured brands available</p>
              </div>
            {:else}
              {#each state.visibleBrands as brand, i (brand.id)}
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
                        {brand.brandName}
                      </h3>
                      <p class="text-xs text-muted-foreground mt-1">
                        {brand.mainCategory}
                      </p>
                      <a 
                        href={`https://${brand.brandWebsite}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="text-xs font-mono text-blue-600 mt-2 hover:underline inline-block"
                      >
                        {brand.brandWebsite}
                      </a>
                    </div>
                  </div>
                </div>
              {/each}
            {/if}
          </div>
        </div>
      </div>
    
    <style>
      .transform {
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }
    </style>


  <!-- Additional Sections -->
    <section class="grid md:grid-cols-3 gap-8">
      <div class="p-6 rounded-lg bg-blue-50">
        <Sparkles class="h-8 w-8 text-blue-600 mb-4" />
        <h3 class="text-xl font-semibold mb-2">New Additions</h3>
        <p class="text-gray-600">Recently verified and added BIFL brands</p>
      </div>
      <!-- Add more highlight sections -->
    </section>
  </div>
</div>