<script lang="ts">
    import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "$lib/components/ui/card";
    import { Separator } from "$lib/components/ui/separator";
    import Globe from '~icons/lucide/globe';
    import Box from '~icons/lucide/box';
    import MapPin from '~icons/lucide/map-pin';
    import TagIcon from '~icons/lucide/tag';
    import ChevronRight from '~icons/lucide/chevron-right';
    import Plus from '~icons/lucide/plus';
    import type { PageData } from './$types';
    
    const { data }: { data: PageData } = $props();
    
    // Keep existing getCategoryIcon function
    import { getCategoryIcon } from '$lib/utils/category-icons';
    import { formatCurrency } from '$lib/utils/format';
    import CountryFlag from "$lib/components/ui/country-flag.svelte";

    // Calculate average price
    let averagePrice = $derived(() => {
        if (!data.brand) return 0;
        const productsWithPrice = data.products.filter(product => 
            product.msrp !== null && 
            !isNaN(Number(product.msrp)) &&
            product.msrp > 0
        );
        
        if (productsWithPrice.length === 0) return 0;
        
        const sum = productsWithPrice.reduce((acc, product) => 
            acc + Number(product.msrp), 0);
            
        return sum / productsWithPrice.length;
    });

    // Simplify urls

    function getDomainFromUrl(url: string | null): string {
        if (!url) return '';
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return '';
        }
    }

    
    // Stats data
    let stats = $derived([
        { 
            icon: Globe, 
            label: 'Website', 
            value: data.brand?.website 
        },
        { 
            icon: Box, 
            label: 'Products', 
            value: `${data.products?.length || 0} items` 
        },
        { 
            icon: MapPin, 
            label: 'Location', 
            value: data.brand?.location 
        },
        { 
            icon: TagIcon, 
            label: 'Avg. Price', 
            value: formatCurrency(averagePrice())
        }
    ]);
</script>

