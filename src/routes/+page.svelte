<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import Image from '$lib/components/Image.svelte';
	import { ago } from '$lib/utils.js';

	export let data;

	let now = new Date();
</script>

{#if data.photos}
	<h1 class="text-4xl mb-4">your feed</h1>

	{#each data.photos as photo}
		<a class="block mb-8 mt-8" href="/{photo.name}/{photo.id}">
			<Image {photo} />

			<div class="flex">
				<span class="flex items-center gap-2 text-sm text-gray-500 mb-2">
					<Avatar name={photo.name} avatar={photo.avatar} full />

					posted {ago(photo.created_at, now)}
				</span>

				<div class="">
					<!-- TODO add like button -->
				</div>
			</div>

			<div class="flex">
				<!-- TODO truncate long lines with ellipsis -->
				<span>{photo.description}</span>

				<div class="">
					<!-- TODO add like button -->
				</div>
			</div>
		</a>
	{:else}
		<p>no photos yet. post some, and follow your friends!</p>
	{/each}
{/if}
