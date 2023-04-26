<script lang="ts">
	import { enhance } from '$app/forms';
	import Uploader from '$lib/components/Uploader.svelte';
	import '../app.css';

	export let data;
</script>

<div class="h-screen flex flex-col">
	<nav class="flex justify-between items-center p-4 border-b">
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

	<main class="flex-1 p-4 pt-8 w-full max-w-2xl mx-auto">
		<slot />
	</main>

	{#if data.account}
		<footer class="flex justify-center items-center p-4 border-t">
			<Uploader />
		</footer>
	{/if}
</div>
