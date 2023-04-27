<script lang="ts">
	import { enhance } from '$app/forms';
	import AvatarImage from '$lib/components/AvatarImage.svelte';
	import Image from '$lib/components/Image.svelte';
	import Metadata from '$lib/components/Metadata.svelte';
	import { ago, now } from '$lib/utils.js';

	export let data;
</script>

<h1 class="text-4xl mb-4 flex items-center gap-4">
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

{#each data.photos as photo}
	<div class="my-8">
		<a href="/{photo.name}/{photo.id}">
			<Image {photo} />
		</a>

		<span class="flex text-sm my-4 h-8 justify-between gap-4 text-gray-500">
			<span class="flex items-center gap-2">
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
	<p>no photos yet!</p>
{/each}
