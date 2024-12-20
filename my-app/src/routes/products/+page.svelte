<!-- +page.svelte -->
<script lang="ts">
  import type { Product, PageData, ColumnDef, PaginationState, SortState } from '$lib/types';
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
  import { Input } from "$lib/components/ui/input";
  import * as Popover from "$lib/components/ui/popover";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "$lib/components/ui/dropdown-menu";
  import { getCategoryIcon } from '$lib/utils/category-icons';
  import { formatCurrency } from '$lib/utils/format';
  import { browser } from '$app/environment';
  // import FilterMenu from "$lib/components/filterMenu.svelte";
  import TableFilter from "$lib/components/table-filter.svelte";


  // Switch to unplugin-icons
  import ArrowUpDownIcon from '~icons/mdi/arrow-up-down';
  import FilterIcon from '~icons/mdi/filter';
  import ChevronDownIcon from '~icons/mdi/chevron-down';
  import EyeIcon from '~icons/mdi/eye';
  import EyeOffIcon from '~icons/mdi/eye-off';
  import RefreshIcon from '~icons/mdi/refresh';
  import Box from '~icons/mdi/box';  // Default icon as fallback

  let { data } = $props<{ data: PageData }>();


  let columns = $state<Array<ColumnDef & { key: keyof Product }>>([
  { 
    key: 'name', 
    label: 'Product', 
    visible: true, 
    sortable: true,
    filterable: true,
    filterType: 'product'
  },
  { 
    key: 'description', 
    label: 'Description', 
    visible: true, 
    sortable: true,
    filterable: true,
    filterType: 'product'
  },
  { 
    key: 'categoryMain', 
    label: 'Category', 
    visible: true, 
    sortable: true, 
    filterable: true,
    filterType: 'category'
  },
  { 
    key: 'brandName', 
    label: 'Brand', 
    visible: true, 
    sortable: true, 
    filterable: true,
    filterType: 'brand'
  },
  { 
    key: 'msrp', 
    label: 'MSRP', 
    visible: true, 
    sortable: true, 
    filterable: true,
    filterType: 'price'
  }
]);

// Add this to track active filters
let activeFilters = $state<Record<string, string[]>>({});

// Update filterHandler
function handleFilter(column: keyof Product, values: string[]) {
  activeFilters[column] = values;
  pagination.page = 1; // Reset to first page when filtering
  
  const params = new URLSearchParams($page.url.searchParams);
  if (values.length) {
    params.set(`filter_${column}`, values.join(','));
  } else {
    params.delete(`filter_${column}`);
  }
  goto(`?${params.toString()}`, { keepFocus: true });
}

  let searchTerm = $state($page.url.searchParams.get('search') || '');

  let pagination = $state<PaginationState>({
    page: Number($page.url.searchParams.get('page')) || 1,
    pageSize: Number($page.url.searchParams.get('pageSize')) || 20 // Default page size 20
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
      updateURL();
    }
  }

  function updateURL() {
    const params = new URLSearchParams($page.url.searchParams);
    params.set('page', pagination.page.toString());
    params.set('pageSize', pagination.pageSize.toString());
    params.set('sortField', sort.field);
    params.set('sortDirection', sort.direction);
    goto(`?${params.toString()}`, { keepFocus: true });
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
    updateURL();
  }
  // URL update effect
  $effect(() => {
    updateURL();
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
    updateURL();
  }

  // Reset function
  function resetAll() {
    searchTerm = '';
    pagination.page = 1;
    pagination.pageSize = 20;
    sort.field = 'name';
    sort.direction = 'asc';
    columns.forEach(col => col.visible = true);
    goto('?', { keepFocus: true });
  }

  // Add debounce utility
  function debounce<T extends (...args: any[]) => any>(
    fn: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: Parameters<T>) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // Debounced search handler
  const handleSearch = debounce((value: string) => {
    if (browser) {
      searchTerm = value;
      pagination.page = 1; // Reset to first page on search
      updateURL();
    }
  }, 300);

  // Update URL effect
  $effect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    params.set('page', pagination.page.toString());
    params.set('pageSize', pagination.pageSize.toString());
    params.set('sortField', sort.field);
    params.set('sortDirection', sort.direction);
    goto(`?${params.toString()}`, { keepFocus: true });
  });

  function handleProductClick(productId: number) {
    goto(`/products/${productId}`);
  }


