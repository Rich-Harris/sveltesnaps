<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import Image from '$lib/components/Image.svelte';
	import Metadata from '$lib/components/Metadata.svelte';
	import Scroller from '$lib/components/Scroller.svelte';
	import type { PhotoDetails } from '$lib/types';
	import { ago, now } from '$lib/utils.js';
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';

	export let photos: PhotoDetails[];
	export let next: string | null;
	export let endpoint: string;

	export function capture() {
		return scroller.capture();
	}

	export function restore(values: any) {
		scroller.restore(values);
	}

	const dispatch = createEventDispatcher();

	let scroller: Scroller;
	let loading = false;
</script>

<Scroller
	bind:this={scroller}
	items={photos}
	on:more={async () => {
		if (loading || !next) return;
		loading = true;

		const response = await fetch(`${endpoint}?start=${next}`);
		const result = await response.json();

		dispatch('loaded', result);

		loading = false;
	}}
>
	<div slot="header" class="max-w-2xl px-4 mx-auto">
		<slot name="header" />
	</div>

	<div slot="item" class="max-w-2xl px-4 mx-auto" let:item let:i>
		<div class="my-8">
			<a
				href="/{item.name}/{item.id}"
				class="block"
				style="transform: rotate({0.5 + 1 * (i % 2 ? -1 : 1)}deg)"
			>
				<Image photo={item} />
			</a>

			<span class="flex text-sm mt-4 mb-2 h-8 justify-between gap-4 text-gray-500">
				<span class="flex items-center gap-2">
					<Avatar name={item.name} avatar={item.avatar} full />

					<span>
						<span class="hidden sm:inline">posted</span>
						{ago(new Date(item.created_at), $now)}
					</span>
				</span>

				<Metadata photo={item} />
			</span>

			<span>{item.description}</span>
		</div>
	</div>

	<div slot="empty">
		<slot name="empty" />
	</div>

	<div slot="footer" class="max-w-2xl px-4 mb-8 mx-auto text-right">
		{#if next}
			<a class="text-pink-600" href="{$page.url.pathname}?start={next}">next page</a>
		{/if}
	</div>
</Scroller>
