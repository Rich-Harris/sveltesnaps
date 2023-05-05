<script>
	import { enhance } from '$app/forms';
	import Image from '$lib/components/Image.svelte';

	export let data;

	let description = '';
	let pending = false;
</script>

<div class="max-w-2xl mt-12 px-4 mx-auto">
	<h1 class="text-4xl mt-8 mb-4">publish your photo</h1>

	<form
		class="my-4"
		method="POST"
		use:enhance={() => {
			pending = true;
			return async ({ update }) => {
				await update();
				pending = false;
			};
		}}
	>
		<div class="relative flex w-full border-b border-zinc-200 focus-within:border-pink-600">
			<input
				class="w-full border-b border-zinc-200 resize-none py-2 pr-20 focus-visible:outline-none"
				name="description"
				required
				autocomplete="off"
				spellcheck="false"
				placeholder="add a description"
				bind:value={description}
			/>

			<button
				disabled={pending}
				class="absolute w-16 h-full right-0 transition-opacity text-pink-600 focus-visible:outline-none focus-visible:bg-pink-100 opacity-0"
			>
				publish
			</button>
		</div>
	</form>

	<Image photo={data.photo} />
</div>

<style>
	input:valid + button {
		opacity: 1;
	}
</style>
