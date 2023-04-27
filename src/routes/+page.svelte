<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import Image from '$lib/components/Image.svelte';
	import Login from '$lib/components/Login.svelte';
	import Metadata from '$lib/components/Metadata.svelte';
	import { ago, now } from '$lib/utils.js';

	export let data;
</script>

{#if data.photos}
	<h1 class="text-4xl mb-4">your feed</h1>

	{#each data.photos as photo}
		<div class="my-8">
			<a href="/{photo.name}/{photo.id}">
				<Image {photo} />
			</a>

			<span class="flex text-sm mt-4 mb-2 h-8 justify-between gap-4 text-gray-500">
				<span class="flex items-center gap-2">
					<Avatar name={photo.name} avatar={photo.avatar} full />

					<span>
						<span class="hidden sm:inline">posted</span>
						{ago(photo.created_at, $now)}
					</span>
				</span>

				<Metadata {photo} />
			</span>

			<span>{photo.description}</span>
		</div>
	{:else}
		<p>no photos yet. post some, and follow your friends!</p>
	{/each}
{:else}
	<Login>Log in</Login> to upload photos and see your friends' posts!
{/if}
