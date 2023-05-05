<script lang="ts">
	import { createEventDispatcher, onMount, tick } from 'svelte';

	export let items: any[];

	export function capture() {
		const scroll = scroller.scrollTop;
		return { a, b, top, bottom, heights, scroll };
	}

	export async function restore(state: {
		a: number;
		b: number;
		top: number;
		bottom: number;
		heights: number[];
		scroll: number;
	}) {
		a = state.a;
		b = state.b;
		top = state.top;
		bottom = state.bottom;
		heights = state.heights;

		await tick();
		scroller.scrollTo(0, state.scroll);
	}

	const dispatch = createEventDispatcher();

	let viewport: HTMLDivElement;
	let scroller: HTMLDivElement;
	let content: HTMLDivElement;

	let a = 0;
	let b = items.length;
	let offset = 0;
	let top = 0;
	let bottom = 0;
	let heights: number[] = [];

	$: average = heights.reduce((a, b) => a + b, 0) / heights.length;

	function measure(node: HTMLDivElement, id: number) {
		const height = node.clientHeight;
		const current_height = heights[id];

		if (current_height !== height) {
			if (current_height !== undefined) {
				// adjust scroll to account for resized image
				if (node.getBoundingClientRect().top < scroller.getBoundingClientRect().top) {
					scroller.scrollTop += height - current_height;
				}
			}

			heights[id] = height;
		}
	}

	function handle_resize() {
		offset = content.offsetTop;
		handle_scroll();
	}

	function handle_scroll() {
		let i = 0;
		let acc = 0;

		for (; i < items.length; i += 1) {
			const height = heights[i] ?? average;

			if (acc + height > scroller.scrollTop - offset) {
				a = i;
				top = acc;
				break;
			}
			acc += height;
		}

		for (; i <= items.length; i += 1) {
			if (acc >= scroller.scrollTop + viewport.clientHeight - offset + 200) {
				b = i;
				break;
			}
			acc += heights[i] ?? average;
		}

		bottom = 0;
		for (; i < items.length; i += 1) {
			bottom += heights[i] ?? average;
		}

		const remaining = scroller.scrollHeight - (scroller.scrollTop + viewport.clientHeight);
		if (remaining < 500) {
			dispatch('more');
		}
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
					<slot name="item" {item} i={a + i} />
				</div>
			{:else}
				<slot name="empty" />
			{/each}
		</div>

		<slot name="footer" />
	</div>
</div>
