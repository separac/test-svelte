<!-- button.svelte -->
<script lang="ts">
    import { cn } from "$lib/utils";
    import { buttonVariants } from './variants';
    import type { ButtonVariant, ButtonSize } from './variants';
    
    let { 
        variant = 'default',
        size = 'default',
        class: className = '',
        href,
        type = 'button',
        disabled = false,
        children,
        onclick = () => {}
    } = $props<{
        variant?: ButtonVariant;
        size?: ButtonSize;
        class?: string;
        href?: string;
        type?: 'button' | 'submit' | 'reset';
        disabled?: boolean;
        children?: any;
        onclick?: (event: MouseEvent) => void;
    }>();
</script>

{#if href}
    <a
        {href}
        class={cn(buttonVariants({ variant, size }), className)}
    >
        {@render children?.()}
    </a>
{:else}
    <button
        {type}
        {disabled}
        class={cn(buttonVariants({ variant, size }), className)}
        onclick={onclick}
    >
        {@render children?.()}
    </button>
{/if}