<script lang="ts">
	import fallback from '$lib/icons/account-circle.svg';

	export let name: string;
	export let avatar: string | null;
	export let full = false;
</script>

<a class="flex items-center gap-2 text-pink-600" href="/{name}">
	<img class="w-8 h-8 rounded-full" alt={name} src={avatar ?? fallback} />
	{#if full}
		{name}
	{/if}
</a>
