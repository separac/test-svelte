<!-- src/lib/components/brand-carousel.svelte -->
<script lang="ts">
    import { 
        Carousel, 
        CarouselContent, 
        CarouselItem, 
        CarouselNext, 
        CarouselPrevious 
    } from "$lib/components/ui/carousel";    
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

    let shuffledBrands = $state<typeof brands>([]);

    // Initialize shuffled brands
    $effect(() => {
        if (brands.length > 0) {
            shuffledBrands = shuffle([...brands]);
        }
    });

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
    <div class="max-w-6xl mx-auto px-6">
        {#if shuffledBrands.length > 0}
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                class="w-full"
            >
                <CarouselContent class="-ml-4">
                    {#each shuffledBrands as brand (brand.id)}
                        <CarouselItem class="pl-4 pt-1 basis-full sm:basis-1/2 lg:basis-1/3">
                            <a 
                                href="/brands/{brand.id}" 
                                class="block group"
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
                                                on:click|stopPropagation
                                            >
                                                {getDomainFromUrl(brand.brandWebsite)}
                                            </a>
                                        {/if}
                                    </div>
                                </div>
                            </a>
                        </CarouselItem>
                    {/each}
                </CarouselContent>
                <CarouselPrevious class="-left-12" />
                <CarouselNext class="-right-12" />
            </Carousel>
        {:else}
            <div class="text-center py-8 text-muted-foreground">
                No brands available
            </div>
        {/if}
    </div>
</div>