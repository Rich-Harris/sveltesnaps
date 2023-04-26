<script lang="ts">
	import Image from '$lib/components/Image.svelte';

	export let data;
</script>

<h1 class="text-4xl mb-8">posts by {data.account.name}</h1>

{#each data.photos as photo}
	<a class="block mb-8" href="/{data.account.name}/{photo.id}">
		<Image {photo} />
		<div class="flex">
			<!-- TODO truncate long lines with ellipsis -->
			<span>{photo.description}</span>

			<div class="">
				<!-- TODO add like button -->
			</div>
		</div>
	</a>
{/each}
