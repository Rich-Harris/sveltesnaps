<script lang="ts">
	import { enhance } from '$app/forms';
	import AvatarImage from '$lib/components/AvatarImage.svelte';
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
			if (!values?.ids) {
				return;
			}

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

<div class="fixed w-screen h-screen left-0 top-0 py-16">
	<PhotoList
		bind:this={list}
		endpoint="/api/photos/{data.account.id}.json"
		photos={data.photos}
		next={data.next}
		on:loaded={(e) => {
			data.photos = [...data.photos, ...set_latest(e.detail.photos)];
			data.next = e.detail.next;
		}}
	>
		<div slot="header">
			<h1 class="text-4xl mt-8 mb-4 flex items-center gap-4">
				<AvatarImage name={data.account.name} avatar={data.account.avatar} large />
				posts by {data.account.name}
			</h1>

			{#if data.user && data.account.id !== data.user.id}
				<form
					class="mb-8"
					method="POST"
					action="?/toggle_follow"
					use:enhance={(e) => {
						data.account.followed_by_user = !data.account.followed_by_user;
					}}
				>
					<input name="id" type="hidden" value={data.account.id} />

					<button
						name="followed"
						value={data.account.followed_by_user ? 'false' : 'true'}
						class="bg-pink-600 text-white px-4 py-2 rounded-md"
					>
						{#if data.account.followed_by_user}
							unfollow
						{:else}
							follow
						{/if}
					</button>
				</form>
			{/if}
		</div>

		<p slot="empty">no photos yet!</p>
	</PhotoList>
</div>
