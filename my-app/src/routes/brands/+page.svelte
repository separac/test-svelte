<script lang="ts">
	export let data;
	//$: allBrands = data.allBrands;
	//$: allCategories = data.allCategories;
	$: allFucks = data.allFucks;
</script>


<div class="container max-w-[1024px] space-y-12 py-12">
	<div class="space-y-3">
		<h1 class="text-3xl font-bold tracking-tighter md:text-4xl">Explore Brands</h1>
		<p class="text-sm text-muted-foreground font-mono ">
			This data comes frome the database:
		</p>
		<div class="flex space-x-3 pt-1">
   
		</div>

		<div class="text-sm font-mono">
			<table>
				{#each allFucks as item}
					<tr>
						<th>
							<h3>{item.brandName}</h3>
						</th>
						<th class="shade"><h3>{item.mainCategory}</h3></th>
						<th class="shade"><h3>{item.subCategory}</h3></th>
						<th class="shade"><h3>{item.brandDescription}</h3></th>
                        <th class="shade"><h3>{item.brandWebsite}</h3></th>
					</tr>
				{/each}
			</table>
		</div>
	</div>
</div>

<style>
	th,
	tr {
		padding: 0px 10px;
		border: 1px solid #827f7f;
	}
	h3 {
		margin: 10px 5px;
	}
	.shade{
		background: #f5f5f513;
	}
</style>