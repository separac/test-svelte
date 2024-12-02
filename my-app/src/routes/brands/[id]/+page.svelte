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
    import { getCategoryIcon } from '$lib/utils/category-icons';
    import { formatCurrency } from '$lib/utils/format';

    // Import icons
    import GlobeIcon from '~icons/mdi/web';
    import BoxIcon from '~icons/mdi/box';

    let { data } = $props<{ data: PageData }>();
    
    function getDomainFromUrl(url: string | null): string {
        if (!url) return '';
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return '';
        }
    }
</script>

<!-- HERE STARTS THE PAGE -->

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

    <!-- Brand Profile -->
    <div class="grid gap-6 md:grid-cols-[300px_1fr]">
        <!-- Brand Info Card -->
        {#if data.brand}
            <Card>
                <CardHeader>
                    <div class="flex flex-col items-center gap-4">
                        <div class="w-32 h-32">
                            <BrandLogo brand={data.brand} size="lg" />
                        </div>
                        <div class="text-center">
                            <CardTitle class="text-2xl mb-2">{data.brand.name}</CardTitle>
                            {#if data.brand.website}
                                <a 
                                    href={data.brand.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2"
                                >
                                    <GlobeIcon class="h-4 w-4" />
                                    {getDomainFromUrl(data.brand.website)}
                                </a>
                            {/if}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div class="space-y-4">
                        {#if data.brand.category}
                            {@const maybeIcon = getCategoryIcon(data.brand.category.main_category, true)}
                            <div class="text-sm">
                                <div class="font-semibold mb-1">Category</div>
                                <div class="flex items-center gap-2">
                                    {#if maybeIcon}
                                        <div class={maybeIcon.color}>
                                            <maybeIcon.icon size={16} />
                                        </div>
                                    {/if}
                                    <span>{data.brand.category.main_category}</span>
                                </div>
                            </div>
                        {/if}
                        {#if data.brand.description}
                            <div class="text-sm">
                                <div class="font-semibold mb-1">About</div>
                                <p class="text-muted-foreground">{data.brand.description}</p>
                            </div>
                        {/if}
                    </div>
                </CardContent>
            </Card>
        {:else}
            <Card>
                <CardHeader>
                    <CardTitle>Brand not found</CardTitle>
                </CardHeader>
            </Card>
        {/if}

        <!-- Products Section -->
        <div class="space-y-6">
            <h2 class="text-2xl font-semibold flex items-center gap-2">
                <BoxIcon class="h-6 w-6" />
                Products
            </h2>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {#each data.products as product (product.id)}
                    {@const maybeIcon = getCategoryIcon(product.subCategory, false)}
                    <Card class="hover:shadow-lg transition-shadow">
                        <a href="/products/{product.id}" class="block">
                            <CardHeader>
                                <CardTitle class="text-lg">{product.name}</CardTitle>
                                {#if product.subCategory}
                                    <CardDescription>
                                        <div class="flex items-center gap-2">
                                            {#if maybeIcon}
                                                <div class={maybeIcon.color}>
                                                    <maybeIcon.icon size={16} />
                                                </div>
                                            {/if}
                                            <span>{product.subCategory}</span>
                                        </div>
                                    </CardDescription>
                                {/if}
                            </CardHeader>
                            <CardContent>
                                {#if product.description}
                                    <p class="text-sm text-muted-foreground line-clamp-2">
                                        {product.description}
                                    </p>
                                {/if}
                                {#if product.msrp}
                                    <div class="mt-2 font-semibold">
                                        {formatCurrency(product.msrp)}
                                    </div>
                                {/if}
                            </CardContent>
                        </a>
                    </Card>
                {/each}
            </div>
        </div>
    </div>
</div>