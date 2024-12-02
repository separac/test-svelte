<!-- src/lib/components/brand-logo.svelte -->
<script lang="ts">
    import { cn } from '$lib/utils';
    import type { BrandEntity } from '$lib/types';
    
    let { brand, size = 'md' } = $props<{
      brand: BrandEntity;
      size?: 'sm' | 'md' | 'lg';
    }>();
  
    // Create a derived property for the display name
    const displayName = $derived(brand.name || brand.brandName);

    const sizeClasses = {
      sm: 'h-6 w-6',
      md: 'h-8 w-8',
      lg: 'h-12 w-12'
    };
  
    const fontSizes = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    };
</script>

<div class="flex items-center justify-center">
    {#if brand.logo?.type === 'simple-icon' && brand.logo?.value}
        <img
            src={brand.logo.value}
            alt={`${displayName} logo`}
            class={cn(sizeClasses[size], "object-contain")}
        />
    {:else}
        <div
            class={cn(
                sizeClasses[size],
                'bg-slate-100',
                'rounded-full flex items-center justify-center font-semibold',
                fontSizes[size]
            )}
            aria-label={`${displayName} logo`}
        >
            {displayName.substring(0, 2).toUpperCase()}
        </div>
    {/if}
</div>