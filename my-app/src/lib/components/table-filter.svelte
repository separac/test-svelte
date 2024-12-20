<script lang="ts">
  import type { FilterItem, ColumnDef, FilterOptions, CategoryFilter } from '$lib/types';
  import * as Popover from '$lib/components/ui/popover';
  import * as Command from '$lib/components/ui/command';
  import { Button } from '$lib/components/ui/button';
  import CheckIcon from '~icons/lucide/check';
  import ChevronDownIcon from '~icons/lucide/chevron-down';
  import ChevronRightIcon from '~icons/lucide/chevron-right';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { tick } from 'svelte';

  // Use $props to declare props in Svelte 5
  let { column, filterOptions } = $props<{
    column: ColumnDef;
    filterOptions: FilterOptions;
  }>();

  $effect(() => {
  console.log('Props loaded:', {
    column,
    filterOptions,
    filterType: column?.filterType
  });
});

  let open = $state(false);
  let searchTerm = $state('');
  let items = $state([]);
  let expandedCategories = $state<string[]>([]);
  let triggerRef = $state<HTMLButtonElement | null>(null);
  let selectedValues = $state<string[]>(
    ($page.url.searchParams.get(`filter_${column.key}`)?.split(',') || []).filter(Boolean)
  );

  // Sort items alphabetically with numbers first
  function sortAlphaNumeric(a: string, b: string): number {
    // Custom sorting logic
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  }

  
 // Remove existing filteredItems and replace with:
 let filteredItems = $derived(() => {
    // Early return if we don't have the required data
    if (!column?.filterType || !filterOptions) {
      console.log('Missing required data:', { column, filterOptions });
      return [];
    }

    // Filter items based on search term if it exists
    const searchFilter = (item: string) => 
      !searchTerm || item.toLowerCase().includes(searchTerm.toLowerCase());

    switch (column.filterType) {
      case 'category': {
        if (!Array.isArray(filterOptions.categories)) return [];
        
        return filterOptions.categories
          .filter(category => 
            searchFilter(category.mainCategory) || 
            category.subCategories.some(sub => searchFilter(sub))
          )
          .map(category => ({
            mainCategory: category.mainCategory,
            subCategories: category.subCategories.filter(searchFilter)
          }));
      }

      case 'price': {
        if (!Array.isArray(filterOptions.priceRanges)) return [];
        
        return filterOptions.priceRanges
          .filter(range => searchFilter(range.label))
          .map(range => ({
            mainCategory: range.label,
            subCategories: []
          }));
      }

      case 'brand': {
        if (!Array.isArray(filterOptions.brands)) return [];
        
        return filterOptions.brands
          .filter(searchFilter)
          .map(brand => ({
            mainCategory: brand,
            subCategories: []
          }));
      }

      case 'product': {
        if (!Array.isArray(filterOptions.products)) return [];
        
        return filterOptions.products
          .filter(searchFilter)
          .map(product => ({
            mainCategory: product,
            subCategories: []
          }));
      }

      default: {
        console.warn('Unknown filter type:', column.filterType);
        return [];
      }
    }
  });

// Add effect to debug filteredItems changes
  $effect(() => {
    console.log('Filter state:', {
      columnType: column?.filterType,
      filterOptions,
      filteredItemsCount: filteredItems.length,
      searchTerm,
      selectedValues
    });
  });

  function toggleCategory(category: string): void {
    expandedCategories = expandedCategories.includes(category)
      ? expandedCategories.filter(c => c !== category)
      : [...expandedCategories, category];
  }

  // Update toggleValue to handle all types
  async function toggleValue(value: string): Promise<void> {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];

    selectedValues = newSelectedValues;

    const url = new URL($page.url);
    if (newSelectedValues.length > 0) {
      url.searchParams.set(`filter_${column.key}`, newSelectedValues.join(','));
    } else {
      url.searchParams.delete(`filter_${column.key}`);
    }

    await goto(url, { replaceState: true });
  }

  async function resetFilters(): Promise<void> {
    selectedValues = [];
    searchTerm = '';
    const url = new URL($page.url);
    url.searchParams.delete(`filter_${column.key}`);
    goto(url, { replaceState: true });
  }

  function handlePopoverClose(): void {
    searchTerm = '';
    open = false;
  }

  function closeAndFocusTrigger(): void {
    handlePopoverClose();
    tick().then(() => triggerRef?.focus());
  }
