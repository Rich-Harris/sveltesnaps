<script lang="ts">
	import type { PhotoDetails } from '$lib/types';
	import icon_comments from '$lib/icons/comment-outline.svg';
	import icon_likes from '$lib/icons/heart-outline.svg';
	import icon_liked from '$lib/icons/heart.svg';

	export let photo: PhotoDetails;
</script>

<div class="flex items-center gap-2">
	{photo.num_comments}
	<img alt="comments" src={icon_comments} class="w-4 h-4" />

	{photo.num_likes}
	<img alt="comments" src={photo.liked_by_user ? icon_liked : icon_likes} class="w-4 h-4" />
</div>
