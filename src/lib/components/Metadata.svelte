<script lang="ts">
	import type { PhotoListItem } from '$lib/types';
	import Comment from '../icons/Comment.svelte';
	import HeartOutline from '$lib/icons/HeartOutline.svelte';
	import Heart from '$lib/icons/Heart.svelte';
	import { state } from '$lib/state.js';

	export let photo: PhotoListItem;
</script>

<a class="flex items-center" href="/{photo.name}/{photo.id}">
	<span class="flex items-center gap-2">
		{$state[photo.id].num_comments}
		<div class="w-4 h-4">
			<Comment />
		</div>

		{$state[photo.id].num_likes}
		<div class="w-4 h-4">
			{#if $state[photo.id].liked_by_user}<Heart />{:else}<HeartOutline />{/if}
		</div>
	</span>
</a>
