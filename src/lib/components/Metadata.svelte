<script lang="ts">
	import type { PhotoDetails } from '$lib/types';
	import Comment from '../icons/Comment.svelte';
	import icon_likes from '$lib/icons/heart-outline.svg';
	import icon_liked from '$lib/icons/heart.svg';
	import HeartOutline from '$lib/icons/HeartOutline.svelte';
	import Heart from '$lib/icons/Heart.svelte';

	export let photo: PhotoDetails;
</script>

<a class="flex items-center" href="/{photo.name}/{photo.id}">
	<span class="flex items-center gap-2">
		{photo.num_comments}
		<div class="w-4 h-4">
			<Comment />
		</div>
		<!-- <img alt="comments" src={icon_comments} class="w-4 h-4" /> -->

		{photo.num_likes}
		<!-- <img alt="comments" src={photo.liked_by_user ? icon_liked : icon_likes} class="w-4 h-4" /> -->

		<div class="w-4 h-4">
			<Heart />
		</div>
	</span>
</a>
