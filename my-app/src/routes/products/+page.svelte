<!-- +page.svelte -->
<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "$lib/components/ui/dropdown-menu";
  import { getCategoryIcon } from '$lib/utils/category-icons';
  import { formatCurrency } from '$lib/utils/format';
  import { browser } from '$app/environment';

  // Switch to unplugin-icons
  import ArrowUpDownIcon from '~icons/mdi/arrow-up-down';
  import ChevronDownIcon from '~icons/mdi/chevron-down';
  import EyeIcon from '~icons/mdi/eye';
  import EyeOffIcon from '~icons/mdi/eye-off';
  import RefreshIcon from '~icons/mdi/refresh';
  import ExternalLinkIcon from '~icons/mdi/open-in-new';
  import ShoppingIcon from '~icons/mdi/shopping';

  let { data } = $props<{ data: PageData }>();

  let columns = $state<ColumnDef[]>([
    { key: 'name', label: 'Product', visible: true, sortable: true },
    { key: 'mainCategory', label: 'Category', visible: true, sortable: true },
    { key: 'brandName', label: 'Brand', visible: true, sortable: true },
    { key: 'msrp', label: 'MSRP', visible: true, sortable: true }
  ]);

  let searchTerm = $state($page.url.searchParams.get('search') || '');

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

  // Reset function
  function resetAll() {
    searchTerm = '';
    pagination.page = 1;
    pagination.pageSize = 10;
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
      
      // Update URL and trigger navigation
      const params = new URLSearchParams(window.location.search);
      params.set('search', value);
      params.set('page', '1');
      goto(`?${params.toString()}`, { keepFocus: true });
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
                <ArrowUpDownIcon 
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
        <TableHead class="text-right">
          <span class="text-sm font-medium">Links</span>
        </TableHead>
      </TableRow>
    </TableHeader>

    <TableBody>
      {#each data.products as product (product.id)}
        <TableRow>
          {#each columns as column}
            {#if column.visible}
              <TableCell>
                {#if column.key === 'mainCategory'}
                  <div class="space-y-0.5 max-w-[250px]">
                    <div class="text-sm text-gray-500">
                      {product.mainCategory}
                    </div>
                    {#if product.subCategory}
                      {@const maybeIcon = getCategoryIcon(product.subCategory, false)}
                      <div class="flex items-center gap-1.5 text-sm">
                        {#if maybeIcon}
                          <div class="text-gray-600">
                            <svelte:component this={maybeIcon.icon} size={16} />
                          </div>
                        {/if}
                        <span class="text-gray-900">
                          {product.subCategory}
                        </span>
                      </div>
                    {/if}
                  </div>
                {:else if column.key === 'name'}
                  <div>
                    <div class="font-medium">{product.name}</div>
                    {#if product.description}
                      <div class="text-sm text-muted-foreground">{product.description}</div>
                    {/if}
                  </div>
                {:else if column.key === 'msrp'}
                  <div class="text-right">
                    {formatCurrency(product.msrp)}
                  </div>
                {:else}
                  {product[column.key]}
                {/if}
              </TableCell>
            {/if}
          {/each}
          <TableCell class="text-right">
            <div class="flex justify-end items-center">
              {#if product.productLink}
                <a
                  href={product.productLink}
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted"
                >
                  <ShoppingIcon class="h-4 w-4 text-gray-600" />
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
                  <ExternalLinkIcon class="h-4 w-4" />
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