</script>

<Popover.Root bind:open onOpenChange={(isOpen) => !isOpen && handlePopoverClose()}>
  <Popover.Trigger bind:ref={triggerRef} asChild>
    <Button variant="outline" class="w-full justify-between h-8" role="combobox" aria-expanded={open}>
      <span class="flex items-center gap-2">
        {selectedValues.length === 0 
          ? `Filter ${column.label}...`
          : `${selectedValues.length} selected`}
        {#if selectedValues.length > 0}
          <button 
            class="text-xs opacity-50 hover:opacity-100"
            onclick={(e) => {
              e.stopPropagation();
              resetFilters();
            }}
          >
            (clear)
          </button>
        {/if}
      </span>
      <ChevronDownIcon class="h-4 w-4 opacity-50" />
    </Button>
  </Popover.Trigger>
  
  <Popover.Content class="w-[200px] p-0">
    <Command.Root>
      <Command.Input 
        placeholder={`Search ${column.label.toLowerCase()}...`}
        bind:value={searchTerm}
        class="h-9"
      />
      <Command.List class="max-h-[300px] overflow-auto">
        <Command.Empty>No results found.</Command.Empty>
        
        <!-- Handle Category Filter Type -->
        {#if column.filterType === 'category'}
          {#each filteredItems as item (item.mainCategory)}
            <!-- Main Category Item -->
            <Command.Item
              value={item.mainCategory}
              onclick={() => toggleValue(item.mainCategory)}
              class="flex items-center justify-between cursor-pointer"
            >
              <div class="flex items-center gap-2">
                {#if item.subCategories.length > 0}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    class="h-4 w-4 p-0"
                    onclick={(e) => {
                      e.stopPropagation();
                      toggleCategory(item.mainCategory);
                    }}
                  >
                    <ChevronRightIcon 
                      class={`h-4 w-4 transition-transform ${
                        expandedCategories.includes(item.mainCategory) ? 'rotate-90' : ''
                      }`}
                    />
                  </Button>
                {:else}
                  <div class="w-4"></div>
                {/if}
                <span>{item.mainCategory}</span>
              </div>
              {#if selectedValues.includes(item.mainCategory)}
                <CheckIcon class="h-4 w-4" />
              {/if}
            </Command.Item>
            
            <!-- Subcategories -->
            {#if expandedCategories.includes(item.mainCategory) && item.subCategories.length > 0}
              {#each item.subCategories.sort(sortAlphaNumeric) as subCategory (subCategory)}
                <Command.Item
                  value={subCategory}
                  onclick={() => toggleValue(subCategory)}
                  class="flex items-center justify-between pl-8 cursor-pointer"
                >
                  <span>{subCategory}</span>
                  {#if selectedValues.includes(subCategory)}
                    <CheckIcon class="h-4 w-4" />
                  {/if}
                </Command.Item>
              {/each}
            {/if}
          {/each}
        {:else}
          <!-- Other Filter Types -->
          {#each filteredItems as item (item.mainCategory)}
            <Command.Item
              value={item.mainCategory}
              onclick={() => toggleValue(item.mainCategory)}
              class="flex items-center justify-between cursor-pointer"
            >
              <span>{item.mainCategory}</span>
              {#if selectedValues.includes(item.mainCategory)}
                <CheckIcon class="h-4 w-4" />
              {/if}
            </Command.Item>
          {/each}
        {/if}
      </Command.List>
    </Command.Root>
    
    <div class="border-t p-2">
      <Button 
        onclick={closeAndFocusTrigger}
        class="w-full"
      >
        Done
      </Button>
    </div>
  </Popover.Content>
</Popover.Root>