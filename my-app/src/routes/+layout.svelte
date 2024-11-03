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

<header class="sticky top-0 w-full border-border bg-black {scrollY > 0 ? 'border-b' : ''}">
	<nav class="container flex w-full max-w-[1024px] items-center space-x-5 py-4 font-mono">
		<!-- Logo in Navbar -->
		<a class="contents" href="/">
			<div class="flex h-9 w-full items-center space-x-3 md:w-auto">
				<Logo size="sm" />
				<div class="hidden text-nowrap text-lg text-white font-bold md:block">buy it for life</div>
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