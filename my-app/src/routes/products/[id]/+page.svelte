<script lang="ts">
    import { onMount } from 'svelte';
    import type { Product } from '$lib/types';

    // UI Components
    import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
    import { getCategoryIcon } from '$lib/utils/category-icons';
    import { Separator } from '$lib/components/ui/separator';
    import { Badge } from '$lib/components/ui/badge';
    import CountryFlag from '$lib/components/ui/country-flag.svelte';
    import { formatCurrency } from '$lib/utils/format';
    import { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert';
    import {
        Accordion,
        AccordionContent,
        AccordionItem,
        AccordionTrigger
    } from "$lib/components/ui/accordion";

    // Icon Imports from lucide-svelte
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
    } from 'lucide-svelte';

    // Custom Icons
    import TagIcon from '~icons/lucide/tag';
    import ShoppingCartIcon from '~icons/lucide/shopping-cart';
    import GlobeIcon from '~icons/lucide/globe';
    import AlertTriangleIcon from '~icons/lucide/alert-triangle';
    import ThumbsUpIcon from '~icons/lucide/thumbs-up';
    import ThumbsDownIcon from '~icons/lucide/thumbs-down';
    import CalendarIcon from '~icons/lucide/calendar';
    import ShieldIcon from '~icons/lucide/shield';
    import MapPinIcon from '~icons/lucide/map-pin';
    import ExternalLinkIcon from '~icons/lucide/external-link';



    // Type definition for page props
    type ProductPageData = {
        data: {
            product: Product | null;
        };
    };

    // Extracting props using TypeScript type annotation
    let { data } = $props() as ProductPageData;

    // Derived store for product data
    let product = $derived.by(() => data?.product ?? null);

    // State variables
    let isLoading = $derived(product === null);
    let currentImageIndex = $state(0);
    let loadedImages = $state(new Set<number>());
    let isFirstImageLoaded = $state(false);
    let images = $derived.by(() => {
        if (!product?.images) return [];
        // Extract the URL from each image object
        return product.images.map(img => img.url);
    });

    // Derive the current image URL
    let currentImage = $derived.by(() => images?.[currentImageIndex] ?? '');

    /**
     * Marks an image as loaded by adding its index to the loadedImages set.
     * @param index - The index of the loaded image.
     */
    function onImageLoad(idx: number) {
        loadedImages.add(idx);
        if (idx === 0) {
            isFirstImageLoaded = true;
        }
    }

    /**
     * Formats a date string into a human-readable format.
     * @param date - The date string to format.
     * @returns A formatted date string or 'N/A' if invalid.
     */
    function formatDate(date: string | null): string {
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

    /**
     * Extracts the domain from a given URL.
     * @param url - The URL string to extract the domain from.
     * @returns The domain name or an empty string if invalid.
     */
    function getDomainFromUrl(url: string | null): string {
        if (!url) return '';
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return '';
        }
    }

    /**
     * Navigates to the next image in the gallery.
     */
    function nextImage() {
        if (images.length <= 1) return;
        currentImageIndex = (currentImageIndex + 1) % images.length;
    }

    /**
     * Navigates to the previous image in the gallery.
     */
    function prevImage() {
        if (images.length <= 1) return;
        currentImageIndex = (currentImageIndex === 0) ? images.length - 1 : currentImageIndex - 1;
    }

    // Initial load effect
    $effect(() => {
        // Reset states when product changes
        currentImageIndex = 0;
        loadedImages = new Set();
        isFirstImageLoaded = false;

        // Preload all images
        images.forEach((url, index) => {
            const img = new Image();
            img.src = url;
            img.onload = () => onImageLoad(index);
            img.onerror = (error) => {
                console.error('Error loading image:', error);
            };
        });
    });

</script>

