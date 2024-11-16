// src/types/unplugin-icons.d.ts
declare module '~icons/*' {
    import type { SvelteComponentType } from 'svelte';
    const component: SvelteComponentType;
    export default component;
  }