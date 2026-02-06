<script lang="ts">
  import type { CategoryFilter, ColumnDef, FilterOptions, FilterValue } from '$lib/types';
  import * as Command from "$lib/components/ui/command";
  import * as Popover from "$lib/components/ui/popover";
  import { Button } from "$lib/components/ui/button";
  import CheckIcon from "~icons/lucide/check";
  import ChevronDownIcon from "~icons/lucide/chevron-down";
  import ChevronRightIcon from "~icons/lucide/chevron-right";

  let { column, filterOptions, activeFilters, onFilterChange } = $props<{
    column: ColumnDef;
    filterOptions: FilterOptions;
    activeFilters: string[];
    onFilterChange: (values: string[]) => void;
  }>();

  let open = $state(false);
  let searchTerm = $state('');
  let expandedCategories = $state<string[]>([]);
  let selectedValues = $state<string[]>(activeFilters);
  let triggerRef = $state<HTMLButtonElement | null>(null);

  // Update availableItems to handle 'keyword' filter type appropriately
  let availableItems = $derived.by(() => {
    const search = searchTerm.toLowerCase();

    if (!column.filterType) return [];

    if (column.filterType === 'keyword') {
      // For keyword search, no predefined items are needed
      return [];
    }

    const filterKey = `${column.filterType}s`;
    if (!filterOptions[filterKey]) return [];

    const items = filterOptions[filterKey].values;

    if (column.filterType === 'category') {
      return items.filter((item: CategoryFilter) => {
        const searchText = item.mainCategory.toLowerCase();
        return !search || searchText.includes(search);
      });
    } else {
      return items.filter((item: FilterValue) => {
        const searchText = item.label.toLowerCase();
        return !search || searchText.includes(search);
      });
    }
  });

  // Add a debug inspect
  $inspect(filterOptions);
  $inspect(availableItems);

  // Update parent when selection changes
  $effect(() => {
    onFilterChange(selectedValues);
  });

  function toggleCategory(category: string) {
    expandedCategories = expandedCategories.includes(category)
      ? expandedCategories.filter(c => c !== category)
      : [...expandedCategories, category];
  }

  function toggleValue(value: string) {
    selectedValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
  }

  function resetFilters() {
    selectedValues = [];
    searchTerm = '';
  }

  function handlePopoverClose() {
    searchTerm = '';
    open = false;
  }

  function closeAndFocusTrigger() {
    handlePopoverClose();
    if (triggerRef) {
      triggerRef.focus();
    }
  }

  // Helper function to determine if an item has subcategories
  function hasSubCategories(item: any): item is CategoryFilter {
    return column.filterType === 'category' && 'subCategories' in item && item.subCategories.length > 0;
  }

  // Helper function to get display value
  function getDisplayValue(item: any): string {
    if (hasSubCategories(item)) return item.mainCategory;
    return 'label' in item ? item.label : item;
  }

  function onOpenChange(isOpen: boolean) {
    open = isOpen;
    if (!isOpen) handlePopoverClose();
  }
</script>

<style>
  /* Add styles to ensure left alignment */
  .command-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .sub-category {
    padding-left: 1.5rem;
  }
</style>

<Popover.Root {open} onOpenChange={onOpenChange}>
  <Popover.Trigger>
    <Button
      ref={triggerRef}
      variant="outline"
      class="w-full justify-between h-8"
      role="combobox"
      aria-expanded={open}
    >
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
  
  <!-- Popover content -->
  <Popover.Content class="w-[250px] p-4">
    {#if column.filterType === 'keyword'}
      <!-- Render a simple search input for keyword filters -->
      <Input
        placeholder={`Search ${column.label.toLowerCase()}...`}
        bind:value={searchTerm}
        class="h-9 mb-2"
        on:input={() => onFilterChange([searchTerm])}
      />
    {:else}
      <Command.Root>
        <Command.Input 
          placeholder={`Search ${column.label.toLowerCase()}...`}
          bind:value={searchTerm}
          class="h-9 mb-2"
        />
        <Command.List class="max-h-[300px] overflow-auto">
          <Command.Empty>No results found.</Command.Empty>
          {#if availableItems.length > 0}
            {#each availableItems as item}
              <div class="command-item">
                <Command.Item
                  value={getDisplayValue(item)}
                  onclick={() => toggleValue(getDisplayValue(item))}
                  class="flex items-center cursor-pointer"
                >
                  {#if hasSubCategories(item)}
                    <button 
                      class="mr-2"
                      onclick={(e) => {
                        e.stopPropagation();
                        toggleCategory(item.mainCategory);
                      }}
                    >
                      <ChevronRightIcon class={`h-4 w-4 transition-transform ${expandedCategories.includes(item.mainCategory) ? 'rotate-90' : ''}`} />
                    </button>
                  {/if}
                  <span>{getDisplayValue(item)}</span>
                </Command.Item>
                {#if selectedValues.includes(getDisplayValue(item))}
                  <CheckIcon class="h-4 w-4" />
                {/if}
              </div>

              {#if hasSubCategories(item) && expandedCategories.includes(item.mainCategory)}
                {#each item.subCategories as subCategory}
                  <div class="sub-category">
                    <div class="command-item">
                      <Command.Item
                        value={subCategory}
                        onclick={() => toggleValue(subCategory)}
                        class="flex items-center cursor-pointer"
                      >
                        <span>{subCategory}</span>
                      </Command.Item>
                      {#if selectedValues.includes(subCategory)}
                        <CheckIcon class="h-4 w-4" />
                      {/if}
                    </div>
                  </div>
                {/each}
              {/if}
            {/each}
          {:else}
            <Command.Item disabled>
              <span class="text-muted-foreground">No items available.</span>

            </Command.Item>
          {/if}
        </Command.List>
      </Command.Root>
      
      <div class="border-t mt-4 pt-2">
        <Button 
          onclick={closeAndFocusTrigger}
          class="w-full"
        >
          Done
        </Button>
      </div>
    {/if}
  </Popover.Content>
</Popover.Root>