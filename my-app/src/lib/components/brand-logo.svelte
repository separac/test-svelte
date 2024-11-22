<!-- src/lib/components/brand-logo.svelte -->
<script lang="ts">
    import { cn } from '$lib/utils';
    
    let { brand, size = 'md' } = $props<{
      brand: {
        id: string;
        name: string;
        logo: {
          type: 'simple-icon' | 'custom-svg' | 'wordmark';
          value?: string;
          backgroundColor?: string;
        };
      };
      size?: 'sm' | 'md' | 'lg';
    }>();
  
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
    {#if brand.logo.type === 'simple-icon' && brand.logo.value}
      <img
        src={brand.logo.value}
        alt={`${brand.name} logo`}
        class={cn(sizeClasses[size], "object-contain")}
      />
    {:else}
      <div
        class={cn(
          sizeClasses[size],
          brand.logo.backgroundColor || 'bg-slate-100',
          'rounded-full flex items-center justify-center font-semibold',
          fontSizes[size]
        )}
        aria-label={`${brand.name} logo`}
      >
        {brand.name.substring(0, 2).toUpperCase()}
      </div>
    {/if}
  </div>