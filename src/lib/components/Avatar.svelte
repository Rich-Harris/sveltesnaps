<script lang="ts">
	import AvatarImage from './AvatarImage.svelte';

	export let name: string;
	export let avatar: string | null;
	export let full = false;
</script>

<a class="flex items-center gap-2 text-pink-600" href="/{name}">
	<AvatarImage {name} {avatar} />
	{#if full}
		{name}
	{/if}
</a>
