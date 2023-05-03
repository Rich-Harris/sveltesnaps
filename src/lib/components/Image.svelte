<script lang="ts">
	import { smoothload } from '$lib/actions';
	import { optimize } from '$lib/image';
	import type { Photo } from '$lib/types';

	export let photo: Photo;
</script>

<div
	class="block relative bg-slate-100 w-full rounded-md overflow-hidden shadow-xl"
	style="aspect-ratio: {photo.width / photo.height}"
>
	{#key photo}
		<img
			class="absolute left-0 top-0 w-full h-full"
			src={optimize(photo.url)}
			alt={photo.description}
			use:smoothload
		/>
	{/key}
</div>
