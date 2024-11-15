<script lang="ts">
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { ArrowUpDown, ExternalLink } from "lucide-svelte";
  import type { PageData, Product } from './types';

  // Props
  export let data: PageData;

  // State Variables
  let displayProducts: Product[] = data.products;
  let searchTerm = '';
  let sortField: keyof Product = 'name';
  let sortDirection: 'asc' | 'desc' = 'asc';
  let isLoading = false;
  let error: string | null = null;

  // Reactive Sorted Products
  $: sortedProducts = (() => {
    let filtered = displayProducts;

    // Apply Search Filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) ||
        (product.description && product.description.toLowerCase().includes(term))
      );
    }

    // Sort the Filtered Products
    return [...filtered].sort((a, b) => {
      const aVal = a[sortField] ?? '';
      const bVal = b[sortField] ?? '';

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal); 
      }

      return 0;
    });
  })();

  // Toggle Sort Field and Direction
  function toggleSort(field: keyof Product) {
    if (sortField === field) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortField = field;
      sortDirection = 'asc';
    }
  }

  // Helper Function to Format Currency
  function formatCurrency(amount: string | null): string {
    if (!amount) return 'N/A';
    const num = parseFloat(amount);
    if (isNaN(num)) return 'N/A';
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  // Debugging
  // $: console.log('Display Products:', displayProducts);
  // $: console.log('Sorted Products:', sortedProducts);
  
</script>

<!-- Debug Info Display 
<div class="bg-gray-100 p-4 mt-4 rounded">
  <h3 class="font-bold">Debug Info:</h3>
  <pre class="whitespace-pre-wrap overflow-x-auto">
Display Products: {JSON.stringify(displayProducts, null, 2)}
Sorted Products: {JSON.stringify(sortedProducts, null, 2)}
  </pre>
</div>
-->

<!-- Main Content -->
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

      <Table>
        <TableHeader>
          <TableRow>
            <!-- Product Name Column -->
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

            <!-- Category Column -->
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

            <!-- Brand Column -->
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

            <!-- Price Column -->
            <TableHead>
              <Button 
                variant="ghost" 
                on:click={() => toggleSort('msrp')}
                class="hover:bg-muted"
              >
                MSRP
                <ArrowUpDown class="ml-2 h-4 w-4" />
              </Button>
            </TableHead>

            <!-- Links Column -->
            <TableHead class="text-right">Links</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {#if sortedProducts.length === 0}
            <TableRow>
              <TableCell colspan="5">No products found</TableCell>
            </TableRow>
          {:else}
            {#each sortedProducts as product (product.id)}
              <TableRow>
                <!-- Product Name and Description -->
                <TableCell>
                  <div>
                    <div class="font-medium">{product.name}</div>
                    {#if product.description}
                      <div class="text-sm text-muted-foreground">{product.description}</div>
                    {/if}
                  </div>
                </TableCell>

                <!-- Category -->
                <TableCell>
                  <div class="text-sm">
                    <div>{product.mainCategory}</div>
                    <div class="text-muted-foreground">{product.subCategory}</div>
                  </div>
                </TableCell>

                <!-- Brand -->
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

                <!-- Price -->
                <TableCell>
                  {#if product.msrp}
                    <span class="font-medium">{formatCurrency(product.msrp)}</span>
                  {:else}
                    <span class="font-medium">N/A</span>
                  {/if}
                </TableCell>

                <!-- Links -->
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
                        aria-label="Visit affiliate product page for {product.name}"
                      >
                        Affiliate
                        <ExternalLink class="h-4 w-4" />
                      </a>
                    {/if}
                  </div>
                </TableCell>
              </TableRow>
            {/each}
          {/if}
        </TableBody>
      </Table>
    {/if}
  </div>
</div>