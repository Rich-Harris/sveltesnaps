<script lang="ts">
	import { enhance } from '$app/forms';
	import AvatarImage from '$lib/components/AvatarImage.svelte';
	import Image from '$lib/components/Image.svelte';
	import Metadata from '$lib/components/Metadata.svelte';
	import Scroller from '$lib/components/Scroller.svelte';
	import { ago, now } from '$lib/utils.js';

	export let data;

	let scroller: Scroller;
	let loading = false;

	// TODO this doesn't work if you're scrolled all the
	// way to the bottom, for some reason
	export const snapshot = {
		capture: () => ({
			data,
			scroller: scroller.capture()
		}),
		restore: (values) => {
			data = values.data;
			scroller.restore(values.scroller);
		}
	};
</script>

<div class="fixed w-screen h-screen left-0 top-0 py-16">
	<Scroller
		bind:this={scroller}
		items={data.photos}
		on:more={async () => {
			if (loading || !data.next) return;
			loading = true;

			const response = await fetch(`/api/photos/${data.account.id}.json?start=${data.next}`);
			const { photos, next } = await response.json();

			data.photos = [...data.photos, ...photos];
			data.next = next;

			loading = false;
		}}
	>
		<div slot="header" class="max-w-2xl px-4 mx-auto">
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

		<div slot="item" class="max-w-2xl px-4 mx-auto" let:item>
			<div class="my-8">
				<a href="/{data.account.name}/{item.id}">
					<Image photo={item} />
				</a>

				<span class="flex text-sm mt-4 mb-2 h-8 justify-between gap-4 text-gray-500">
					<span class="flex items-center gap-2">
						<span>
							<span class="hidden sm:inline">posted</span>
							{ago(new Date(item.created_at), $now)}
						</span>
					</span>

					<Metadata photo={item} />
				</span>

				<span>{item.description}</span>
			</div>
		</div>

		<div slot="empty">
			<p>no photos yet!</p>
		</div>
	</Scroller>
</div>
