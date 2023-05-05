<script lang="ts">
	import type { PhotoListItem } from '$lib/types';
	import Comment from '../icons/Comment.svelte';
	import HeartOutline from '$lib/icons/HeartOutline.svelte';
	import Heart from '$lib/icons/Heart.svelte';

	export let photo: PhotoListItem;
</script>

<a class="flex items-center" href="/{photo.name}/{photo.id}">
	<span class="flex items-center gap-2">
		{photo.num_comments}
		<div class="w-4 h-4">
			<Comment />
		</div>

		{photo.num_likes}
		<div class="w-4 h-4">
			{#if photo.liked_by_user}<Heart />{:else}<HeartOutline />{/if}
		</div>
	</span>
</a>
