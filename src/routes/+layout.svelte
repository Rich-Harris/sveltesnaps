<script lang="ts">
	import { enhance } from '$app/forms';
	import '../app.css';

	export let data;
</script>

<nav class="flex justify-between items-center p-4 shadow-xl">
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

<main class="p-4 pt-8 max-w-2xl mx-auto">
	<slot />
</main>
