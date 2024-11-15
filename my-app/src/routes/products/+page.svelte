<script lang="ts">
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { ArrowUpDown, ExternalLink, ShoppingCart } from "lucide-svelte";
  import type { PageData } from './$types';

  // In +page.svelte, add this at the top of your script:
  $effect(() => {
    console.log('Props data:', props.data);
    console.log('Sorted products:', sortedProducts);
    console.log('Display products:', displayProducts);
  });


  // Types
  interface Product {
    id: number;
    name: string;
    description: string | null;
    msrp: string | null;
    productLink: string | null;
    affiliateLink: string | null;
    mainCategory: string;
    subCategory: string;
    brandName: string;
    brandWebsite: string | null;
  }

  // Props
  let props = $props<{ data: PageData }>();

  // State
  let searchTerm = $state('');
  let sortField = $state<keyof Product>('name');
  let sortDirection = $state<'asc' | 'desc'>('asc');
  let isLoading = $state(false);
  let error = $state<string | null>(null);

  // Helpers
  const formatCurrency = (amount: string | null) => {
    if (!amount) return 'N/A';
    const numAmount = parseFloat(amount); 
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numAmount);
  };

  // Event handlers
  function toggleSort(field: keyof Product) {
    if (sortField === field) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortField = field;
      sortDirection = 'asc';
    }
  }

  // Computed values
  const sortedProducts = $derived(() => {
    const products = props.data?.products ?? [];
    
    return [...products].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === 'mainCategory') {
        aVal = `${a.mainCategory}-${a.subCategory}`;
        bVal = `${b.mainCategory}-${b.subCategory}`;
      }
      
      if (aVal === null) return 1;
      if (bVal === null) return -1;
      
      return sortDirection === 'asc' 
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  });

  const displayProducts = $derived(() => {
    if (!searchTerm) return sortedProducts;
    
    const searchLower = searchTerm.toLowerCase();
    return sortedProducts.filter(product => 
      product.name.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower) ||
      product.mainCategory.toLowerCase().includes(searchLower) ||
      product.subCategory.toLowerCase().includes(searchLower) ||
      product.brandName.toLowerCase().includes(searchLower)
    );
  });
</script>

<div class="container max-w-[1024px] space-y-12 py-12">
  <div class="space-y-3">
    <h1 class="text-3xl font-bold tracking-tighter md:text-4xl">
      Explore Products
    </h1>
    <p class="text-sm text-muted-foreground font-mono">
      Browse and filter our curated selection of long-lasting products
    </p>
    {#if error}
      <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p>{error}</p>
      </div>
    {/if}
    {#if isLoading}
      <div class="flex justify-center p-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    {:else}
    <div class="flex items-center py-4">
      <Input
        placeholder="Search products..."
        bind:value={searchTerm}
        class="max-w-sm"
      />
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button 
                variant="ghost" 
                on:click={() => toggleSort('name')}
                class="hover:bg-muted"
              >
                Product
                <ArrowUpDown class="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                on:click={() => toggleSort('mainCategory')}
                class="hover:bg-muted"
              >
                Category
                <ArrowUpDown class="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                on:click={() => toggleSort('brandName')}
                class="hover:bg-muted"
              >
                Brand
                <ArrowUpDown class="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                on:click={() => toggleSort('msrp')}
                class="hover:bg-muted"
              >
                Price
                <ArrowUpDown class="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead class="text-right">Links</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {#each displayProducts as product (product.id)}
            <TableRow>
              <TableCell>
                <div>
                  <div class="font-medium">{product.name}</div>
                  {#if product.description}
                    <div class="text-sm text-muted-foreground">{product.description}</div>
                  {/if}
                </div>
              </TableCell>
              <TableCell>
                <div class="text-sm">
                  <div>{product.mainCategory}</div>
                  <div class="text-muted-foreground">{product.subCategory}</div>
                </div>
              </TableCell>
              <TableCell>
                {#if product.brandWebsite}
                  <a 
                    href={product.brandWebsite}
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="hover:underline inline-flex items-center gap-1"
                    aria-label="Visit {product.brandName} website"
                  >
                    {product.brandName}
                    <ExternalLink class="h-4 w-4" />
                  </a>
                {:else}
                  {product.brandName}
                {/if}
              </TableCell>
              <TableCell>
                {#if product.currentPrice && product.currentPrice !== product.msrp}
                  <div class="text-sm">
                    <span class="font-medium">{formatCurrency(product.currentPrice)}</span>
                    <span class="text-muted-foreground line-through ml-2">
                      {formatCurrency(product.msrp)}
                    </span>
                  </div>
                {:else}
                  <span class="font-medium">{formatCurrency(product.msrp)}</span>
                {/if}
              </TableCell>
              <TableCell class="text-right">
                <div class="space-x-2 flex justify-end items-center">
                  {#if product.productLink}
                    <a
                      href={product.productLink}
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                      aria-label="Visit official product page for {product.name}"
                    >
                      Official
                      <ExternalLink class="h-4 w-4" />
                    </a>
                  {/if}
                  {#if product.affiliateLink}
                    <a
                      href={product.affiliateLink}
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="text-green-600 hover:text-green-800 inline-flex items-center gap-1"
                      aria-label="Buy {product.name}"
                    >
                      Buy
                      <ShoppingCart class="h-4 w-4" />
                    </a>
                  {/if}
                </div>
              </TableCell>
            </TableRow>
          {/each}
        </TableBody>
      </Table>
    </div>
    {/if}
  </div>
</div>