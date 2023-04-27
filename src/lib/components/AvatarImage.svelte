<script lang="ts">
	import fallback from '$lib/icons/account-circle.svg';

	export let name: string;
	export let avatar: string | null;
	export let large = false;
</script>

<img
	class="inline aspect-square rounded-full"
	class:w-8={!large}
	class:w-12={large}
	alt={name}
	src={avatar ?? fallback}
/>
