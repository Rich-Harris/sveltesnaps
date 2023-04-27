<script lang="ts">
	import { enhance } from '$app/forms';
	import Image from '$lib/components/Image.svelte';

	export let data;
</script>

<h1 class="text-4xl mb-4">posts by {data.account.name}</h1>

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
	<a class="block mb-8 mt-8" href="/{data.account.name}/{photo.id}">
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
