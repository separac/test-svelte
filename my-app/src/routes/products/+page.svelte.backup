<script lang="ts">
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
  import type { PageData } from './$types';

  export let data: PageData;

  // Format currency helper
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
</script>


<div class="container max-w-[1024px] space-y-12 py-12">
	<div class="space-y-3">
		<h1 class="text-3xl font-bold tracking-tighter md:text-4xl">Explore Products</h1>
		<p class="text-sm text-muted-foreground font-mono ">
			This data comes frome the database:
		</p>
		<div class="flex space-x-3 pt-1">
   
		</div>

        <div class="rounded-md border">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>MSRP</TableHead>
                <TableHead class="text-right">Links</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {#each data.products as product}
                <TableRow>
                    <TableCell>
                    <div>
                        <div class="font-medium">{product.name}</div>
                        {#if product.description}
                        <div class="text-sm text-gray-500">{product.description}</div>
                        {/if}
                    </div>
                    </TableCell>
                    <TableCell>
                    <div class="text-sm">
                        <div>{product.mainCategory}</div>
                        <div class="text-gray-500">{product.subCategory}</div>
                    </div>
                    </TableCell>
                    <TableCell>
                    {#if product.brandWebsite}
                        <a 
                        href={product.brandWebsite} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="hover:underline"
                        >
                        {product.brandName}
                        </a>
                    {:else}
                        {product.brandName}
                    {/if}
                    </TableCell>
                    <TableCell>
                    {#if product.currentPrice && product.currentPrice !== product.msrp}
                        <div class="text-sm">
                        <span class="font-medium">{formatCurrency(product.currentPrice)}</span>
                        <span class="text-gray-500 line-through ml-2">{formatCurrency(product.msrp)}</span>
                        </div>
                    {:else}
                        <span class="font-medium">{formatCurrency(product.msrp)}</span>
                    {/if}
                    </TableCell>
                    <TableCell class="text-right">
                    <div class="space-x-2">
                        {#if product.productLink}
                        <a
                            href={product.productLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-blue-600 hover:text-blue-800"
                        >
                            Official
                        </a>
                        {/if}
                        {#if product.affiliateLink}
                        <a
                            href={product.affiliateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-green-600 hover:text-green-800"
                        >
                            Buy
                        </a>
                        {/if}
                    </div>
                    </TableCell>
                </TableRow>
                {/each}
            </TableBody>
            </Table>
        </div>

    </div>
</div>
