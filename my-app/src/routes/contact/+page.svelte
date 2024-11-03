<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
    // import * as Select from "$lib/components/ui/select";
	import { Toaster, toast } from 'svelte-sonner';

	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
    let topic = $state('');
	let message = $state('');
	let error = $state('');

	function handleSubmit() {
		error = '';
		if (!firstName || !lastName || !email || !topic || !message) {
			error = 'Please fill in all fields.';
			return;
		}
		// Here you would typically send the form data to a server
		console.log({ firstName, lastName, email, topic, message });
		// Reset form fields
		firstName = '';
		lastName = '';
		email = '';
        topic = '';
		message = '';
		// Show success message
		toast.success('Message sent successfully!');
	}

</script>

<div class="container max-w-[1024px] space-y-12 py-12">
	<div class="space-y-3">
		<h1 class="text-3xl font-bold tracking-tighter md:text-4xl">Contact</h1>
		<p class="text-sm text-muted-foreground font-mono ">
			Please leave a message if you find any bugs or if you would like to recommend a "buy it for life" product, brand or category that is still missing from the database. We will check it and get back to you as soon as possible.
		</p>
		<div class="flex space-x-3 pt-1">
   
		</div>
    <Card class="mx-auto w-full max-w-md">
        <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription class="font-mono">Please fill out the form and provide as many details as possible and/or necessary. Thank you</CardDescription>
        </CardHeader>
        <CardContent>
            <form onsubmit={handleSubmit}>
                <div class="grid w-full items-center gap-4">
                    <div class="flex flex-col space-y-1.5">
                        <Label for="firstName">First Name</Label>
                        <Input id="firstName" bind:value={firstName} placeholder="John" />
                    </div>
                    <div class="flex flex-col space-y-1.5">
                        <Label for="lastName">Last Name</Label>
                        <Input id="lastName" bind:value={lastName} placeholder="Doe" />
                    </div>
                    <div class="flex flex-col space-y-1.5">
                        <Label for="email">Email</Label>
                        <Input id="email" type="email" bind:value={email} placeholder="john.doe@example.com" />
                    </div>
                    <div class="flex flex-col space-y-1.5">
                        <Label for="topic">Topic</Label>
                        <Input id="topic" bind:value={topic} placeholder="Other" />
                    </div>
                    <!--<Select.Root>
                        <Select.Trigger class="w-[180px]">
                          <Select.Value placeholder="Select a Topic" />
                        </Select.Trigger>
                        <Select.Content>
                          <Select.Item value="brands">Brands</Select.Item>
                          <Select.Item value="products">Products</Select.Item>
                          <Select.Item value="bug">Bug</Select.Item>
                          <Select.Item value="other">Other</Select.Item>
                        </Select.Content>
                    </Select.Root>-->
                    <div class="flex flex-col space-y-1.5">
                        <Label for="message">Message</Label>
                        <Textarea id="message" bind:value={message} placeholder="Your message here..." />
                    </div>
                </div>
            </form>
        </CardContent>
        <CardFooter class="flex justify-between">
            {#if error}
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            {/if}
            <Button onclick={handleSubmit} class="w-full">Submit</Button>
        </CardFooter>
    </Card>
    </div>
</div>


<Toaster />
