<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import Image from '$lib/components/Image.svelte';
	import Metadata from '$lib/components/Metadata.svelte';
	import Scroller from '$lib/components/Scroller.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import PhotoPage from '../../routes/[account]/[photo]/+page.svelte';
	import { getStateContext } from '$lib/state.js';
	import { ago, now } from '$lib/utils.js';
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	import { goto, preloadData, pushState } from '$app/navigation';
	import type { PhotoListItem } from '$lib/types';

	export let photos: PhotoListItem[];
	export let next: string | null;
	export let endpoint: string;

	export function capture() {
		return scroller.capture();
	}

	export function restore(values: any) {
		scroller.restore(values);
	}

	const dispatch = createEventDispatcher();
	const { init_photos } = getStateContext();

	let scroller: Scroller;
	let loading = false;

	$: init_photos(photos);
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
				on:click={async (e) => {
					if (e.metaKey || innerWidth < 640) return;

					e.preventDefault();

					const { href } = e.currentTarget;

					const result = await preloadData(href);
					if (result.type === 'loaded' && result.status === 200) {
						pushState({ selected: result.data }, href);
					} else {
						// something bad happened! try navigating
						goto(href);
					}
				}}
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

{#if $page.state.selected}
	<Modal on:close={() => history.back()}>
		<div class="w-screen height-screen max-w-4xl max-h-[144rem] p-8">
			<div class="flex flex-col bg-white dark:bg-zinc-800 shadow-xl p-8 w-sc rounded-md">
				<PhotoPage data={$page.state.selected} />
			</div>
		</div>
	</Modal>
{/if}
