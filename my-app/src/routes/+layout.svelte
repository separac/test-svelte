<script lang="ts">
	import '../app.css';
	import IconMenu from '~icons/lucide/menu';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Button } from '$lib/components/ui/button';
	import { buttonVariants } from '$lib/components/ui/button/variants';
	import { Card } from '$lib/components/ui/card';
	import { 
		Compass, 
		Database, 
		Grid, 
		Heart,
		ChevronDown 
	} from 'lucide-svelte';

	let { children } = $props();
	let scrollY = $state(0);
	let isExpanded = $state(false);
  	let hoveredIndex = $state<number | null>(null);

	const subPages = [
		{
		label: 'Featured Highlights',
		href: '/explore',
		description: 'Discover curated BIFL brand highlights and new additions',
		icon: Compass
		},
		{
		label: 'Brands Database',
		href: '/explore/database',
		description: 'Browse our comprehensive database of BIFL brands',
		icon: Database
		},
		{
		label: 'Categories',
		href: '/explore/categories',
		description: 'Find brands by product categories',
		icon: Grid
		},
		{
		label: 'Community Favorites',
		href: '/explore/community-favorites',
		description: 'Top-rated brands by the BIFL community',
		icon: Heart
		}
	];

	// Event handlers using runes
	function handleMouseEnter() {
		isExpanded = true;
	}

	function handleMouseLeave() {
		isExpanded = false;
	}

	function handleItemHover(index: number) {
		hoveredIndex = index;
	}

	// Derived value for rotation
	let isRotated = $derived(isExpanded);
</script>

<svelte:window bind:scrollY />
<svelte:head>
	<link rel="icon" type="image/svg" href="/favicon.png" />
</svelte:head>