<div class="min-h-screen bg-white font-sans">
    {#if data.brand}
        <!-- Hero Section -->
        <div class="pt-12 pb-8 bg-gradient-to-b from-gray-50">
            <div class="container max-w-screen-xl mx-auto">
                <!-- Breadcrumb -->
                <div class="flex items-center gap-3 text-sm text-gray-600 mb-8 font-mono">
                    <a href="/" class="hover:text-blue-600">Home</a>
                    <ChevronRight class="h-4 w-4" />
                    <a href="/brands" class="hover:text-blue-600">Brands</a>
                    <ChevronRight class="h-4 w-4" />
                    <span>{data.brand.category.mainCategory}</span>
                </div>

                <div class="flex flex-col md:flex-row items-start gap-8 md:gap-12">
                    <!-- Brand Logo -->
                    <div class="w-20 h-20 md:w-32 md:h-32 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 p-4 overflow-hidden">
                        {#if data.brand.logoUrl}
                            <img 
                                src={data.brand.logoUrl} 
                                alt={`${data.brand.name} logo`}
                                class="w-full h-full object-contain"
                            />
                        {:else}
                            <span class="text-2xl md:text-4xl font-bold text-blue-700">
                                {data.brand.name.substring(0, 2)}
                            </span>
                        {/if}
                    </div>

                    <!-- Main Content -->
                    <div class="flex-1">
                        <h1 class="text-4xl font-bold mb-4">{data.brand.name}</h1>
                        
                        <!-- Categories -->
                        <div class="flex flex-wrap gap-2 mb-8">
                            {#if data.brand.category?.mainCategory}
                                {@const maybeIcon = getCategoryIcon(data.brand.category?.mainCategory, true)}
                                <span class="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-mono gap-1.5">
                                    {#if maybeIcon?.icon}
                                        {#key maybeIcon.icon}
                                            <maybeIcon.icon class="h-4 w-4 text-blue-700" />
                                        {/key}
                                    {/if}
                                    {data.brand.category.mainCategory}
                                </span>
                            {/if}
                            {#if data.brand.category?.subCategory}
                                {@const categories = Array.isArray(data.brand.category?.subCategory) 
                                    ? data.brand.category.subCategory 
                                    : [data.brand.category?.subCategory]}
                                {#each categories as subCategory}
                                    {@const maybeIcon = getCategoryIcon(subCategory, false)}
                                    <span class="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-mono gap-1.5">
                                        {#if maybeIcon}
                                            <maybeIcon.icon class="h-4 w-4 text-blue-700" />
                                        {/if}
                                        {subCategory}
                                    </span>
                                {/each}
                            {/if}
                        </div>

                        <!-- Quick Stats Grid -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            {#each stats as stat}
                                {#if stat.value}
                                    <div>
                                        <div class="flex items-center gap-2 mb-1.5">
                                            <svelte:component this={stat.icon} class="h-4 w-4 text-gray-400" />
                                            {#if stat.label === 'Website' && data.brand.website}
                                                <a 
                                                    href={data.brand.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer" 
                                                    class="font-mono font-medium text-blue-600 hover:underline"
                                                >
                                                    {getDomainFromUrl(data.brand.website)}
                                                </a>
                                            {:else if stat.label === 'Location'}
                                                <div class="flex items-center gap-2">
                                                    <span class="font-mono font-medium">{stat.value}</span>
                                                    <CountryFlag country={stat.value} size="sm" />
                                                </div>
                                            {:else}
                                                <span class="font-mono font-medium">{stat.value}</span>
                                            {/if}
                                        </div>
                                        <span class="text-sm text-gray-600 font-mono">{stat.label}</span>
                                    </div>
                                {/if}
                            {/each}
                        </div>

                        <!-- About Section -->
                        {#if data.brand.description}
                            <div class="w-full">
                                <Separator class="mb-8" />
                                <div>
                                    <h2 class="text-xl font-semibold mb-4">About</h2>
                                    <p class="text-gray-600 leading-relaxed">
                                        {data.brand.description}
                                    </p>
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>

        <!-- Products Section -->
        <div class="container max-w-screen-xl mx-auto py-12">
            <Separator class="mb-8" />
            
            <div class="space-y-8">
                <h2 class="text-2xl font-semibold flex items-center gap-2">
                    <Box class="h-6 w-6 text-gray-400" />
                    <span>Products</span>
                </h2>
                
                {#if data.products.length === 0}
                    <Card class="p-8">
                        <div class="flex flex-col items-center text-center gap-4">
                            <div class="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                                <Box class="h-12 w-12 text-gray-400" />
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold mb-2">No products yet</h3>
                                <p class="text-gray-600 mb-4 font-mono">
                                    Be the first to submit a product for {data.brand.name}
                                </p>
                                <a 
                                    href="/submit-product" 
                                    class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-mono"
                                >
                                    <Plus class="h-4 w-4" />
                                    Submit Product
                                </a>
                            </div>
                        </div>
                    </Card>
                {:else}
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {#each data.products as product (product.id)}
                            <a 
                                href="/products/{product.id}" 
                                class="block group"
                            >
                                <Card class="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                    <div class="p-6">
                                        {#if product.category.subCategory}
                                        {@const maybeIcon = getCategoryIcon(product.category.subCategory, false)}
                                            <div class="mb-4">
                                                <span class="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-mono gap-1.5">
                                                    {#if maybeIcon}
                                                        <svelte:component this={maybeIcon.icon} class="h-3.5 w-3.5 text-blue-700" />
                                                    {/if}
                                                    {product.category.subCategory}
                                                </span>
                                            </div>
                                        {/if}
                                        <h3 class="font-medium mb-2 group-hover:text-blue-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        {#if product.description}
                                            <p class="text-sm text-gray-600 mb-4 line-clamp-2">
                                                {product.description}
                                            </p>
                                        {/if}
                                        <div class="flex items-center justify-between">
                                            {#if product.msrp}
                                                <span class="font-mono font-semibold">{formatCurrency(product.msrp)}</span>
                                            {/if}
                                            <span class="text-sm text-blue-600 font-mono group-hover:translate-x-1 transition-transform">
                                                View details →
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </a>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    {:else}
        <Card>
            <CardHeader>
                <CardTitle>Brand not found</CardTitle>
                <CardDescription>The requested brand could not be found.</CardDescription>
            </CardHeader>
        </Card>
    {/if}
</div>