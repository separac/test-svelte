<!-- src/lib/components/brand-carousel.svelte -->
<script lang="ts">
    import { slide } from 'svelte/transition';
    import ChevronLeftIcon from '~icons/heroicons/chevron-left';
    import ChevronRightIcon from '~icons/heroicons/chevron-right';
    import { Button } from '$lib/components/ui/button';
    import BrandLogo from '$lib/components/brand-logo.svelte';
    import { getCategoryIcon } from '$lib/utils/category-icons';
    import { shuffle } from '$lib/utils';

    let { brands = [] } = $props<{
        brands: Array<{
            id: number;
            brandName: string;
            mainCategory: string | null;
            subCategory: string | null;
            brandDescription: string;
            brandWebsite: string | null;
        }>;
    }>();

    let currentIndex = $state(0);
    let shuffledBrands = $state<typeof brands>([]);
    let visibleCards = $state(3);

    // Calculate total number of pages
    let totalPages = $derived(Math.ceil(shuffledBrands.length / visibleCards));

    // Initialize shuffled brands
    $effect(() => {
        if (brands.length > 0) {
            shuffledBrands = shuffle([...brands]);
            currentIndex = 0; // Reset index when brands change
        }
    });

    // Handle viewport changes
    $effect(() => {
        if (typeof window !== 'undefined') {
            const handleResize = () => {
                if (window.innerWidth < 640) visibleCards = 1;
                else if (window.innerWidth < 1024) visibleCards = 2;
                else visibleCards = 3;
            };
            handleResize();
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    });

    function next() {
        if (currentIndex < totalPages - 1) {
            currentIndex++;
        }
    }

    function prev() {
        if (currentIndex > 0) {
            currentIndex--;
        }
    }

    // Helper to extract domain from URL
    function getDomainFromUrl(url: string | null): string {
        if (!url) return '';
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return '';
        }
    }
</script>

<div class="w-full py-8">
    <div class="relative max-w-6xl mx-auto px-6">
        {#if shuffledBrands.length > 0}
            <div class="flex items-center">
                <Button
                    variant="ghost"
                    class="absolute left-0 z-10 -ml-8"
                    on:click={prev}
                    aria-label="Previous brands"
                    disabled={currentIndex === 0}
                >
                    <ChevronLeftIcon class="h-8 w-8 text-primary" />
                </Button>

                <div class="overflow-hidden mx-16">
                    <div
                        class="flex gap-6 transition-transform duration-300 ease-in-out"
                        style:transform="translateX(-{currentIndex * 100}%)"
                    >
                        {#each Array(totalPages) as _, pageIndex}
                            <div class="flex gap-6 min-w-full">
                                {#each shuffledBrands.slice(pageIndex * visibleCards, (pageIndex + 1) * visibleCards) as brand (brand.id)}
                                    <div 
                                        class="flex-1"
                                    >
                                        <a 
                                            href="/brands/{brand.id}" 
                                            class="block group relative"
                                        >
                                            <div class="bg-card border border-border rounded-lg shadow-sm 
                                                       hover:shadow-lg transition-all duration-300 p-4 
                                                       transform group-hover:-translate-y-1">
                                                <div class="flex flex-col items-center gap-3">
                                                    <div class="w-16 h-16 flex items-center justify-center">
                                                        <BrandLogo {brand} size="lg" />
                                                    </div>
                                                    <h3 class="font-semibold text-base text-center text-foreground">
                                                        {brand.brandName}
                                                    </h3>
                                                    {#if brand.subCategory}
                                                        {@const maybeIcon = getCategoryIcon(brand.subCategory, false)}
                                                        <div class="text-sm flex items-center gap-2 text-muted-foreground">
                                                            {#if maybeIcon}
                                                                <div class={maybeIcon.color}>
                                                                    <maybeIcon.icon size={16} />
                                                                </div>
                                                            {/if}
                                                            <span>{brand.subCategory}</span>
                                                        </div>
                                                    {/if}
                                                    {#if brand.brandWebsite}
                                                        <a 
                                                            href={brand.brandWebsite}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            class="font-mono text-xs text-blue-600 hover:text-blue-800 mt-auto"
                                                        >
                                                            {getDomainFromUrl(brand.brandWebsite)}
                                                        </a>
                                                    {/if}
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                {/each}
                            </div>
                        {/each}
                    </div>
                </div>

                <Button
                    variant="ghost"
                    class="absolute right-0 z-10 -mr-8"
                    on:click={next}
                    aria-label="Next brands"
                    disabled={currentIndex === totalPages - 1}
                >
                    <ChevronRightIcon class="h-8 w-8 text-primary" />
                </Button>
            </div>
        {:else}
            <div class="text-center py-8 text-muted-foreground">
                No brands available
            </div>
        {/if}
    </div>
</div>