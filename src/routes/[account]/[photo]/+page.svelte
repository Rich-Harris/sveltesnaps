<script lang="ts">
	import { enhance } from '$app/forms';
	import Avatar from '$lib/components/Avatar.svelte';
	import Image from '$lib/components/Image.svelte';
	import Heart from '$lib/icons/Heart.svelte';
	import HeartOutline from '$lib/icons/HeartOutline.svelte';
	import Trash from '$lib/icons/Trash.svelte';
	import { getStateContext } from '$lib/state.js';
	import { ago, now } from '$lib/utils.js';
	import autosize from 'svelte-autosize';

	export let data;

	let pending = false;
	let deleting_ids: string[] = [];

	sync();

	const { update_photo } = getStateContext();

	function sync() {
		update_photo(data.photo, data.comments, data.likes, data.user);
	}

	$: liked_by_user = data.likes.some((like) => like.name === data.user?.name);
</script>

<div class="flex items-center justify-between mt-12 mb-4">
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

<div class="mb-4">
	<Image photo={data.photo} />
	<p class="mt-4">{data.photo.description}</p>
</div>

<div class="flex items-center mb-8 gap-2">
	{#if data.user}
		<form
			method="POST"
			action="?/toggle_like"
			use:enhance={() => {
				const { likes, user } = data;

				if (liked_by_user) {
					data.likes = likes.filter((like) => like.name !== user?.name);
				} else {
					data.likes = [user, ...likes];
				}

				sync();

				return ({ result }) => {
					if (result.type !== 'success') {
						data.likes = likes;
						sync();
					}
				};
			}}
		>
			<button
				aria-label={liked_by_user ? 'unlike' : 'like'}
				class="bg-no-repeat w-8 h-8"
				name="liked"
				value={liked_by_user ? 'false' : 'true'}
			>
				{#if liked_by_user}<Heart />{:else}<HeartOutline />{/if}
			</button>
		</form>
	{/if}

	<p class="flex-1 text-gray-500 text-sm">
		{#if data.likes.length > 0}
			liked by {data.likes.length} {data.likes.length === 1 ? 'person' : 'people'}
		{:else if data.user}
			be the first to like this photo
		{/if}
	</p>
</div>

{#if data.user}
	<form
		class="relative flex mb-4 border-b border-zinc-200 focus-within:border-pink-600 dark:border-zinc-700"
		method="POST"
		action="?/post_comment"
		use:enhance={({ form, data: formData }) => {
			pending = true;

			const account = data.user;
			if (!account) return; // for typescript

			const comment = {
				name: account?.name,
				avatar: account?.avatar,
				text: formData.get('text'),
				id: '',
				created_at: new Date(),
				photo_id: data.photo.id
			};

			// @ts-ignore
			data.comments = [comment, ...data.comments];
			sync();

			form.reset();

			return ({ result, update }) => {
				pending = false;

				if (result.type === 'success') {
					comment.id = result.data.id;
					data.comments = data.comments;
				} else {
					update();
					sync();
				}
			};
		}}
	>
		<textarea
			class="w-full h-10 resize-none p-2 pr-20 focus-visible:outline-none dark:bg-zinc-800"
			name="text"
			placeholder="leave a comment"
			required
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
			class="absolute w-16 h-full right-0 transition-opacity text-pink-600 focus-visible:outline-none focus-visible:bg-pink-100 opacity-0"
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
					return async ({ result, update }) => {
						if (result.type === 'success') {
							data.comments = data.comments.filter((c) => c.id !== comment.id);
							sync();
						} else {
							await update();
						}

						deleting_ids = deleting_ids.filter((id) => id !== comment.id);
					};
				}}
			>
				<button name="id" value={comment.id} aria-label="delete" class="bg-no-repeat w-8 h-8">
					<Trash />
				</button>
			</form>
		{/if}
	</article>
{/each}

<style>
	textarea:valid + button {
		opacity: 1;
	}
</style>
