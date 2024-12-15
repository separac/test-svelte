<script lang="ts">
    import { onMount } from 'svelte';
    import type { Product } from "$lib/types";
    import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
    import { Separator } from "$lib/components/ui/separator";
    import { Badge } from "$lib/components/ui/badge";
    import { getCategoryIcon } from '$lib/utils/category-icons';
    import { formatCurrency } from '$lib/utils/format';
    import CountryFlag from "$lib/components/ui/country-flag.svelte";
    import { Alert, AlertTitle, AlertDescription } from "$lib/components/ui/alert";
    import {
        Collapsible,
        CollapsibleContent,
        CollapsibleTrigger,
    } from "$lib/components/ui/collapsible";
    import {
        ExternalLink,
        ChevronRight,
        Globe,
        Calendar,
        Shield,
        ThumbsUp,
        ThumbsDown,
        ChevronDown,
        Info,
        Box,
        Users,
        Check,
        AlertCircle,
        Zap
    } from "lucide-svelte";

    // Icons
    import TagIcon from '~icons/lucide/tag';
    import ShoppingCartIcon from '~icons/lucide/shopping-cart';
    import GlobeIcon from '~icons/lucide/globe';
    import AlertTriangleIcon from '~icons/lucide/alert-triangle';
    import ThumbsUpIcon from '~icons/lucide/thumbs-up';
    import ThumbsDownIcon from '~icons/lucide/thumbs-down';
    import CalendarIcon from '~icons/lucide/calendar';
    import ShieldIcon from '~icons/lucide/shield';
    import MapPinIcon from '~icons/lucide/map-pin';
    // import ChevronRight from '~icons/lucide/chevron-right';
    import ExternalLinkIcon from '~icons/lucide/external-link';

    // Proper type checking and initialization
    const { data } = $props();
    const product = $derived(data?.product ?? null);
    
    // State management with proper initialization
    let isLoading = $state(true);
    let currentImageIndex = $state(0);
    let isSpecsOpen = $state(false);
    let loadedImages = $state(new Set<number>());
    
    // Reactive image processing with safety checks
    const images = $derived(() => {
        if (!product?.images) return [];
        return Array.isArray(product.images) 
            ? product.images.map(img => img.url)
            : [];
    });

    function onImageLoad(index: number) {
        loadedImages.add(index);
    }

    function formatDate(date: string | null) {
        if (!date) return 'N/A';
        try {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return 'N/A';
        }
    }

    function getDomainFromUrl(url: string | null): string {
        if (!url) return '';
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return '';
        }
    }

    function nextImage() {
        if (!images?.length || images.length <= 1) return;
        currentImageIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
    }

    function prevImage() {
        if (!images?.length || images.length <= 1) return;
        currentImageIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    }

    onMount(() => {
        setTimeout(() => {
            isLoading = false;
        }, 100); // Small delay to ensure data is loaded
    });
</script>

