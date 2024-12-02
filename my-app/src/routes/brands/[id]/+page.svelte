<!-- src/routes/brands/[id]/+page.svelte -->
<script lang="ts">
    import type { PageData } from './$types';
    import { 
        Breadcrumb,
        BreadcrumbItem,
        BreadcrumbList,
        BreadcrumbPage,
        BreadcrumbSeparator
    } from "$lib/components/ui/breadcrumb";
    import { 
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle 
    } from "$lib/components/ui/card";
    import BrandLogo from '$lib/components/brand-logo.svelte';
    import { formatCurrency } from '$lib/utils/format';

    // Import icons (using heroicons style for consistency)
    import GlobeIcon from '~icons/heroicons/globe-alt';
    import BoxIcon from '~icons/heroicons/cube';
    import MapPinIcon from '~icons/heroicons/map-pin';
    import CurrencyIcon from '~icons/heroicons/currency-dollar';
    import PlusIcon from '~icons/heroicons/plus';
    import { Button } from '$lib/components/ui/button';
    import StoreIcon from '~icons/heroicons/building-storefront';
    import FolderIcon from '~icons/heroicons/folder';
    import TagIcon from '~icons/heroicons/tag';

    let { data } = $props<{ data: PageData }>();
    
    function getDomainFromUrl(url: string | null): string {
        if (!url) return '';
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return '';
        }
    }

    // Calculate average price using Svelte 5's runes
    let averagePrice = $derived(
        data.products.length > 0 
            ? data.products.reduce((acc, product) => acc + (product.msrp || 0), 0) / data.products.length 
            : 0
    );
</script>

<div class="container max-w-screen-xl space-y-8 py-8 relative z-1">
    <!-- Breadcrumb Navigation -->
    <Breadcrumb class="font-mono">
        <BreadcrumbList>
            <BreadcrumbItem>
                <a href="/" class="hover:underline">Home</a>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                <a href="/brands" class="hover:underline">Brands</a>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>{data.brand.name}</BreadcrumbPage>
        </BreadcrumbList>
    </Breadcrumb>

    <!-- Main Brand Info -->
    {#if data.brand}
        <!-- Products Section -->
        <section class="mt-8">
            <h2 class="flex items-center gap-2 text-xl font-medium border-b pb-4 mb-6">
                <StoreIcon class="h-6 w-6" />
                Profile
            </h2>
        <div class="bg-card p-4 sm:p-8 relative border rounded-xl overflow-hidden">

            <!-- Brand Header -->
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden">
                    <BrandLogo brand={data.brand} class="w-full h-full object-contain" />
                </div>
                
                <div class="flex-grow text-center sm:text-left">
                    <h1 class="text-xl sm:text-3xl font-semibold mb-3">
                        {data.brand.name}
                    </h1>
                    
                    <!-- Categories Display -->
                    <div class="flex flex-wrap gap-2">
                        {#if data.brand.mainCategory}
                            <div class="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                                <FolderIcon class="h-4 w-4 mr-1.5" />
                                {data.brand.mainCategory}
                            </div>
                        {/if}
                        
                        {#if data.brand.subCategories?.length}
                            {#each data.brand.subCategories as category}
                                <div class="inline-flex items-center px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
                                    <TagIcon class="h-3.5 w-3.5 mr-1.5" />
                                    {category}
                                </div>
                            {/each}
                        {/if}
                    </div>
                </div>
            </div>

            <!-- Stats Grid -->
            <div class="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {#each [
                    { icon: GlobeIcon, label: 'Website', value: getDomainFromUrl(data.brand.website) || 'N/A', isWebsite: true },
                    { icon: BoxIcon, label: 'Products', value: `${data.products.length} items` },
                    { icon: MapPinIcon, label: 'Location', value: data.brand.location || 'N/A' },
                    { icon: CurrencyIcon, label: 'Avg. Price', value: formatCurrency(averagePrice) }
                ] as stat}
                    <Card>
                        <CardContent class="p-4 flex flex-col items-center text-center h-full">
                            <div class="flex items-center gap-2 mb-2">
                                <!-- svelte-ignore svelte_component_deprecated -->
                                <svelte:component this={stat.icon} class="h-5 w-5 text-muted-foreground" />
                                <span class="font-semibold text-sm">{stat.label}</span>
                            </div>
                            {#if stat.isWebsite && data.brand.website}
                                <a 
                                    href={data.brand.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-sm font-mono text-blue-600 hover:text-blue-800 mt-auto"
                                >
                                    {stat.value}
                                </a>
                            {:else}
                                <span class="text-sm font-mono text-muted-foreground">
                                    {stat.value}
                                </span>
                            {/if}
                        </CardContent>
                    </Card>
                {/each}
            </div>
        </div>
        </section>
        <!-- Products Section -->
        <section class="mt-8">
            <h2 class="flex items-center gap-2 text-xl font-medium border-b pb-4 mb-6">
                <BoxIcon class="h-6 w-6" />
                Products
            </h2>
            
            {#if data.products.length === 0}
                <Card class="p-8 font-mono">
                    <div class="flex flex-col items-center text-center gap-4">
                        <div class="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                            <BoxIcon class="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold mb-2">No products yet</h3>
                            <p class="text-muted-foreground mb-4">
                                Be the first to submit a product for {data.brand.name}
                            </p>
                            <Button variant="default" class="bg-blue-600 hover:bg-blue-800" asChild>
                                <a href="/submit-product" class="flex items-center gap-2">
                                    <PlusIcon class="h-4 w-4" />
                                    Submit Product
                                </a>
                            </Button>
                        </div>
                    </div>
                </Card>
            {:else}
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {#each data.products as product (product.id)}
                        <Card class="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                            <CardHeader>
                                <CardTitle class="text-lg">{product.name}</CardTitle>
                                {#if product.subCategory}
                                    <CardDescription>{product.subCategory}</CardDescription>
                                {/if}
                            </CardHeader>
                            <CardContent>
                                {#if product.description}
                                    <p class="text-sm text-muted-foreground line-clamp-2 mb-2">
                                        {product.description}
                                    </p>
                                {/if}
                                {#if product.msrp}
                                    <div class="font-semibold">
                                        {formatCurrency(product.msrp)}
                                    </div>
                                {/if}
                            </CardContent>
                        </Card>
                    {/each}
                </div>
            {/if}
        </section>
    {:else}
        <Card>
            <CardHeader>
                <CardTitle>Brand not found</CardTitle>
                <CardDescription>The requested brand could not be found.</CardDescription>
            </CardHeader>
        </Card>
    {/if}
</div>