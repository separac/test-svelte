
 <script lang="ts">
    import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
    import { Separator } from "$lib/components/ui/separator";
    import { Badge } from "$lib/components/ui/badge";
    import { getCategoryIcon } from '$lib/utils/category-icons';
    import { formatCurrency } from '$lib/utils/format';
    import CountryFlag from "$lib/components/ui/country-flag.svelte";
    
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
    import ChevronRight from '~icons/lucide/chevron-right';
    import ExternalLinkIcon from '~icons/lucide/external-link';

    export let data;
    const { product } = data;

    function formatDate(date: string | null) {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function getDomainFromUrl(url: string | null): string {
        if (!url) return '';
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return '';
        }
    }
</script>

<div class="min-h-screen bg-white font-sans">
    <div class="pt-12 pb-8 bg-gradient-to-b from-gray-50">
        <div class="container max-w-screen-xl mx-auto px-4">
            <!-- Breadcrumb -->
            <div class="flex items-center gap-3 text-sm text-gray-600 mb-8 font-mono">
                <a href="/products" class="hover:text-blue-600">Products</a>
                <ChevronRight class="h-4 w-4" />
                <a href="/brands/{product.brand.id}" class="hover:text-blue-600">{product.brand.name}</a>
                <ChevronRight class="h-4 w-4" />
                <span>{product.name}</span>
            </div>

            <div class="flex flex-col md:flex-row gap-8 md:gap-12">
                <!-- Main Content -->
                <div class="flex-1">
                    <h1 class="text-4xl font-bold mb-4">{product.name}</h1>
                    
                    <!-- Categories -->
                    <div class="flex flex-wrap gap-2 mb-6">
                        {#if product.category?.mainCategory}
                            {@const maybeIcon = getCategoryIcon(product.category.mainCategory, true)}
                            <Badge variant="secondary" class="text-sm">
                                {#if maybeIcon?.icon}
                                    <svelte:component this={maybeIcon.icon} class="h-4 w-4 mr-1" />
                                {/if}
                                {product.category.mainCategory}
                            </Badge>
                        {/if}
                        {#if product.category?.subCategory}
                            {@const maybeIcon = getCategoryIcon(product.category.subCategory, false)}
                            <Badge variant="secondary" class="text-sm">
                                {#if maybeIcon?.icon}
                                    <svelte:component this={maybeIcon.icon} class="h-4 w-4 mr-1" />
                                {/if}
                                {product.category.subCategory}
                            </Badge>
                        {/if}
                    </div>

                    <!-- Price & Stats Grid -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {#if product.msrp}
                            <Card>
                                <CardContent class="pt-6">
                                    <div class="flex items-center gap-2 mb-2">
                                        <TagIcon class="h-4 w-4 text-gray-400" />
                                        <span class="font-mono text-2xl font-bold">{formatCurrency(product.msrp)}</span>
                                    </div>
                                    <span class="text-sm text-gray-600 font-mono">MSRP</span>
                                </CardContent>
                            </Card>
                        {/if}

                        {#if product.currentPrice}
                            <Card>
                                <CardContent class="pt-6">
                                    <div class="flex items-center gap-2 mb-2">
                                        <ShoppingCartIcon class="h-4 w-4 text-gray-400" />
                                        <span class="font-mono text-2xl font-bold">{formatCurrency(product.currentPrice)}</span>
                                    </div>
                                    <span class="text-sm text-gray-600 font-mono">
                                        Current Price
                                        {#if product.priceLastUpdated}
                                            <span class="block text-xs">
                                                Updated: {formatDate(product.priceLastUpdated)}
                                            </span>
                                        {/if}
                                    </span>
                                </CardContent>
                            </Card>
                        {/if}

                        <!-- Social Stats -->
                        <Card>
                            <CardContent class="pt-6">
                                <div class="flex items-center gap-4">
                                    <div class="flex items-center gap-2">
                                        <ThumbsUpIcon class="h-4 w-4 text-green-500" />
                                        <span class="font-mono font-bold">{product.likes}</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <ThumbsDownIcon class="h-4 w-4 text-red-500" />
                                        <span class="font-mono font-bold">{product.dislikes}</span>
                                    </div>
                                </div>
                                <span class="text-sm text-gray-600 font-mono mt-2 block">Community Rating</span>
                            </CardContent>
                        </Card>
                    </div>

                    <!-- Product Details -->
                    <div class="space-y-8">
                        {#if product.description}
                            <div>
                                <h2 class="text-xl font-semibold mb-4">About this Product</h2>
                                <p class="text-gray-600 leading-relaxed">{product.description}</p>
                            </div>
                            <Separator />
                        {/if}

                        <!-- Additional Information -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {#if product.warrantyInfo}
                                <div>
                                    <div class="flex items-center gap-2 mb-2">
                                        <ShieldIcon class="h-4 w-4 text-gray-400" />
                                        <span class="font-medium">Warranty Information</span>
                                    </div>
                                    <p class="text-gray-600">{product.warrantyInfo}</p>
                                </div>
                            {/if}

                            {#if product.countryOfOrigin}
                                <div>
                                    <div class="flex items-center gap-2 mb-2">
                                        <MapPinIcon class="h-4 w-4 text-gray-400" />
                                        <span class="font-medium">Country of Origin</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <CountryFlag country={product.countryOfOrigin} size="sm" />
                                        <span class="text-gray-600">{product.countryOfOrigin}</span>
                                    </div>
                                </div>
                            {/if}

                            {#if product.yearIntroduced}
                                <div>
                                    <div class="flex items-center gap-2 mb-2">
                                        <CalendarIcon class="h-4 w-4 text-gray-400" />
                                        <span class="font-medium">Year Introduced</span>
                                    </div>
                                    <p class="text-gray-600">{product.yearIntroduced}</p>
                                </div>
                            {/if}

                            {#if product.containsPfas !== null}
                                <div>
                                    <div class="flex items-center gap-2 mb-2">
                                        <AlertTriangleIcon class="h-4 w-4 text-gray-400" />
                                        <span class="font-medium">PFAS Content</span>
                                    </div>
                                    <p class="text-gray-600">
                                        {product.containsPfas ? 'Contains PFAS' : 'PFAS-free'}
                                    </p>
                                </div>
                            {/if}
                        </div>

                        {#if product.authorNotes}
                            <Separator />
                            <div>
                                <h2 class="text-xl font-semibold mb-4">Author Notes</h2>
                                <p class="text-gray-600 leading-relaxed">{product.authorNotes}</p>
                            </div>
                        {/if}

                        <!-- External Links -->
                        {#if product.productLink || product.affiliateLink}
                            <Separator />
                            <div>
                                <h2 class="text-xl font-semibold mb-4">External Links</h2>
                                <div class="space-y-3">
                                    {#if product.productLink}
                                        <a 
                                            href={product.productLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                                        >
                                            <GlobeIcon class="h-4 w-4" />
                                            <span>Official Product Page</span>
                                            <span class="text-sm text-gray-400">({getDomainFromUrl(product.productLink)})</span>
                                            <ExternalLinkIcon class="h-4 w-4" />
                                        </a>
                                    {/if}
                                    {#if product.affiliateLink}
                                        <a 
                                            href={product.affiliateLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                                        >
                                            <ShoppingCartIcon class="h-4 w-4" />
                                            <span>Shop Now</span>
                                            <span class="text-sm text-gray-400">({getDomainFromUrl(product.affiliateLink)})</span>
                                            <ExternalLinkIcon class="h-4 w-4" />
                                        </a>
                                    {/if}
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="md:w-80">
                    <Card>
                        <CardHeader>
                            <CardTitle>Brand Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div class="space-y-4">
                                <div>
                                    <h3 class="font-semibold mb-2">{product.brand.name}</h3>
                                    {#if product.brand.website}
                                        <a 
                                            href={product.brand.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                                        >
                                            <GlobeIcon class="h-4 w-4" />
                                            <span>{getDomainFromUrl(product.brand.website)}</span>
                                            <ExternalLinkIcon class="h-4 w-4" />
                                        </a>
                                    {/if}
                                </div>
                                <a 
                                    href="/brands/{product.brand.id}"
                                    class="inline-block px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    View Brand Details
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
</div>