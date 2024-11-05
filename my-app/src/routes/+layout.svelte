<script lang="ts">
	import '../app.css';

	import MenuIcon from 'lucide-svelte/icons/menu';
	import LogOutIcon from 'lucide-svelte/icons/log-out';
	import ChevronDownIcon from 'lucide-svelte/icons/chevron-down';

	import { Logo } from '$lib/components/logo';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';

	let { children } = $props();

	let scrollY: number = $state(0);
</script>

<svelte:window bind:scrollY />
<svelte:head>
	<link rel="icon" type="image/svg" href="/favicon.png" />
</svelte:head>

<header class="sticky top-0 w-full border-border bg-black {scrollY > 0 ? 'border-b' : ''}">
	<nav class="container flex w-full max-w-[1024px] items-center space-x-5 py-4 font-mono">
		<!-- Logo in Navbar -->
		<a class="contents" href="/">
			<div class="flex h-9 w-full items-center space-x-3 md:w-auto">
				<div class="hidden text-nowrap text-lg text-white font-bold md:block">
					<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 465 44" width="250" height="44">
						<title>bifl-logo</title>
						<style>
							.s0 { fill: #ffffff } 
						</style>
						<path id="✱" class="s0" aria-label="✱"  d="m8.8 8.2l10.9 6.3v-12.6h8.6v12.6l10.9-6.3 4.3 7.5-10.9 6.2 10.9 6.4-4.3 7.4-10.9-6.3v12.6h-8.6v-12.6l-10.9 6.3-4.3-7.5 10.9-6.3-10.9-6.2z"/>
						<path id="BUY IT FOR LIFE" class="s0" aria-label="BUY IT FOR LIFE"  d="m64 37v-32.8h10.6q5.5 0 8.2 2 2.8 2.1 2.8 6.2 0 3.2-1.7 5-1.6 1.8-4.7 2 3.7 0.4 5.6 2.6 1.9 2.1 1.9 6 0 4.7-2.8 6.9-2.9 2.1-9.3 2.1zm6.2-20.1h4.3q2.5 0 3.6-0.9 0.5-0.4 0.7-1.1 0.3-0.6 0.3-1.7 0-2-1.1-3-0.4-0.4-1.2-0.6-0.8-0.3-2.3-0.3h-4.3zm0 14.9h4.3q3.1 0 4.4-1.1 1.2-1 1.2-3.6 0-2.7-1.3-3.9-1.3-1.1-4.3-1.1h-4.3zm31.7 5.8q-5.9 0-8.6-3-2.6-3.1-2.6-9.7v-20.7h6.4v22.3q0 2.5 1.3 3.8 1.2 1.4 3.5 1.4 2.2 0 3.4-1.4 1.3-1.3 1.3-3.8v-22.3h6.5v20.7q0 6.7-2.7 9.7-2.7 3-8.5 3zm23.8-0.6v-13l-10.1-19.8h7l6.4 13.1 6.3-13.1h7l-10.1 19.8v13zm47.7 0v-5.7h6.5v-21.4h-6.5v-5.7h19.5v5.7h-6.5v21.4h6.5v5.7zm33.6 0v-27.2h-8.3v-5.6h23.1v5.6h-8.3v27.2zm47.9 0v-32.8h20.4v5.7h-13.9v7.3h12.7v5.7h-12.7v14.1zm36.6 0.6q-3 0-5.1-1.1-2.1-1.1-3.5-3.2-2.9-4.3-2.9-12.7 0-8.4 2.9-12.8 1.5-2.2 3.7-3.2 2.2-1 4.9-1 5.7 0 8.6 4.3 2.9 4.3 2.9 12.7 0 8.4-2.9 12.7-1.4 2.1-3.5 3.2-2.2 1.1-5.1 1.1zm0-5.8q2.5 0 3.6-2.7 1.2-2.6 1.2-8.5 0-6-1.2-8.6-1.1-2.6-3.6-2.6-2.5 0-3.6 2.6-1.2 2.6-1.2 8.6 0 5.9 1.2 8.5 1.1 2.7 3.6 2.7zm16.5 5.2v-32.8h9.3q6.4 0 9.1 2.2 1.4 1.1 2.1 3 0.7 1.8 0.7 4.2 0 1.8-0.4 3.1-0.4 1.4-1.3 2.4-0.8 0.9-1.9 1.6-1.2 0.6-2.8 0.8 1 0.2 1.7 0.9 0.3 0.3 0.7 1 0.5 0.7 1 1.8l5.9 11.8h-7.1l-3.9-8.3-0.5-1q-0.9-1.9-1.9-2.8-1-0.9-2.2-0.9h-2.1v13zm6.5-18.4h3.1q2.6 0 3.8-1.1 0.5-0.5 0.8-1.3 0.3-0.8 0.3-2.1 0-2.4-1.1-3.5-1.2-1-3.8-1h-3.1zm49.8 18.4v-32.8h6.4v27.1h13.9v5.7zm25.9 0v-5.7h6.6v-21.4h-6.6v-5.7h19.6v5.7h-6.6v21.4h6.6v5.7zm27.3 0v-32.8h20.4v5.7h-13.9v7.3h12.7v5.7h-12.7v14.1zm26.7 0v-32.8h20.5v5.7h-14v7.1h12.7v5.7h-12.7v8.6h14v5.7z"/>
					</svg>
				</div>
			</div>
		</a>
		<!-- Menu items in Navbar -->
		<div class="hidden h-9 w-full justify-end md:flex text-white">
			<div class="flex items-center">
				<div>
					<Button size="sm" variant="ghost" class="text-white hover:font-bold" href="/brands">
						explore brands
					</Button>
					<Button size="sm" variant="ghost" class="text-white hover:font-bold" href="/products">
						explore products
					</Button>
					<Button size="sm" variant="ghost" class="text-white hover:font-bold" href="/contact">
						contact
					</Button>
				</div>
			</div>
		</div>

		<!-- Mobile Navigation in Navbar -->

		<div class="md:hidden">
			<Sheet.Root>
				<Sheet.Trigger class={buttonVariants({ variant: 'outline', size: 'sm'})}>
					<MenuIcon />
				</Sheet.Trigger>
				<Sheet.Content class="flex flex-col text-white">
					<Sheet.Header>
						<Sheet.Title>Buy it for Life</Sheet.Title>
					</Sheet.Header>
					<div class="flex-1 space-y-5">
						<div class="text-black hover:font-bold space-y-3">
							<Button class="w-full justify-between font-mono text-base text-black hover:font-bold" variant="ghost">
								<span> explore brands </span>
								<!--<ChevronDownIcon class="h-[1.2rem] w-[1.2rem]" />-->
							</Button>
							<Button class="w-full justify-between font-mono text-base text-black hover:font-bold" variant="ghost">
								<span> explore products </span>
							</Button>
							<Button class="w-full justify-between font-mono text-base text-black hover:font-bold" variant="ghost">
								<span> contact </span>
							</Button>
						</div>
					</div>
				</Sheet.Content>
			</Sheet.Root>
		</div>
	</nav>
</header>


<div class="min-h-dvh">
	{@render children()}
</div>

<footer class="min-h-16 w-full border-t font-mono">
	<div class="container max-w-[1024px] py-8 text-foreground/70">
		<div class="flex w-full items-center justify-between">
			<div class="flex items-center space-x-1 text-sm">2024 // Buy it for Life</div>
			<!-- <ThemeController /> -->
		</div>
	</div>
</footer>