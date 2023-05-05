<script>
	import { enhance } from '$app/forms';
	import Image from '$lib/components/Image.svelte';
	import Publisher from '$lib/components/Publisher.svelte';

	export let data;

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
		<Publisher disabled={pending} />
	</form>

	<Image photo={data.photo} />
</div>