{#if isLoading}
    <div class="flex items-center justify-center min-h-screen">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
{:else if !product}
    <div class="p-4 bg-red-50 text-red-600 rounded-lg">
        <p>Error loading product data. Please try again later.</p>
    </div>
{:else}
    <div class="min-h-screen bg-white font-sans">
        <div class="container max-w-screen-xl mx-auto pt-8">
            <!-- Breadcrumb -->
            <div class="flex items-center gap-2 text-sm text-gray-600 mb-8 font-mono">
                <a href="/" class="hover:text-blue-600">Home</a>
                <ChevronRight class="h-4 w-4" />
                <a href="/categories/{product.category.main.toLowerCase()}" class="hover:text-blue-600">
                    {product.category.main}
                </a>
                <ChevronRight class="h-4 w-4" />
                <span>{product.category.sub}</span>
            </div>

            <!-- Product Header -->
            <div class="mb-8">
                <a 
                    href="/brands/{product.brand.id}"
                    class="text-sm font-medium text-blue-600 hover:underline font-mono"
                >
                    {product.brand.name}
                </a>
                <h1 class="text-4xl font-bold my-4">{product.name}</h1>
                
                <!-- Categories -->
                <div class="flex flex-wrap gap-2 mb-6">
                    <span class="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-mono gap-1.5">
                        <getCategoryIcon category={product.category.main} class="h-4 w-4" />
                        {product.category.main}
                    </span>
                    <span class="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-mono gap-1.5">
                        <ChevronRight class="h-4 w-4" />
                        {product.category.sub}
                    </span>
                </div>
                
                <Card class="p-6 mb-8">
                    <div class="prose prose-gray max-w-none">
                        <p class="text-gray-600 leading-relaxed font-mono">
                            {product.description}
                        </p>
                    </div>
                </Card>
            </div>

            <!-- Product Description Box (Moved up) -->
            <Card class="mb-8">
                <div class="p-6">
                    <h3 class="text-lg font-semibold mb-4">Product Description</h3>
                    <p class="text-gray-600 leading-relaxed font-mono">
                        {product.description || 'N/A'}
                    </p>
                </div>
            </Card>

            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                <!-- Left Column - Image Carousel -->
                <div class="space-y-4">
                    {#if images.length > 0}
                        <Card class="relative overflow-hidden bg-gray-50 aspect-[4/3]">
                            {#each images as image, idx}
                                {#if Math.abs(currentImageIndex - idx) <= 1}
                                    <img
                                        src={image}
                                        alt="{product.name} - View {idx + 1}"
                                        class="w-full h-full object-contain absolute top-0 left-0 transition-opacity duration-300 {
                                            currentImageIndex === idx ? 'opacity-100' : 'opacity-0'
                                        }"
                                        loading="lazy"
                                        on:load={() => onImageLoad(idx)}
                                        style="display: {currentImageIndex === idx ? 'block' : 'none'}"
                                    />
                                {/if}
                            {/each}

                            <!-- Loading state -->
                            {#if !loadedImages.has(currentImageIndex)}
                                <div class="absolute inset-0 flex items-center justify-center bg-gray-100">
                                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            {/if}

                            <!-- Navigation buttons -->
                            {#if images.length > 1}
                                <button
                                    on:click={prevImage}
                                    class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                                    aria-label="Previous image"
                                >
                                    ←
                                </button>
                                <button
                                    on:click={nextImage}
                                    class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                                    aria-label="Next image"
                                >
                                    →
                                </button>
                            {/if}

                            <!-- Dots navigation -->
                            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {#each images as _, idx}
                                    <button
                                {#each images as _, idx}
                                    <button
                                        onclick={() => currentImageIndex = idx}
                                        class="w-2 h-2 rounded-full transition-colors {
                                            idx === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'
                                        }"
                                        aria-label="Go to image {idx + 1}"
                                    ></button>
                        </Card>
                    {:else}
                        <div class="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                            <p class="text-gray-500">No images available</p>
                        </div>
                    {/if}
                    <p class="text-xs text-gray-500 italic text-center">
                        Images shown are exemplary product pictures. All image rights belong to the respective manufacturer.
                    </p>
                </div>

                <!-- Right Column - Product Info -->
                <div class="space-y-8">
                    <!-- Pricing -->
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="text-3xl font-bold font-mono">{formatCurrency(product.msrp).replace('$', '')}</span>
                            <span class="text-sm text-gray-500 font-mono self-end mb-1">MSRP</span>
                        </div>
                        {#if product.currentPrice && product.currentPrice !== product.msrp}
                            <div class="text-sm text-gray-600 mt-2">
                                Current Price: ${formatCurrency(product.currentPrice)}
                                <span class="text-xs ml-2">
                                    (Updated: {formatDate(product.priceLastUpdated)})
                                </span>
                            </div>
                        {/if}
                    </div>

                    <!-- Where to Buy -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold">Where to Buy</h3>
                        <div class="space-y-3">
                            {#if product.productLink}
                                <a
                                    href={product.productLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="flex items-center justify-between p-4 rounded-lg border hover:border-blue-500 hover:shadow-md transition-all"
                                >
                                    <span class="font-medium">Official Website</span>
                                    <ExternalLinkIcon class="h-4 w-4" />
                                </a>
                            {/if}
                            {#if product.affiliateLink}
                                <a
                                    href={product.affiliateLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="flex items-center justify-between p-4 rounded-lg border hover:border-blue-500 hover:shadow-md transition-all"
                                >
                                    <span class="font-medium">Shop Now</span>
                                    <ExternalLinkIcon class="h-4 w-4" />
                                </a>
                            {/if}
                        </div>
                    </div>

                    <!-- Product Details Collapsible -->
                    <Collapsible
                        bind:open={isSpecsOpen}
                        class="w-full space-y-2"
                    >
                        <CollapsibleTrigger class="flex w-full items-center justify-between rounded-lg border p-4 font-medium hover:bg-gray-50">
                            <div class="flex items-center gap-2">
                                <Info class="h-5 w-5 text-gray-500" />
                                <span>Product Information</span>
                            </div>
                            <ChevronDown
                                class="h-5 w-5 text-gray-500 transition-transform {isSpecsOpen ? 'rotate-180' : ''}"
                            />
                        </CollapsibleTrigger>
                        <CollapsibleContent class="space-y-6 rounded-lg border p-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- Origin -->
                                <div class="flex items-start gap-3">
                                    <Globe class="h-5 w-5 text-gray-400 mt-1" />
                                    <div>
                                        <p class="text-sm text-gray-600 font-mono">Origin</p>
                                        <p class="font-medium font-mono">{product.countryOfOrigin}</p>
                                    </div>
                                </div>

                                <!-- Year Introduced -->
                                <div class="flex items-start gap-3">
                                    <Calendar class="h-5 w-5 text-gray-400 mt-1" />
                                    <div>
                                        <p class="text-sm text-gray-600 font-mono">Year Introduced</p>
                                        <p class="font-medium font-mono">{product.yearIntroduced}</p>
                                    </div>
                                </div>

                                <!-- Materials and PFAS -->
                                <div class="flex items-start gap-3 md:col-span-2">
                                    <Box class="h-5 w-5 text-gray-400 mt-1" />
                                    <div class="flex-1">
                                        <p class="text-sm text-gray-600 font-mono mb-2">Materials</p>
                                        <div class="space-y-2">
                                            {#each product.materials as material}
                                                <div class="flex items-center justify-between font-mono border-b border-gray-100 pb-2">
                                                    <span>{material.name}</span>
                                                    <span class="text-sm text-gray-600">{material.percentage}%</span>
                                                </div>
                                            {/each}
                                        </div>
                                        {#if product.containsPfas}
                                            <div class="mt-3 flex items-center gap-2">
                                                <Zap class="h-4 w-4 text-gray-400" />
                                                <span class="text-sm text-gray-600 font-mono">PFAS Free Product</span>
                                            </div>
                                        {/if}
                                    </div>
                                </div>

                                <!-- Warranty -->
                                <div class="flex items-start gap-3 md:col-span-2">
                                    <Shield class="h-5 w-5 text-gray-400 mt-1" />
                                    <div>
                                        <p class="text-sm text-gray-600 font-mono mb-1">{product.warrantyInfo.type}</p>
                                        <p class="text-sm text-gray-600 font-mono">{product.warrantyInfo.details}</p>
                                    </div>
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </div>

            <!-- Product Information Box (After images) -->
            <Card class="mb-8">
                <CollapsibleContent class="space-y-6 p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Origin -->
                        <div class="flex items-start gap-3">
                            <Globe class="h-5 w-5 text-gray-400 mt-1" />
                            <div>
                                <p class="text-sm text-gray-600 font-mono">Country of Origin</p>
                                <p class="font-medium font-mono">{product.countryOfOrigin || 'N/A'}</p>
                            </div>
                        </div>

                        <!-- Year Introduced -->
                        <div class="flex items-start gap-3">
                            <Calendar class="h-5 w-5 text-gray-400 mt-1" />
                            <div>
                                <p class="text-sm text-gray-600 font-mono">Year Introduced</p>
                                <p class="font-medium font-mono">{product.yearIntroduced || 'N/A'}</p>
                            </div>
                        </div>

                        <!-- PFAS Information -->
                        <div class="flex items-start gap-3">
                            <Zap class="h-5 w-5 text-gray-400 mt-1" />
                            <div>
                                <p class="text-sm text-gray-600 font-mono">PFAS Free</p>
                                <p class="font-medium font-mono">{product.containsPfas ? 'No' : 'Yes'}</p>
                            </div>
                        </div>

                        <!-- Warranty -->
                        <div class="flex items-start gap-3">
                            <Shield class="h-5 w-5 text-gray-400 mt-1" />
                            <div>
                                <p class="text-sm text-gray-600 font-mono">Warranty</p>
                                <p class="font-medium font-mono">{product.warrantyInfo || 'N/A'}</p>
                            </div>
                        </div>

                        <!-- Product Link -->
                        <div class="flex items-start gap-3">
                            <ExternalLink class="h-5 w-5 text-gray-400 mt-1" />
                            <div>
                                <p class="text-sm text-gray-600 font-mono">Official Product Page</p>
                                {#if product.productLink}
                                    <a href={product.productLink} target="_blank" rel="noopener noreferrer" 
                                       class="text-blue-600 hover:underline font-mono">
                                        {getDomainFromUrl(product.productLink)}
                                    </a>
                                {:else}
                                    <p class="font-medium font-mono">N/A</p>
                                {/if}
                            </div>
                        </div>

                        <!-- Brand Information -->
                        <div class="flex items-start gap-3">
                            <Box class="h-5 w-5 text-gray-400 mt-1" />
                            <div>
                                <p class="text-sm text-gray-600 font-mono">Brand</p>
                                <a href="/brands/{product.brand.id}" class="text-blue-600 hover:underline font-mono">
                                    {product.brand.name}
                                </a>
                            </div>
                        </div>
                    </div>
                </CollapsibleContent>
            </Card>

            <!-- Author Notes -->
            {#if product.authorNotes}
                <section class="mb-12">
                    <Alert class="bg-blue-50 border-blue-200">
                        <Info class="h-5 w-5 text-blue-600" />
                        <AlertTitle class="text-blue-600 mb-2 font-mono">Author Notes</AlertTitle>
                        <AlertDescription class="text-gray-700 font-mono">
                            {product.authorNotes}
                        </AlertDescription>
                    </Alert>
                </section>
            {/if}

            <!-- Community Feedback -->
            <section class="mb-12">
                <h2 class="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <Users class="h-6 w-6 text-gray-400" />
                    Community Feedback
                </h2>
                <div class="grid md:grid-cols-2 gap-6">
                    <!-- What People Like -->
                    <Card class="p-6 bg-green-50/50">
                        <div class="flex items-center gap-2 mb-4">
                            <ThumbsUpIcon class="h-5 w-5 text-green-600" />
                            <h3 class="font-medium">What People Like</h3>
                        </div>
                        <ul class="space-y-3">
                            {#if Array.isArray(product.likes)}
                                {#each product.likes as like}
                                    <li class="flex items-start gap-2">
                                        <Check class="h-4 w-4 text-green-600 mt-1 shrink-0" />
                                        <span>{like}</span>
                                    </li>
                                {/each}
                            {:else}
                                <li class="text-gray-500">No likes yet</li>
                            {/if}
                        </ul>
                    </Card>

                    <!-- Points to Consider -->
                    <Card class="p-6 bg-red-50/50">
                        <div class="flex items-center gap-2 mb-4">
                            <ThumbsDownIcon class="h-5 w-5 text-red-600" />
                            <h3 class="font-medium">Points to Consider</h3>
                        </div>
                        <ul class="space-y-3">
                            {#if Array.isArray(product.dislikes)}
                                {#each product.dislikes as dislike}
                                    <li class="flex items-start gap-2">
                                        <AlertCircle class="h-4 w-4 text-red-600 mt-1 shrink-0" />
                                        <span>{dislike}</span>
                                    </li>
                                {/each}
                            {:else}
                                <li class="text-gray-500">No points to consider yet</li>
                            {/if}
                        </ul>
                    </Card>
                </div>
            </section>

            <!-- Community Feedback (Fixed) -->
            <div class="grid md:grid-cols-2 gap-6">
                <Card class="p-6 bg-green-50/50">
                    <div class="flex items-center gap-2 mb-4">
                        <ThumbsUp class="h-5 w-5 text-green-600" />
                        <h3 class="font-medium">What People Like</h3>
                    </div>
                    <ul class="space-y-3">
                        {#if product.likes && product.likes.length > 0}
                            {#each product.likes as like}
                                <li class="flex items-start gap-2">
                                    <Check class="h-4 w-4 text-green-600 mt-1 shrink-0" />
                                    <span>{like}</span>
                                </li>
                            {/each}
                        {:else}
                            <li class="text-gray-500">No likes yet</li>
                        {/if}
                    </ul>
                </Card>
                
                <Card class="p-6 bg-red-50/50">
                    <div class="flex items-center gap-2 mb-4">
                        <ThumbsDown class="h-5 w-5 text-red-600" />
                        <h3 class="font-medium">Points to Consider</h3>
                    </div>
                    <ul class="space-y-3">
                        {#if product.dislikes && product.dislikes.length > 0}
                            {#each product.dislikes as dislike}
                                <li class="flex items-start gap-2">
                                    <AlertCircle class="h-4 w-4 text-red-600 mt-1 shrink-0" />
                                    <span>{dislike}</span>
                                </li>
                            {/each}
                        {:else}
                            <li class="text-gray-500">No points to consider yet</li>
                        {/if}
                    </ul>
                </Card>
            </div>

            <!-- Product Information Last Updated -->
            <section class="mb-12">
                <h2 class="text-xl font-semibold mb-4">Product Information Last Updated</h2>
                <p class="text-gray-600 font-mono">
                    {formatDate(product.updatedAt)}
                </p>
            </section>

            <!-- Last Updated (Smaller) -->
            <p class="text-xs text-gray-400 italic text-center mt-16 mb-4">
                Product information last updated: {formatDate(product.updatedAt)}
            </p>
        </div>
    </div>
{/if}
