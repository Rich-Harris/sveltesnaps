<script lang="ts">
	import Login from '$lib/components/Login.svelte';
	import PhotoList from '$lib/components/PhotoList.svelte';
	import { get_photos_from_ids, set_latest } from '$lib/photos.js';

	export let data;

	let list: PhotoList;

	export const snapshot = {
		capture: () => ({
			ids: data.photos.map((p) => p.id),
			next: data.next,
			scroller: list?.capture()
		}),
		restore: (values) => {
			const photos = get_photos_from_ids(values.ids);
			if (!photos) {
				// Photos not found, which means this was after a page reload
				return;
			}

			data.photos = photos;
			data.next = values.next;

			if (values.scroller) {
				list.restore(values.scroller);
			}
		}
	};

	$: set_latest(data.photos);
</script>

{#if data.user}
	<div class="fixed w-screen h-screen left-0 top-0 py-16">
		<PhotoList
			bind:this={list}
			endpoint="/api/photos/feed.json"
			photos={data.photos}
			next={data.next}
			on:loaded={(e) => {
				data.photos = [...data.photos, ...set_latest(e.detail.photos)];
				data.next = e.detail.next;
			}}
		>
			<h1 slot="header" class="text-4xl mt-8 mb-4 text-center dark:text-zinc-300">your feed</h1>
			<p slot="empty" class="text-center">no photos yet. post some, and follow your friends!</p>
		</PhotoList>
	</div>
{:else}
	<div class="mt-12 text-center">
		<Login>Log in</Login> to upload photos and see your friends' posts!
	</div>
{/if}
