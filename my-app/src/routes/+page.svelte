<script lang="ts">
	// import { enhance } from '$app/forms';

	import ArrowRightIcon from 'lucide-svelte/icons/arrow-right';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	const features = [
		{
			title: 'Lorem Ipsum',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
		},
		{
			title: 'Vestibulum Accumsan',
			description: 'Vestibulum accumsan velit ut turpis scelerisque, sit amet cursus nisl gravida.'
		},
		{
			title: 'Aenean Consectetur',
			description: 'Aenean consectetur lacus eu nulla auctor, a tincidunt nisi egestas.'
		},
		{
			title: 'Nullam Tristique',
			description: 'Nullam tristique tortor a risus volutpat, ac hendrerit lorem finibus.'
		},
		{
			title: 'Pellentesque Habitasse',
			description: 'Pellentesque habitasse platea dictumst. Etiam nec tempor orci.'
		},
		{
			title: 'Curabitur Volutpat',
			description: 'Curabitur volutpat metus eget eros convallis, nec fermentum justo luctus.'
		}
	];
</script>

<div class="container max-w-[1024px] space-y-12 py-12">
	<div class="space-y-3">
		<h1 class="text-3xl font-bold tracking-tighter md:text-4xl">Buy it for Life.</h1>
		<p class="text-lg text-muted-foreground md:w-[50%]">
			Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
			pariatur.
		</p>
		<div class="flex space-x-3 pt-1">

		</div>
	</div>
	<div class="space-y-6">
		<h2 class="text-2xl font-semibold tracking-tighter md:text-3xl">Album</h2>
		<div class="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each features as feature}
				<Card.Root class="bg-gradient-to-t from-muted to-muted/60">
					<Card.Header>
						<Card.Title>
							{feature.title}
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="text-sm text-muted-foreground">
							{feature.description}
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</div>
</div>
