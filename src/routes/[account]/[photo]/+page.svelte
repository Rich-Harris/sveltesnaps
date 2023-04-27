<script lang="ts">
	import { enhance } from '$app/forms';
	import Avatar from '$lib/components/Avatar.svelte';
	import Image from '$lib/components/Image.svelte';
	import { ago, now } from '$lib/utils.js';
	import autosize from 'svelte-autosize';

	export let data;

	let pending = false;
	let comment = '';
	let deleting_ids: string[] = [];

	$: liked_by_user = data.likes.some((like) => like.name === data.user?.name);
</script>

<div class="flex items-center justify-between mb-4">
	<p>
		posted by <a class="text-pink-600" href="/{data.photo.name}">{data.photo.name}</a>
		{ago(data.photo.created_at, $now)}
	</p>

	{#if data.photo.name === data.user?.name}
		<form method="POST" action="?/delete_photo" use:enhance>
			<button class="bg-pink-600 text-white px-2 py-1 text-sm rounded-md">delete</button>
		</form>
	{/if}
</div>

<figure class="mb-4">
	<Image photo={data.photo} />
	<figcaption class="mt-4">{data.photo.description}</figcaption>
</figure>

<div class="flex items-center mb-8 gap-2">
	{#if data.user}
		<form
			method="POST"
			action="?/toggle_like"
			use:enhance={() => {
				if (liked_by_user) {
					data.likes = data.likes.filter((like) => like.name !== data.user?.name);
				} else {
					data.likes = [data.user, ...data.likes];
				}
			}}
		>
			<button
				aria-label={liked_by_user ? 'unlike' : 'like'}
				class="bg-no-repeat w-8 h-8"
				name="liked"
				value={liked_by_user ? 'false' : 'true'}
			/>
		</form>
	{/if}

	<p class="flex-1 text-gray-500 text-sm">
		{#if data.likes.length > 0}
			liked by {data.likes.length} {data.likes.length === 1 ? 'person' : 'people'}
		{:else if data.account}
			be the first to like this photo
		{/if}
	</p>
</div>

{#if data.user}
	<form
		class="relative flex mb-4 border-b border-slate-200 focus-within:border-pink-600"
		method="POST"
		action="?/post_comment"
		use:enhance={() => {
			pending = true;

			const account = data.user;
			if (!account) return; // for typescript

			data.comments = [
				{
					name: account?.name,
					avatar: account?.avatar,
					text: comment,
					id: '',
					created_at: new Date(),
					photo_id: data.photo.id
				},
				...data.comments
			];

			return ({ update }) => {
				pending = false;
				update();
			};
		}}
	>
		<textarea
			class="w-full h-10 resize-none p-2 pr-20 focus-visible:outline-none"
			name="text"
			placeholder="leave a comment"
			required
			bind:value={comment}
			use:autosize
			on:keydown={(e) => {
				if (e.key === 'Enter') {
					if (e.shiftKey || e.metaKey) return;

					e.preventDefault();
					e.target.parentNode.querySelector('button').click();
				}
			}}
		/>

		<button
			disabled={pending}
			class="absolute w-16 h-full right-0 transition-opacity text-pink-600 focus-visible:outline-none focus-visible:bg-pink-100"
			class:opacity-0={!comment}
		>
			post
		</button>
	</form>
{/if}

{#each data.comments.filter((comment) => !deleting_ids.includes(comment.id)) as comment}
	<article class="flex items-center gap-2 mb-2">
		<Avatar name={comment.name} avatar={comment.avatar} />

		<p class="flex-1">{comment.text}</p>

		{#if comment.name === data.user?.name}
			<form
				method="POST"
				action="?/delete_comment"
				use:enhance={() => {
					deleting_ids = [comment.id, ...deleting_ids];
					return async ({ update }) => {
						await update();
						deleting_ids = deleting_ids.filter((id) => id !== comment.id);
					};
				}}
			>
				<button name="id" value={comment.id} aria-label="delete" class="bg-no-repeat w-8 h-8" />
			</form>
		{/if}
	</article>
{/each}

<style>
	[aria-label='like'] {
		background-image: url($lib/icons/heart-outline.svg);
	}

	[aria-label='unlike'] {
		background-image: url($lib/icons/heart.svg);
	}

	[aria-label='delete'] {
		background-image: url($lib/icons/trash.svg);
	}
</style>
