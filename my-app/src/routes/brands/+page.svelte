<!-- src/routes/brands/+page.svelte -->
<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
	import { Input } from "$lib/components/ui/input";
	import { Button } from "$lib/components/ui/button";
	import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "$lib/components/ui/dropdown-menu";
	import type { PageData, Brand, SortState, ColumnDef, PaginationState } from './types';
	import { getCategoryIcon } from '$lib/utils/category-icons';
	import FeaturedBrands from "$lib/components/featured-brands.svelte";
  
	// Icon imports
	import ArrowUpDownIcon from '~icons/mdi/arrow-up-down';
	import ChevronDownIcon from '~icons/mdi/chevron-down';
	import EyeIcon from '~icons/mdi/eye';
	import EyeOffIcon from '~icons/mdi/eye-off';
	import RefreshIcon from '~icons/mdi/refresh';
	import GlobeIcon from '~icons/mdi/web';
  
	let { data } = $props<{ data: PageData }>();
  
	// Helper function for generating consistent colors based on category
	function getColorForCategory(category: string | null): string {
	  const colors = [
		'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 
		'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 
		'fuchsia', 'pink', 'rose'
	  ];
	  
	  if (!category) return 'gray';
	  
	  const index = Array.from(category.toLowerCase())
		.reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
	  
	  return colors[index];
	}
  
	let carouselBrands = $derived(data.featuredBrands.slice(0, 3).map(brand => ({
	  id: brand.id,
	  name: brand.brandName,
	  category: brand.mainCategory || '',
	  website: brand.brandWebsite?.replace(/^https?:\/\/(www\.)?/, '') || '',
	  description: brand.brandDescription,
	  logo: {
		type: 'wordmark' as const,
		backgroundColor: `bg-${getColorForCategory(brand.mainCategory)}-50`
	  }
	})));
  
	let columns = $state([
	  { key: 'brandName', label: 'Brand', visible: true, sortable: true },
	  { key: 'mainCategory', label: 'Category', visible: true, sortable: true },
	  { key: 'subCategory', label: 'Products', visible: true, sortable: true },
	  { key: 'brandDescription', label: 'Description', visible: true, sortable: false }
	]);
  
	let searchTerm = $state($page.url.searchParams.get('search') || '');
	
	let pagination = $state({
	  page: Number($page.url.searchParams.get('page')) || 1,
	  pageSize: Number($page.url.searchParams.get('pageSize')) || 10
	});
  
	let sort = $state({
	  field: ($page.url.searchParams.get('sortField') as keyof Brand) || 'brandName',
	  direction: ($page.url.searchParams.get('sortDirection') as 'asc' | 'desc') || 'asc'
	});
  
	let totalPages = $derived(Math.ceil(data.total / pagination.pageSize));
	let startIndex = $derived((pagination.page - 1) * pagination.pageSize + 1);
	let endIndex = $derived(Math.min(pagination.page * pagination.pageSize, data.total));
	let pageNumbers = $derived(getPageNumbers(pagination.page, totalPages));
  
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
  
	$effect(() => {
	  const params = new URLSearchParams();
	  params.set('page', pagination.page.toString());
	  params.set('pageSize', pagination.pageSize.toString());
	  params.set('sortField', sort.field);
	  params.set('sortDirection', sort.direction);
	  if (searchTerm) params.set('search', searchTerm);
	  goto(`?${params.toString()}`, { keepFocus: true });
	});
  
	function resetAll() {
	  searchTerm = '';
	  pagination.page = 1;
	  pagination.pageSize = 10;
	  sort.field = 'brandName';
	  sort.direction = 'asc';
	  columns.forEach(col => col.visible = true);
	  goto('?', { keepFocus: true });
	}
  
	function changePage(newPage: number) {
	  if (newPage >= 1 && newPage <= totalPages) {
		pagination.page = newPage;
	  }
	}
  
	function toggleColumn(key: keyof Brand) {
	  const index = columns.findIndex(col => col.key === key);
	  if (index !== -1) {
		columns[index].visible = !columns[index].visible;
	  }
	}
  
	function toggleSort(field: keyof Brand) {
	  if (sort.field === field) {
		sort.direction = sort.direction === 'asc' ? 'desc' : 'asc';
	  } else {
		sort.field = field;
		sort.direction = 'asc';
	  }
	}
  </script>
  
  <!-- Featured Brands Section -->
  <FeaturedBrands allBrands={carouselBrands} />
  
  <!-- Brands Table Section -->
  <div class="container max-w-screen-xl space-y-8 py-8">
	<div class="space-y-3">
	  <h2 class="text-2xl font-bold tracking-tighter md:text-3xl">All Brands</h2>
	  <p class="text-sm text-muted-foreground font-mono">
		Browse and filter our complete brand collection
	  </p>
	</div>
  
	<!-- Toolbar -->
	<div class="flex items-center justify-between gap-4">
	  <div class="flex items-center gap-2 flex-1">
		<Input
		  placeholder="Search brands..."
		  bind:value={searchTerm}
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
		<DropdownMenuTrigger>
		  <Button 
			variant="outline" 
			size="sm"
			class="ml-auto"
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
		Showing {endIndex} of {data.total} brands
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
				  onclick={() => column.sortable && toggleSort(column.key)}
				  class="hover:bg-muted flex items-center gap-2"
				>
				  {column.label}
				  {#if column.sortable}
					<ArrowUpDownIcon 
					  class={`ml-2 h-4 w-4 transition-transform ${
						sort.field === column.key 
						  ? sort.direction === 'desc' 
							? 'rotate-180' 
							: ''
						  : ''
					  }`}
					/>
				  {/if}
				</Button>
			  </TableHead>
			{/if}
		  {/each}
		  <TableHead class="w-[50px]">
			<span class="text-sm font-medium">Link</span>
		  </TableHead>
		</TableRow>
	  </TableHeader>
  
	  <TableBody>
		{#each data.brands as brand (brand.id)}
		  <TableRow>
			{#each columns as column}
			  {#if column.visible}
				<TableCell>
				  {#if column.key === 'brandName'}
					<div>
					  <div class="font-medium">{brand.brandName}</div>
					</div>
				  {:else if column.key === 'mainCategory'}
					<div class="text-sm flex items-center gap-2">
					  {#if brand.mainCategory}
						{@const maybeIcon = getCategoryIcon(brand.mainCategory, true)}
						{#if maybeIcon}
							<div class={maybeIcon.color}>
								{#if maybeIcon.icon}
								<maybeIcon.icon size={16} />
								{/if}
						  	</div>
						{/if}
					  {/if}
					  <div>{brand.mainCategory}</div>
					</div>
				  {:else if column.key === 'subCategory'}
					<div class="text-sm flex items-center gap-2">
					  {#if brand.subCategory}
						{@const maybeIcon = getCategoryIcon(brand.subCategory, false)}
						{#if maybeIcon}
						<div class={maybeIcon.color}>
							{#if maybeIcon.icon}
							  <maybeIcon.icon size={16} />
							{/if}
						  </div>
						{/if}
					  {/if}
					  <div>{brand.subCategory}</div>
					</div>
				  {:else if column.key === 'brandDescription'}
					<div class="text-sm text-muted-foreground">{brand.brandDescription}</div>
				  {:else}
					{brand[column.key]}
				  {/if}
				</TableCell>
			  {/if}
			{/each}
			<TableCell class="w-[50px]">
			  {#if brand.brandWebsite}
				<a
				  href={brand.brandWebsite}
				  target="_blank" 
				  rel="noopener noreferrer"
				  class="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted"
				  title="Visit website"
				>
				  <GlobeIcon class="h-4 w-4" />
				</a>
			  {/if}
			</TableCell>
		  </TableRow>
		{/each}
	  </TableBody>
	</Table>
  
	<!-- Pagination -->
	<div class="flex items-center justify-end">
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