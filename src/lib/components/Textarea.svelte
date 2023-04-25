<script lang="ts">
	export let value = '';
</script>

<div class="relative">
	<pre aria-hidden="true">{value + '\n'}</pre>
	<textarea bind:value />
</div>

<style>
	pre,
	textarea {
		font-family: inherit;
		padding: 0.5em;
		box-sizing: border-box;
		border: 1px solid #eee;
		line-height: 1.2;
		min-height: 1.2em;
		overflow: hidden;
	}

	textarea {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		resize: none;
	}
</style>
