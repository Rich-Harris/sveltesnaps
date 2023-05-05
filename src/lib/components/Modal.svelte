<script lang="ts">
	import { trapfocus } from '$lib/actions';
	import { createEventDispatcher } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	const dispatch = createEventDispatcher();
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === 'Escape') {
			dispatch('close');
		}
	}}
/>

<!-- svelte-ignore a11y-click-events-have-key-events-->
<div
	class="fixed w-screen h-screen bg-[#ffffff88] dark:bg-[#00000088] backdrop-blur-lg backdrop-grayscale-50 top-0 left-0 z-30"
	use:trapfocus
	transition:fade={{ duration: 200 }}
>
	<div
		class="fixed w-screen h-screen flex justify-center items-center"
		transition:scale={{ start: 0.95, duration: 200 }}
		on:click={(e) => {
			if (e.target === e.currentTarget) {
				dispatch('close');
			}
		}}
	>
		<slot />
	</div>
</div>
