<script lang="ts">
	import { enhance } from '$app/forms';
	import { navigating } from '$app/stores';
	import AvatarImage from '$lib/components/AvatarImage.svelte';
	import PhotoList from '$lib/components/PhotoList.svelte';

	export let data;

	let list: PhotoList;
	let can_restore = false;

	$: if ($navigating) {
		can_restore = $navigating.type === 'popstate';
	}

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

<div class="fixed w-screen h-screen left-0 top-0 pt-16">
	<PhotoList
		bind:this={list}
		endpoint="/api/photos/{data.account.id}.json"
		photos={data.photos}
		next={data.next}
		on:loaded={(e) => {
			data.photos = [...data.photos, ...e.detail.photos];
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
