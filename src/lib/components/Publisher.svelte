<script lang="ts">
	export let disabled: boolean;
</script>

<div class="relative flex w-full border-b border-zinc-200 focus-within:border-pink-600">
	<input
		class="w-full border-b border-zinc-200 resize-none py-2 pr-20 focus-visible:outline-none"
		name="description"
		required
		autocomplete="off"
		spellcheck="false"
		placeholder="add a description"
	/>

	<button
		{disabled}
		class="absolute w-16 h-full right-0 transition-opacity text-pink-600 focus-visible:outline-none focus-visible:bg-pink-100 opacity-0"
	>
		publish
	</button>
</div>

<style>
	input:valid + button {
		opacity: 1;
	}
</style>
