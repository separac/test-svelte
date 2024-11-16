<!-- +page.svelte -->
<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "$lib/components/ui/dropdown-menu";
  import * as Select from "$lib/components/ui/select";  
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
  let currentValue = $state("10");
  
  // Updated script section
  let pagination = $state<PaginationState>({
    page: Number($page.url.searchParams.get('page')) || 1,
    pageSize: Number($page.url.searchParams.get('pageSize')) || 10 // Default page size 10
  });

  let sort = $state<SortState>({
    field: ($page.url.searchParams.get('sortField') as keyof Product) || 'name',
    direction: ($page.url.searchParams.get('sortDirection') as 'asc' | 'desc') || 'asc'
  });

  // Page size options
  const pageSizeOptions = [
    { value: '10', label: '10 per page' },
    { value: '20', label: '20 per page' },
    { value: '50', label: '50 per page' },
    { value: 'all', label: 'Show all' }
  ] as const;

  function changePage(newPage: number) {
    if (newPage >= 1 && newPage <= totalPages) {
      pagination.page = newPage;
    }
  }

  // Derived values
  let totalPages = $derived(Math.ceil(data.total / pagination.pageSize));
  let startIndex = $derived((pagination.page - 1) * pagination.pageSize + 1);
  let endIndex = $derived(Math.min(pagination.page * pagination.pageSize, data.total));
  
  // Function to generate page numbers array
  function getPageNumbers(currentPage: number, totalPages: number): (number | '...')[] {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | '...')[] = [];
    let l: number | undefined;

    range.push(1);

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i < totalPages && i > 1) {
        range.push(i);
      }
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }

  let pageNumbers = $derived(getPageNumbers(pagination.page, totalPages));
  
  // Updated handler function
  function handlePageSizeChange(selectedValue: string) {
    const newSize = selectedValue === 'all' ? data.total : parseInt(selectedValue);
    pagination.pageSize = newSize;
    pagination.page = 1; // Reset to first page when changing page size
  }
  // URL update effect
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
  <div class="flex items-center gap-4">
    <div class="text-sm text-muted-foreground">
      Showing {endIndex} of {data.total} products
    </div>
    <select 
    class="h-10 w-[160px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background 
    focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
    disabled:cursor-not-allowed disabled:opacity-50"
      value={pagination.pageSize}
      onchange={(e) => {
        const newValue = e.currentTarget.value === 'all' 
          ? data.total 
          : parseInt(e.currentTarget.value);
        pagination.pageSize = newValue;
        pagination.page = 1;
      }}
    >
      <option value="10">10 per page</option>
      <option value="20">20 per page</option>
      <option value="50">50 per page</option>
      <option value="100">100 per page</option>
      <option value="all">Show all</option>
    </select>
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
                  <span class="font-medium text-right block">{formatCurrency(product.msrp)}</span>
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
    <!--
    <div class="flex items-center gap-4">
      <div class="text-sm text-muted-foreground">
        Showing {endIndex} of {data.total} products
      </div>
      <Select.Root 
        type="single" 
        value="10"
        onValueChange={(value) => {
          const newValue = value === 'all' ? data.total : parseInt(value);
          pagination.pageSize = newValue;
          pagination.page = 1;
        }}
      >
      <Select.Trigger class="w-[180px]">
        <Select.Value placeholder="10 per page"/>
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="10">10 per page</Select.Item>
        <Select.Item value="20">20 per page</Select.Item>
        <Select.Item value="50">50 per page</Select.Item>
        <Select.Item value="100">100 per page</Select.Item>
        <Select.Item value="all">Show all</Select.Item>
      </Select.Content>
      </Select.Root>
    </div> -->
   
    <div class="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={pagination.page === 1}
        onclick={() => changePage(pagination.page - 1)}
      >
        Previous
      </Button>

      {#each pageNumbers as pageNum}
        {#if pageNum === '...'}
          <span class="px-2">...</span>
        {:else if typeof pageNum === 'number'}
          <Button
            variant={pageNum === pagination.page ? 'default' : 'outline'}
            size="sm"
            onclick={() => changePage(pageNum)}
          >
            {pageNum}
          </Button>
        {/if}
      {/each}

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