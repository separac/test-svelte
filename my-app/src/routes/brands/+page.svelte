<!-- +page.svelte -->
<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
	import { Input } from "$lib/components/ui/input";
	import { Button } from "$lib/components/ui/button";
	import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "$lib/components/ui/dropdown-menu";
	import { ArrowUpDown, ChevronDown, ExternalLink, Eye, EyeOff } from "lucide-svelte";
	import type { PageData, Brand, SortState, ColumnDef, PaginationState } from './types';
  
	let { data } = $props<{ data: PageData }>();
  
	let columns = $state<ColumnDef[]>([
	  { key: 'brandName', label: 'Brand', visible: true },
	  { key: 'mainCategory', label: 'Category', visible: true },
	  { key: 'subCategory', label: 'Products', visible: true },
	  { key: 'brandDescription', label: 'Description', visible: true }
	]);
  
	let searchTerm = $state('');
	
	let pagination = $state<PaginationState>({
	  page: Number($page.url.searchParams.get('page')) || 1,
	  pageSize: Number($page.url.searchParams.get('pageSize')) || 10
	});
  
	let sort = $state<SortState>({
	  field: ($page.url.searchParams.get('sortField') as keyof Brand) || 'brandName',
	  direction: ($page.url.searchParams.get('sortDirection') as 'asc' | 'desc') || 'asc'
	});
  
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
  
	// URL update effect
	$effect(() => {
	  const params = new URLSearchParams($page.url.searchParams);
	  params.set('page', pagination.page.toString());
	  params.set('pageSize', pagination.pageSize.toString());
	  params.set('sortField', sort.field);
	  params.set('sortDirection', sort.direction);
	  goto(`?${params.toString()}`, { keepFocus: true });
	});
  
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
  
  <div class="container max-w-[1024px] space-y-6 py-8">
	<div class="space-y-3">
	  <h1 class="text-3xl font-bold tracking-tighter md:text-4xl">Explore Brands</h1>
	  <p class="text-sm text-muted-foreground font-mono">
		Browse our curated selection of buy it for life brands
	  </p>
	</div>
  
	<!-- Toolbar -->
	<div class="flex items-center justify-between gap-4">
	  <Input
		placeholder="Search brands..."
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
		  <TableHead class="text-right">Website</TableHead>
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
					<div class="text-sm">
					  <div>{brand.mainCategory}</div>
					</div>
				  {:else if column.key === 'subCategory'}
					<div class="text-sm">
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
			<TableCell class="text-right">
			  {#if brand.brandWebsite}
				<a
				  href={brand.brandWebsite}
				  target="_blank" 
				  rel="noopener noreferrer"
				  class="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
				>
				  Visit Site
				  <ExternalLink class="h-4 w-4" />
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