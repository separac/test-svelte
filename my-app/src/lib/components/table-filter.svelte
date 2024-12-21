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

  let availableItems = $derived.by(() => {
    const search = searchTerm.toLowerCase();

    if (!column.filterType) return [];

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
  <Popover.Content class="w-[200px] p-0">
    <Command.Root>
      <Command.Input 
        placeholder={`Search ${column.label.toLowerCase()}...`}
        bind:value={searchTerm}
        class="h-9"
      />
      <Command.List class="max-h-[300px] overflow-auto">
        <Command.Empty>No results found.</Command.Empty>
        {#if availableItems.length > 0}
          {#each availableItems as item}
            <Command.Item
              value={getDisplayValue(item)}
              onclick={() => toggleValue(getDisplayValue(item))}
              class="flex items-center justify-between cursor-pointer"
            >
              <div class="flex items-center gap-2">
                {#if hasSubCategories(item)}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    class="h-4 w-4 p-0"
                    onclick={(e) => {
                      e.stopPropagation();
                      toggleCategory(item.mainCategory);
                    }}
                  >
                    <ChevronRightIcon class="h-4 w-4 transition-transform {
                      expandedCategories.includes(item.mainCategory) ? 'rotate-90' : ''
                    }" />
                  </Button>
                {:else}
                  <div class="w-4"></div>
                {/if}
                <span>{getDisplayValue(item)}</span>
              </div>
              {#if selectedValues.includes(getDisplayValue(item))}
                <CheckIcon class="h-4 w-4" />
              {/if}
            </Command.Item>
            
            {#if hasSubCategories(item) && 
                expandedCategories.includes(item.mainCategory)}
              {#each item.subCategories as subCategory}
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
          <Command.Item disabled>
            <span class="text-muted-foreground">No items available.</span>
          </Command.Item>
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