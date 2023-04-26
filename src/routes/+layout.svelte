<script lang="ts">
	import { enhance } from '$app/forms';
	import Uploader from '$lib/components/Uploader.svelte';
	import '../app.css';

	export let data;
</script>

<nav class="fixed top-0 w-full flex justify-between items-center p-4 border-b bg-white z-10">
	<a href="/">SvelteSnaps</a>

	<div class="flex gap-2 items-center">
		{#if data.account}
			<form method="POST" action="/auth?/logout" use:enhance>
				<button>log out</button>
			</form>

			<a href="/{data.account.name}">
				<img
					class="w-8 h-8 rounded-full"
					alt={data.account.name}
					src="{data.account.avatar}?size=64"
				/>
			</a>
		{:else}
			<form method="POST" action="/auth?/login" use:enhance>
				<button>log in</button>
			</form>
		{/if}
	</div>
</nav>

<main class="flex-1 px-4 py-24 w-full max-w-2xl mx-auto">
	<slot />
</main>

{#if data.account}
	<footer class="fixed bottom-0 w-full flex justify-center items-center p-4 border-t bg-white z-10">
		<Uploader />
	</footer>
{/if}
