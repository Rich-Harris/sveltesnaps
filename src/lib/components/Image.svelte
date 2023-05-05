<script lang="ts">
	import { smoothload } from '$lib/actions';
	import { optimize } from '$lib/image';
	import type { Photo } from '$lib/types';

	export let photo: Photo;
</script>

<div
	class="block relative bg-zinc-100 w-full rounded-md overflow-hidden shadow-xl dark:bg-zinc-800"
	style="aspect-ratio: {photo.width / photo.height}"
>
	{#key photo.id}
		<img
			class="absolute left-0 top-0 w-full h-full"
			srcset={optimize(photo.url)}
			alt={photo.description}
			use:smoothload
		/>
	{/key}
</div>
