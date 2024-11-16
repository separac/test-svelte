<!-- +page.svelte -->
<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "$lib/components/ui/dropdown-menu";
  import { ArrowUpDown, ChevronDown, ExternalLink, Eye, EyeOff } from "lucide-svelte";
  import type { PageData, Product, SortState, ColumnDef, PaginationState } from './types';

  let { data } = $props<{ data: PageData }>();

  let columns = $state<ColumnDef[]>([
    { key: 'name', label: 'Product', visible: true },
    { key: 'mainCategory', label: 'Category', visible: true },
    { key: 'brandName', label: 'Brand', visible: true },
    { key: 'msrp', label: 'MSRP', visible: true }
  ]);

  let searchTerm = $state('');
  
  let pagination = $state<PaginationState>({
    page: parseInt($page.url.searchParams.get('page') || '1'),
    pageSize: parseInt($page.url.searchParams.get('pageSize') || '10')
  });

  let sort = $state<SortState>({
    field: ($page.url.searchParams.get('sortField') as keyof Product) || 'name',
    direction: ($page.url.searchParams.get('sortDirection') as 'asc' | 'desc') || 'asc'
  });

  let totalPages = $derived(Math.ceil(data.total / pagination.pageSize));
  let startIndex = $derived((pagination.page - 1) * pagination.pageSize + 1);
  let endIndex = $derived(Math.min(pagination.page * pagination.pageSize, data.total));

  $effect(() => {
    const params = new URLSearchParams($page.url.searchParams);
    params.set('page', pagination.page.toString());
    params.set('pageSize', pagination.pageSize.toString());
    params.set('sortField', sort.field);
    params.set('sortDirection', sort.direction);
    goto(`?${params.toString()}`, { keepFocus: true });
  });

  function toggleColumn(key: keyof Product) {
    const index = columns.findIndex(col => col.key === key);
    if (index !== -1) {
      columns[index].visible = !columns[index].visible;
    }
  }

  function toggleSort(field: keyof Product) {
    if (sort.field === field) {
      sort.direction = sort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      sort.field = field;
      sort.direction = 'asc';
    }
  }

  function changePage(newPage: number) {
    if (newPage >= 1 && newPage <= totalPages) {
      pagination.page = newPage;
    }
  }

  function formatCurrency(amount: number | null): string {
    if (amount === null) return 'N/A';
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }
</script>

<div class="container max-w-[1024px] space-y-6 py-8">
  <div class="space-y-3">
    <h1 class="text-3xl font-bold tracking-tighter md:text-4xl">Explore Products</h1>
    <p class="text-sm text-muted-foreground font-mono">
      Browse and filter our curated selection of long-lasting products
    </p>
  </div>

  <!-- Toolbar -->
  <div class="flex items-center justify-between gap-4">
    <Input
      placeholder="Search products..."
      bind:value={searchTerm}
      class="max-w-xs"
    />

    <!-- Column Visibility Dropdown -->
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
        >
          Columns
          <ChevronDown class="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {#each columns as column}
          <DropdownMenuItem onclick={() => toggleColumn(column.key)}>
            {#if column.visible}
              <Eye class="mr-2 h-4 w-4" />
            {:else}
              <EyeOff class="mr-2 h-4 w-4" />
            {/if}
            {column.label}
          </DropdownMenuItem>
        {/each}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>

  <!-- Table -->
  <Table>
    <TableHeader>
      <TableRow>
        {#each columns as column}
          {#if column.visible}
            <TableHead>
              <Button 
                variant="ghost" 
                size="sm"
                onclick={() => toggleSort(column.key)}
                class="hover:bg-muted flex items-center gap-2"
              >
                {column.label}
                <ArrowUpDown 
                  class={`ml-2 h-4 w-4 transition-transform ${
                    sort.field === column.key 
                      ? sort.direction === 'desc' 
                        ? 'rotate-180' 
                        : ''
                      : ''
                  }`}
                />
              </Button>
            </TableHead>
          {/if}
        {/each}
        <TableHead class="text-right">Links</TableHead>
      </TableRow>
    </TableHeader>

    <TableBody>
      {#each data.products as product (product.id)}
        <TableRow>
          {#each columns as column}
            {#if column.visible}
              <TableCell>
                {#if column.key === 'name'}
                  <div>
                    <div class="font-medium">{product.name}</div>
                    {#if product.description}
                      <div class="text-sm text-muted-foreground">{product.description}</div>
                    {/if}
                  </div>
                {:else if column.key === 'mainCategory'}
                  <div class="text-sm">
                    <div>{product.mainCategory}</div>
                    <div class="text-muted-foreground">{product.subCategory}</div>
                  </div>
                {:else if column.key === 'brandName'}
                  {#if product.brandWebsite}
                    <a 
                      href={product.brandWebsite}
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="hover:underline inline-flex items-center gap-1"
                    >
                      {product.brandName}
                      <ExternalLink class="h-4 w-4" />
                    </a>
                  {:else}
                    {product.brandName}
                  {/if}
                {:else if column.key === 'msrp'}
                  <span class="font-medium">{formatCurrency(product.msrp)}</span>
                {:else}
                  {product[column.key]}
                {/if}
              </TableCell>
            {/if}
          {/each}
          <TableCell class="text-right">
            <div class="space-x-2 flex justify-end items-center">
              {#if product.productLink}
                <a
                  href={product.productLink}
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
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
                >
                  Affiliate
                  <ExternalLink class="h-4 w-4" />
                </a>
              {/if}
            </div>
          </TableCell>
        </TableRow>
      {/each}
    </TableBody>
  </Table>

  <!-- Pagination -->
  <div class="flex items-center justify-between">
    <div class="text-sm text-muted-foreground">
      Showing {startIndex} to {endIndex} of {data.total} products
    </div>
    <div class="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={pagination.page === 1}
        onclick={() => changePage(pagination.page - 1)}
      >
        Previous
      </Button>
      <span class="text-sm font-medium">
        Page {pagination.page} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={pagination.page === totalPages}
        onclick={() => changePage(pagination.page + 1)}
      >
        Next
      </Button>
    </div>
  </div>
</div>