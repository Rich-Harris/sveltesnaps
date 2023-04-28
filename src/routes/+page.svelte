<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import Image from '$lib/components/Image.svelte';
	import Login from '$lib/components/Login.svelte';
	import Metadata from '$lib/components/Metadata.svelte';
	import Scroller from '$lib/components/Scroller.svelte';
	import { ago, now } from '$lib/utils.js';

	export let data;

	let scroller: Scroller;
	let loading = false;

	export const snapshot = {
		capture: () => ({
			data,
			scroller: scroller.capture()
		}),
		restore: (values) => {
			data = values.data;
			scroller.restore(values.scroller);
		}
	};
</script>

{#if data.photos}
	<div class="fixed w-screen h-screen left-0 top-0 py-16">
		<Scroller
			bind:this={scroller}
			items={data.photos}
			on:more={async () => {
				if (loading || !data.next) return;
				loading = true;

				console.log('!!!');

				const response = await fetch(`/api/photos/feed.json?start=${data.next}`);
				const { photos, next } = await response.json();

				data.photos = [...data.photos, ...photos];
				data.next = next;

				loading = false;
			}}
		>
			<div slot="header" class="max-w-2xl px-4 mx-auto">
				<h1 class="text-4xl mt-8 mb-4 flex items-center gap-4">your feed</h1>
			</div>

			<div slot="item" class="max-w-2xl px-4 mx-auto" let:item>
				<div class="my-8">
					<a href="/{item.name}/{item.id}">
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
				<p>no photos yet. post some, and follow your friends!</p>
			</div>
		</Scroller>
	</div>
{:else}
	<div class="mt-12 text-center">
		<Login>Log in</Login> to upload photos and see your friends' posts!
	</div>
{/if}
