<script lang="ts">
	import { createEventDispatcher } from 'svelte';

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
	class="fixed w-screen h-screen bg-[#ffffff88] backdrop-blur-lg backdrop-grayscale-50 top-0 left-0 flex justify-center items-center z-10"
	on:click={(e) => {
		if (e.target === e.currentTarget) {
			dispatch('close');
		}
	}}
>
	<slot />
</div>
