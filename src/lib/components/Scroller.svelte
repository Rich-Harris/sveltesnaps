<script lang="ts">
	import { onMount } from 'svelte';

	export let items: any[];

	let viewport: HTMLDivElement;
	let scroller: HTMLDivElement;
	let content: HTMLDivElement;

	let a = 0;
	let b = items.length;
	let offset = 0;
	let top = 0;
	let bottom = 0;

	const heights: number[] = [];

	function measure(node: HTMLDivElement, id: number) {
		heights[id] = node.clientHeight;
	}

	function handle_resize() {
		// TODO invalidate heights?
		offset = content.offsetTop;
		handle_scroll();
	}

	function handle_scroll() {
		const scroll = scroller.scrollTop;
		const height = viewport.clientHeight;

		let i = 0;
		let acc = 0;

		for (; i < heights.length; i += 1) {
			if (acc + heights[i] > scroll - offset) {
				a = i;
				break;
			}
			acc += heights[i];
		}

		for (; i <= heights.length; i += 1) {
			if (acc >= scroll + height - offset + 200) {
				b = i;
				break;
			}
			acc += heights[i];
		}

		top = heights.slice(0, a).reduce((a, b) => a + b, 0);
		bottom = heights.slice(b).reduce((a, b) => a + b, 0);
	}

	onMount(handle_resize);
</script>

<svelte:window on:resize={handle_resize} />

<div bind:this={viewport} class="w-full h-full overflow-hidden">
	<div
		bind:this={scroller}
		class="w-full h-full overflow-y-scroll"
		style="overflow-anchor: none"
		on:scroll={handle_scroll}
	>
		<slot name="header" />

		<div bind:this={content} style:padding-top="{top}px" style:padding-bottom="{bottom}px">
			{#each items.slice(a, b) as item, i (item)}
				<div class="flow-root" data-item-id={a + i} use:measure={a + i}>
					<slot name="item" {item} />
				</div>
			{:else}
				<slot name="empty" />
			{/each}
		</div>
	</div>
</div>