// Add this debug log
  $effect(() => {
    console.log('Filter Options:', data.filterOptions);
  });
</script>

<div class="container max-w-screen-xl space-y-8 py-8 relative z-[1]">
  <div class="space-y-3">
    <h1 class="text-3xl font-bold font-mono md:text-4xl">Explore Products</h1>
    <p class="text-m text-muted-foreground font-mono">
      Browse and filter our curated selection of buy it for life products
    </p>
  </div>

  <!-- Toolbar -->
  <div class="flex items-center justify-between gap-4">
    <div class="flex items-center gap-2 flex-1">
      <Input
        placeholder="Search products..."
        value={searchTerm}
        on:input={(e) => handleSearch(e.currentTarget.value)}
        class="max-w-xs"
      />
      <Button 
        variant="outline" 
        onclick={resetAll}
        class="shrink-0 gap-2"
      >
        <RefreshIcon class="h-4 w-4" />
        Reset Filters
      </Button>
    </div>

    <!-- Column Visibility Dropdown -->
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
        >
          Columns
          <ChevronDownIcon class="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {#each columns as column}
          <DropdownMenuItem onclick={() => toggleColumn(column.key)}>
            {#if column.visible}
              <EyeIcon class="mr-2 h-4 w-4" />
            {:else}
              <EyeOffIcon class="mr-2 h-4 w-4" />
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
        updateURL();
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
  <Table class="relative z-[1]">
  <TableHeader>
    <!-- Column Headers -->
    <TableRow>
      {#each columns as column}
        {#if column.visible}
          <TableHead>
            <div class="flex flex-col gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onclick={() => column.sortable && toggleSort(column.key)}
                class="hover:bg-muted flex items-center gap-2"
              >
                {column.label}
                {#if column.sortable}
                  <ArrowUpDownIcon class="ml-2 h-4 w-4 transition-transform {
                    sort.field === column.key ? sort.direction === 'desc' ? 'rotate-180' : '' : ''
                  }" />
                {/if}
              </Button>
              {#if column.filterable && data.filterOptions}
                <TableFilter 
                  {column} 
                  filterOptions={data.filterOptions} 
                  activeFilters={activeFilters[column.key] || []}
                  onFilterChange={(values) => handleFilter(column.key, values)}
                />
              {/if}
            </div>
          </TableHead>
        {/if}
      {/each}
    </TableRow>
  </TableHeader>

  <TableBody>
    {#each data.products as product (product.id)}
      <TableRow>
        {#each columns as column}
          {#if column.visible}
            <TableCell>
              {#if column.key === 'msrp'}
                {formatCurrency(product[column.key])}
              {:else if column.key === 'categoryMain'}
                <div class="flex flex-col">
                  <!-- Main category with icon -->
                  <div class="flex items-center gap-1 text-sm text-muted-foreground">
                    <svelte:component
                      this={getCategoryIcon(product.categoryMain, true)?.icon || Box}
                      class="w-4 h-4"
                    />
                    <span>{product.categoryMain}</span>
                  </div>

                  {#if product.categorySub}
                    <!-- Sub category with icon (indented) -->
                    <div class="flex items-center gap-1 pl-4 text-sm">
                      <span>↳</span>
                      <svelte:component
                        this={getCategoryIcon(product.categorySub, false)?.icon || Box}
                        class="w-4 h-4"
                      />
                      <span>{product.categorySub}</span>
                    </div>
                  {/if}
                </div>
              {:else}
                {product[column.key]}
              {/if}
            </TableCell>
          {/if}
        {/each}
      </TableRow>
    {/each}
  </TableBody>
</Table>

  <!-- Pagination -->
  <div class="flex items-center justify-between">
   
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