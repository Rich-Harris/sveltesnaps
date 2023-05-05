<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import Login from '$lib/components/Login.svelte';
	import PhotoList from '$lib/components/PhotoList.svelte';

	export let data;

	let list: PhotoList;
	let can_restore = false;

	afterNavigate((navigation) => {
		can_restore = navigation.type === 'popstate';
	});

	export const snapshot = {
		capture: () => ({
			data,
			scroller: list?.capture()
		}),
		restore: (values) => {
			if (!can_restore) return;

			data.photos = values.data.photos;
			data.next = values.data.next;

			if (values.scroller) {
				list.restore(values.scroller);
			}
		}
	};
</script>

{#if data.user}
	<div class="fixed w-screen h-screen left-0 top-0 py-16">
		<PhotoList
			bind:this={list}
			endpoint="/api/photos/feed.json"
			photos={data.photos}
			next={data.next}
			on:loaded={(e) => {
				data.photos = [...data.photos, ...e.detail.photos];
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
