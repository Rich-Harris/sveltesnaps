<script lang="ts">
	import { smoothload } from '$lib/actions';
	import type { Photo } from '$lib/types';

	export let photo: Photo;
</script>

<div
	class="relative bg-slate-100 mb-4 w-full rounded-md overflow-hidden shadow-xl"
	style="aspect-ratio: {photo.width / photo.height}"
>
	<img
		class="absolute left-0 top-0 w-full h-full"
		src={photo.url}
		alt={photo.description}
		use:smoothload
	/>
</div>