<div class="flex min-h-dvh flex-col">
	<!-- Header und Navigation -->
	<header class="sticky top-0 w-full mx-auto border-border bg-black {scrollY > 0 ? 'border-b' : ''}">
		<nav class="container flex w-full max-w-screen-xl items-center justify-between py-4 font-mono">
			<!-- Alternative Logo via TEXT only
			<a href="/" class="flex items-center">
				<div class="font-mono text-xl md:text-2xl lg:text-2xl text-white font-bold transition-all duration-200">
				  <span class="mr-2 text-xl md:text-2xl lg:text-3xl">✱</span>Buy it for Life
				</div>
			</a>
			-->
			<!-- SVG Logo - Always visible-->
			<a href="/" class="flex items-center">
				<div class="text-nowrap text-lg text-white font-bold transition-all duration-200">
					<svg 
						version="1.2" 
						xmlns="http://www.w3.org/2000/svg" 
						viewBox="0 0 465 44" 
						class="w-[150px] md:w-[200px] lg:w-[250px] h-auto transition-all duration-200"
					>
						<title>bifl-logo</title>
						<style>
							.s0 { fill: #ffffff } 
						</style>
						<path id="✱" class="s0" aria-label="✱"  d="m8.8 8.2l10.9 6.3v-12.6h8.6v12.6l10.9-6.3 4.3 7.5-10.9 6.2 10.9 6.4-4.3 7.4-10.9-6.3v12.6h-8.6v-12.6l-10.9 6.3-4.3-7.5 10.9-6.3-10.9-6.2z"/>
						<path id="BUY IT FOR LIFE" class="s0" aria-label="Buy it for Life"  d="m64 37v-32.8h10.6q5.5 0 8.2 2 2.8 2.1 2.8 6.2 0 3.2-1.7 5-1.6 1.8-4.7 2 3.7 0.4 5.6 2.6 1.9 2.1 1.9 6 0 4.7-2.8 6.9-2.9 2.1-9.3 2.1zm6.2-20.1h4.3q2.5 0 3.6-0.9 0.5-0.4 0.7-1.1 0.3-0.6 0.3-1.7 0-2-1.1-3-0.4-0.4-1.2-0.6-0.8-0.3-2.3-0.3h-4.3zm0 14.9h4.3q3.1 0 4.4-1.1 1.2-1 1.2-3.6 0-2.7-1.3-3.9-1.3-1.1-4.3-1.1h-4.3zm31.7 5.8q-5.9 0-8.6-3-2.6-3.1-2.6-9.7v-20.7h6.4v22.3q0 2.5 1.3 3.8 1.2 1.4 3.5 1.4 2.2 0 3.4-1.4 1.3-1.3 1.3-3.8v-22.3h6.5v20.7q0 6.7-2.7 9.7-2.7 3-8.5 3zm23.8-0.6v-13l-10.1-19.8h7l6.4 13.1 6.3-13.1h7l-10.1 19.8v13zm47.7 0v-5.7h6.5v-21.4h-6.5v-5.7h19.5v5.7h-6.5v21.4h6.5v5.7zm33.6 0v-27.2h-8.3v-5.6h23.1v5.6h-8.3v27.2zm47.9 0v-32.8h20.4v5.7h-13.9v7.3h12.7v5.7h-12.7v14.1zm36.6 0.6q-3 0-5.1-1.1-2.1-1.1-3.5-3.2-2.9-4.3-2.9-12.7 0-8.4 2.9-12.8 1.5-2.2 3.7-3.2 2.2-1 4.9-1 5.7 0 8.6 4.3 2.9 4.3 2.9 12.7 0 8.4-2.9 12.7-1.4 2.1-3.5 3.2-2.2 1.1-5.1 1.1zm0-5.8q2.5 0 3.6-2.7 1.2-2.6 1.2-8.5 0-6-1.2-8.6-1.1-2.6-3.6-2.6-2.5 0-3.6 2.6-1.2 2.6-1.2 8.6 0 5.9 1.2 8.5 1.1 2.7 3.6 2.7zm16.5 5.2v-32.8h9.3q6.4 0 9.1 2.2 1.4 1.1 2.1 3 0.7 1.8 0.7 4.2 0 1.8-0.4 3.1-0.4 1.4-1.3 2.4-0.8 0.9-1.9 1.6-1.2 0.6-2.8 0.8 1 0.2 1.7 0.9 0.3 0.3 0.7 1 0.5 0.7 1 1.8l5.9 11.8h-7.1l-3.9-8.3-0.5-1q-0.9-1.9-1.9-2.8-1-0.9-2.2-0.9h-2.1v13zm6.5-18.4h3.1q2.6 0 3.8-1.1 0.5-0.5 0.8-1.3 0.3-0.8 0.3-2.1 0-2.4-1.1-3.5-1.2-1-3.8-1h-3.1zm49.8 18.4v-32.8h6.4v27.1h13.9v5.7zm25.9 0v-5.7h6.6v-21.4h-6.6v-5.7h19.6v5.7h-6.6v21.4h6.6v5.7zm27.3 0v-32.8h20.4v5.7h-13.9v7.3h12.7v5.7h-12.7v14.1zm26.7 0v-32.8h20.5v5.7h-14v7.1h12.7v5.7h-12.7v8.6h14v5.7z"/>
					</svg>
				</div>
			</a> 

			<!-- Desktop Navigation NEW -->
			<div class="hidden md:flex items-center space-x-4">
				<div class="relative" role="navigation">
					<!-- Main Navigation Button -->
					<Button 
						size="sm" 
						variant="ghost" 
						class="text-white hover:font-bold group flex items-center gap-2" 
						on:pointerenter={handleMouseEnter}
						aria-expanded={isExpanded}
						aria-haspopup="true"
					>
						explore brands
						<ChevronDown
							class="h-4 w-4 transition-transform duration-300"
							style="transform: rotate({isExpanded ? 180 : 0}deg)"
						/>
					</Button>
					
					<!-- Dropdown Menu -->
					{#if isExpanded}
						<div 
							class="absolute top-full left-0 w-screen max-w-2xl"
							on:pointerleave={handleMouseLeave}
							role="menu"
							aria-orientation="vertical"
						>
							<Card class="bg-black border-x border-b border-gray-800 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.5)]">
								<div class="p-6 grid grid-cols-2 gap-4">
									{#each subPages as page, index}
										{@const isHovered = hoveredIndex === index}
										<a
											href={page.href}
											class="group relative p-4 rounded-lg transition-all duration-300"
											style:background={isHovered ? 'linear-gradient(to right, rgb(26, 26, 26), rgb(38, 38, 38))' : ''}
											on:pointerenter={() => handleItemHover(index)}
											on:pointerleave={() => handleItemHover(null)}
											role="menuitem"
										>
											<div class="flex items-center gap-3 mb-2">
												<div 
													class="p-2 rounded-lg transition-colors duration-300" 
													style:background-color={isHovered ? 'rgb(30, 58, 138)' : 'rgb(31, 41, 55)'}
													style:color={isHovered ? 'rgb(96, 165, 250)' : 'rgb(156, 163, 175)'}
												>
													<svelte:component 
														this={page.icon} 
														class="h-5 w-5"
													/>
												</div>
												<h3 
													class="font-medium transition-colors duration-300"
													style:color={isHovered ? 'rgb(96, 165, 250)' : 'rgb(243, 244, 246)'}
												>
													{page.label}
												</h3>
											</div>
											
											<p 
												class="text-sm ml-11 transition-colors duration-300"
												style:color={isHovered ? 'rgb(209, 213, 219)' : 'rgb(156, 163, 175)'}
											>
												{page.description}
											</p>
											
											<div 
												class="absolute inset-0 border border-transparent rounded-lg transition-colors duration-300"
												style:border-color={isHovered ? 'rgb(30, 64, 175)' : 'transparent'}
											/>
										</a>
									{/each}
								</div>
							</Card>
						</div>
					{/if}
				</div>
			
				<Button size="sm" variant="ghost" class="text-white hover:font-bold" href="/products">
					explore products
				</Button>
				<Button size="sm" variant="ghost" class="text-white hover:font-bold" href="/contact">
					contact
				</Button>
			</div>

			<!-- Mobile Navigation -->
			<div class="md:hidden">
				<Drawer.Root>
					<Drawer.Trigger 
						class={buttonVariants({ 
							variant: 'ghost', 
							size: 'icon',
						})}
					>
						<IconMenu class="h-6 w-6 text-white transition-colors hover:text-gray-300" />
					</Drawer.Trigger>
					<Drawer.Content class="bg-black text-white border-t border-white/10 animate-in slide-in-from-bottom duration-300">
						<div class="flex flex-col space-y-4 container max-w-screen-xl px-4 py-6">
							<Drawer.Header>
								<Drawer.Title>
									<!-- Use the same SVG logo but smaller -->
									<svg 
										version="1.2" 
										xmlns="http://www.w3.org/2000/svg" 
										viewBox="0 0 465 44" 
										class="w-[150px] h-auto"
									>
										<title>bifl-logo</title>
										<style>.s0 { fill: #ffffff }</style>
										<path id="✱" class="s0" aria-label="✱" d="m8.8 8.2l10.9 6.3v-12.6h8.6v12.6l10.9-6.3 4.3 7.5-10.9 6.2 10.9 6.4-4.3 7.4-10.9-6.3v12.6h-8.6v-12.6l-10.9 6.3-4.3-7.5 10.9-6.3-10.9-6.2z"/>
										<path id="BUY IT FOR LIFE" class="s0" aria-label="Buy it for Life" d="m64 37v-32.8h10.6q5.5 0 8.2 2 2.8 2.1 2.8 6.2 0 3.2-1.7 5-1.6 1.8-4.7 2 3.7 0.4 5.6 2.6 1.9 2.1 1.9 6 0 4.7-2.8 6.9-2.9 2.1-9.3 2.1zm6.2-20.1h4.3q2.5 0 3.6-0.9 0.5-0.4 0.7-1.1 0.3-0.6 0.3-1.7 0-2-1.1-3-0.4-0.4-1.2-0.6-0.8-0.3-2.3-0.3h-4.3zm0 14.9h4.3q3.1 0 4.4-1.1 1.2-1 1.2-3.6 0-2.7-1.3-3.9-1.3-1.1-4.3-1.1h-4.3zm31.7 5.8q-5.9 0-8.6-3-2.6-3.1-2.6-9.7v-20.7h6.4v22.3q0 2.5 1.3 3.8 1.2 1.4 3.5 1.4 2.2 0 3.4-1.4 1.3-1.3 1.3-3.8v-22.3h6.5v20.7q0 6.7-2.7 9.7-2.7 3-8.5 3zm23.8-0.6v-13l-10.1-19.8h7l6.4 13.1 6.3-13.1h7l-10.1 19.8v13zm47.7 0v-5.7h6.5v-21.4h-6.5v-5.7h19.5v5.7h-6.5v21.4h6.5v5.7zm33.6 0v-27.2h-8.3v-5.6h23.1v5.6h-8.3v27.2zm47.9 0v-32.8h20.4v5.7h-13.9v7.3h12.7v5.7h-12.7v14.1zm36.6 0.6q-3 0-5.1-1.1-2.1-1.1-3.5-3.2-2.9-4.3-2.9-12.7 0-8.4 2.9-12.8 1.5-2.2 3.7-3.2 2.2-1 4.9-1 5.7 0 8.6 4.3 2.9 4.3 2.9 12.7 0 8.4-2.9 12.7-1.4 2.1-3.5 3.2-2.2 1.1-5.1 1.1zm0-5.8q2.5 0 3.6-2.7 1.2-2.6 1.2-8.5 0-6-1.2-8.6-1.1-2.6-3.6-2.6-2.5 0-3.6 2.6-1.2 2.6-1.2 8.6 0 5.9 1.2 8.5 1.1 2.7 3.6 2.7zm16.5 5.2v-32.8h9.3q6.4 0 9.1 2.2 1.4 1.1 2.1 3 0.7 1.8 0.7 4.2 0 1.8-0.4 3.1-0.4 1.4-1.3 2.4-0.8 0.9-1.9 1.6-1.2 0.6-2.8 0.8 1 0.2 1.7 0.9 0.3 0.3 0.7 1 0.5 0.7 1 1.8l5.9 11.8h-7.1l-3.9-8.3-0.5-1q-0.9-1.9-1.9-2.8-1-0.9-2.2-0.9h-2.1v13zm6.5-18.4h3.1q2.6 0 3.8-1.1 0.5-0.5 0.8-1.3 0.3-0.8 0.3-2.1 0-2.4-1.1-3.5-1.2-1-3.8-1h-3.1zm49.8 18.4v-32.8h6.4v27.1h13.9v5.7zm25.9 0v-5.7h6.6v-21.4h-6.6v-5.7h19.6v5.7h-6.6v21.4h6.6v5.7zm27.3 0v-32.8h20.4v5.7h-13.9v7.3h12.7v5.7h-12.7v14.1zm26.7 0v-32.8h20.5v5.7h-14v7.1h12.7v5.7h-12.7v8.6h14v5.7z"/>
									</svg>
								</Drawer.Title>
							</Drawer.Header>
							<!-- In the mobile drawer content -->
							<div class="flex flex-col space-y-2">
								<!-- Explore Brands with sub-items -->
								<div class="space-y-2">
								<Button 
									variant="ghost" 
									class="w-full justify-start font-mono text-white hover:font-bold" 
								>
									explore brands
								</Button>
								<!-- Sub-pages -->
								<div class="ml-4 space-y-2">
									{#each subPages as page}
									<Button 
										variant="ghost" 
										class="w-full justify-start font-mono text-sm text-white/70 hover:text-white hover:font-bold" 
										href={page.href}
									>
										<svelte:component this={page.icon} class="h-4 w-4 mr-2" />
										{page.label}
									</Button>
									{/each}
								</div>
								</div>
							
								<!-- Other navigation items -->
								<Button 
								variant="ghost" 
								class="w-full justify-start font-mono text-white hover:font-bold" 
								href="/products"
								>
								explore products
								</Button>
								<Button 
								variant="ghost" 
								class="w-full justify-start font-mono text-white hover:font-bold" 
								href="/contact"
								>
								contact
								</Button>
							</div>
						</div>
					</Drawer.Content>
				</Drawer.Root>
			</div>
		</nav>
	</header>

	<!-- Body and Main Content -->
	<main class="flex-1 w-full bg-gradient-to-b from-white to-gray-50 transition-all duration-200">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="w-full">
		<!-- Star Banner -->
		<div class="w-full bg-black">
			<div class="container max-w-screen-xl">
				<div class="h-4 w-full text-white flex items-center justify-center text-xs tracking-[0.2rem] overflow-hidden whitespace-nowrap">
					{#each Array(75) as _}
						<span class="inline-block mx-1">✱</span>
					{/each}
				</div>
			</div>
		</div>
	
		<!-- Sitemap Section -->
		<div class="container max-w-screen-xl py-12 text-foreground font-mono">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
			<!-- Company -->
			<div class="space-y-4">
				<h3 class="font-mono font-bold text-sm">Company</h3>
				<ul class="space-y-2 text-sm text-foreground/70">
				<li><a href="/" class="hover:text-foreground transition-colors">Home</a></li>
				<li><a href="/about" class="hover:text-foreground transition-colors">About</a></li>
				<li><a href="/contact" class="hover:text-foreground transition-colors">Contact</a></li>
				</ul>
			</div>

			<!-- Products -->
			<div class="space-y-4">
				<h3 class="font-mono font-bold text-sm">Products</h3>
				<ul class="space-y-2 text-sm text-foreground/70">
				<li><a href="/products" class="hover:text-foreground transition-colors">All Products</a></li>
				<li><a href="/products/featured" class="hover:text-foreground transition-colors">Featured</a></li>
				<li><a href="/products/new" class="hover:text-foreground transition-colors">New Arrivals</a></li>
				</ul>
			</div>

			<!-- Brands -->
			<div class="space-y-4">
				<h3 class="font-mono font-bold text-sm">Brands</h3>
				<ul class="space-y-2 text-sm text-foreground/70">
				<li><a href="/brands" class="hover:text-foreground transition-colors">All Brands</a></li>
				<li><a href="/brands/featured" class="hover:text-foreground transition-colors">Featured Brands</a></li>
				<li><a href="/brands/submit" class="hover:text-foreground transition-colors">Submit Brand</a></li>
				</ul>
			</div>

			<!-- Legal -->
			<div class="space-y-4">
				<h3 class="font-mono font-bold text-sm">Legal</h3>
				<ul class="space-y-2 text-sm text-foreground/70">
				<li><a href="/privacy" class="hover:text-foreground transition-colors">Privacy Policy</a></li>
				<li><a href="/terms" class="hover:text-foreground transition-colors">Terms of Service</a></li>
				<li><a href="/imprint" class="hover:text-foreground transition-colors">Imprint</a></li>
				</ul>
			</div>
			</div>
		</div>

		<!-- Copyright Bar -->
		<div class="container max-w-screen-xl">
			<div class="w-full py-8 border-t">
				<div class="flex w-full items-center justify-between font-mono text-foreground/70">
					<div class="flex items-center space-x-1 text-xs">2024 // Buy it for Life</div>
					<!-- <ThemeController /> -->
				</div>
			</div>
		</div>
	</footer>
</div>
