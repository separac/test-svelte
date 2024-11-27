<!-- +page.svelte -->
<script lang="ts">
    import type { PageData } from './$types';
    // Import Heroicons
    import ArrowUpIcon from "~icons/heroicons/arrow-up-right";
	import Alphabet from "~icons/bi/alphabet";
	import SortAlphabetical from "~icons/lineicons/sort-alphabetical";
    import BrandCarousel from '$lib/components/brand-carousel.svelte';

    export let data: PageData;

    // Debug log to verify data
    console.log('Page Data:', data);
</script>
  
<!-- HERE STARTS THE PAGE -->

<div class="container max-w-screen-xl space-y-8 py-8">
	<div class="space-y-3">
	  <h1 class="text-3xl font-bold tracking-tighter md:text-4xl">Explore Brands</h1>
	  <p class="text-sm text-muted-foreground font-mono">
	  Discover all our curated buy it for life brands.
	  </p>
	</div>

	<!-- CONTENT OF THE PAGE BELOW HEADLINE -->

	<div class="space-y-16">

	<!-- Featured Brands Carousel -->

		<div class="mt-12">
			<div class="flex items-center gap-2 mb-6">
				<ArrowUpIcon class="h-5 w-5"></ArrowUpIcon>
				<h2 class="text-xl font-semibold">discover recommended brands</h2>
			</div>
			<BrandCarousel brands={data.features ?? []} />
		</div>

	<!-- All Brands -->
		<div class="mt-12">
			<div class="flex items-center gap-2 mb-6">
				<SortAlphabetical class="h-5 w-5"></SortAlphabetical>
				<h2 class="text-xl font-semibold">browse all brands by letter</h2>
			</div>
			
		</div>

	</div>
</div>