<!-- Loading Spinner -->
{#if isLoading}
    <div class="flex items-center justify-center min-h-screen">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

<!-- Error Message if Product Not Found -->
{:else if !product}
    <div class="p-4 bg-red-50 text-red-600 rounded-lg">
        <Alert>
            <AlertTitle>Product Not Found</AlertTitle>
            <AlertDescription>
                The product you are looking for does not exist.
            </AlertDescription>
        </Alert>
    </div>

<!-- Product Display -->
{:else}
    <div class="min-h-screen bg-white font-sans">
        <div class="pt-12 pb-8 bg-gradient-to-b from-gray-50">
        <div class="container max-w-screen-xl mx-auto">
            <!-- Breadcrumb -->
            <div class="flex items-center gap-3 text-sm text-gray-600 mb-8 font-mono">
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
                        <svelte:component this={getCategoryIcon(product.category.main, true)?.icon} class="h-4 w-4" />
                        {product.category.main}
                    </span>
                    <span class="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-mono gap-1.5">
                        <svelte:component this={getCategoryIcon(product.category.sub, false)?.icon} class="h-4 w-4" />
                        {product.category.sub}
                    </span>
                </div>
                
            </div>

            <!-- Author Notes -->
            {#if product.authorNotes}
            <div>
                <section class="mb-12">
                    <Alert class="bg-blue-50 border-blue-200">
                        <Info class="h-5 w-5 text-blue-600" />
                        <AlertTitle class="text-blue-600 mb-2 font-mono">Author Notes</AlertTitle>
                        <AlertDescription class="text-gray-700 font-mono">
                            {product.authorNotes}
                        </AlertDescription>
                    </Alert>
                </section>
            </div>
            {/if}

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
                                onload={() => onImageLoad(idx)}
                                style="display: {currentImageIndex === idx ? 'block' : 'none'}"
                                />
                            {/if}
                            {/each}

                            <!-- Loading state - Updated condition -->
                            {#if !isFirstImageLoaded}
                                <div class="absolute inset-0 flex items-center justify-center bg-gray-100">
                                    <div class="flex flex-col items-center gap-2">
                                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <p class="text-sm text-gray-500">Loading image...</p>
                                    </div>
                                </div>
                            {/if}

                            <!-- Navigation buttons -->
                            {#if images.length > 1 && isFirstImageLoaded}
                                <button
                                    onclick={prevImage}
                                    class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                                    aria-label="Previous image"
                                >
                                    ←
                                </button>
                                <button
                                    onclick={nextImage}
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
                                        onclick={() => currentImageIndex = idx}
                                        class="w-2 h-2 rounded-full transition-colors {
                                            idx === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'
                                        }"
                                        aria-label="Go to image {idx + 1}"
                                    ></button>
                                {/each}
                            </div>
                        </Card>
                    {:else}
                        <div class="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                            <p class="text-gray-500">No images available</p>
                        </div>
                    {/if}
                    <p class="text-xs text-gray-500 italic text-center">
                        Images shown are exemplary product pictures. All image rights belong to the manufacturer.
                    </p>
                </div>

                <!-- Right Column - Product Info -->
                <div class="space-y-8">
                    <!-- Pricing -->
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="text-3xl font-bold font-mono">{formatCurrency(product.msrp)}</span>
                            <span class="text-sm text-gray-500 font-mono self-end mb-1">MSRP</span>
                        </div>
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
            <!-- Product Details Accordion -->
            <Accordion type="single">
                <AccordionItem value="product-info">
                    <AccordionTrigger>
                        <div class="flex items-center gap-2">
                            <Info class="h-5 w-5 text-gray-500" />
                            <span>Product Information</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Origin -->
                            <div class="flex items-start gap-3">
                                <Globe class="h-5 w-5 text-gray-400 mt-1" />
                                <div>
                                    <p class="text-sm text-gray-600 font-mono">Origin</p>
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

                            <!-- Materials -->
                            <div class="flex items-start gap-3">
                                <Box class="h-5 w-5 text-gray-400 mt-1" />
                                <div>
                                    <p class="text-sm text-gray-600 font-mono">Materials</p>
                                    {#if product.materials?.length}
                                        <div class="space-y-2">
                                            {#each product.materials as material}
                                                <div class="flex items-center justify-between font-mono">
                                                    <span>{material.name}</span>
                                                    <span class="text-sm text-gray-600">&nbsp;{material.percentage}%</span>
                                                </div>
                                            {/each}
                                        </div>
                                    {:else}
                                        <p class="font-medium font-mono">N/A</p>
                                    {/if}
                                </div>
                            </div>

                            <!-- PFAS Information -->
                            <div class="flex items-start gap-3">
                                <Zap class="h-5 w-5 text-gray-400 mt-1" />
                                <div>
                                    <p class="text-sm text-gray-600 font-mono">Contains PFAS</p>
                                    <p class="font-medium font-mono">{product.containsPfas ? 'Yes' : 'No'}</p>
                                </div>
                            </div>

                            <!-- Warranty -->
                            <div class="flex items-start gap-3">
                                <Shield class="h-5 w-5 text-gray-400 mt-1" />
                                <div>
                                    <p class="text-sm text-gray-600 font-mono">Warranty</p>
                                    {#if product.warrantyInfo}
                                        <p class="font-medium font-mono">{product.warrantyInfo}</p>
                                    {:else}
                                        <p class="font-medium font-mono">N/A</p>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

                </div>
            </div>



            <Card class="p-6 mb-8">
                <div class="prose prose-gray max-w-none">
                    <p class="text-gray-600 leading-relaxed font-mono">
                        {product.description}
                    </p>
                </div>
            </Card>


            <!-- Community Feedback (Fixed) -->
            <div class="grid md:grid-cols-2 gap-6">
                <Card class="p-6 bg-green-50/50">
                    <div class="flex items-center gap-2 mb-4">
                        <ThumbsUp class="h-5 w-5 text-green-600" />
                        <h3 class="font-medium">What People Like</h3>
                    </div>
                    <ul class="space-y-3">
                        {#if product.likes && product.likes.length > 0}
                            {#each product.likes.split(',').map(item => item.trim()).map(item => item.charAt(0).toUpperCase() + item.slice(1)) as like}
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
                            {#each product.dislikes.split(',').map(item => item.trim()).map(item => item.charAt(0).toUpperCase() + item.slice(1)) as dislike}
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


            

            <!-- Last Updated (Smaller) -->
            <p class="text-xs text-gray-400 font-mono italic text-center mt-16 mb-4">
                Product information last updated: {formatDate(product.updatedAt)}
            </p>
        </div>
        </div>
    </div>
{/if}
