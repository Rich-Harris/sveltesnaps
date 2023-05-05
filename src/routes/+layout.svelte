<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Avatar from '$lib/components/Avatar.svelte';
	import Login from '$lib/components/Login.svelte';
	import Uploader from '$lib/components/Uploader.svelte';
	import Logo from '$lib/icons/Logo.svelte';
	import '../app.css';

	export let data;
</script>

<nav
	class="fixed top-0 w-full h-16 flex justify-between items-center px-4 py-2 z-10 border-b bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
>
	<a href="/" class="leading-5" aria-label="SvelteSnaps">
		<span>SVELTE</span><br />
		<span>SN<Logo />PS</span>
	</a>

	<div class="flex gap-2 items-center">
		{#if data.user}
			<form method="POST" action="/auth?/logout" use:enhance>
				<button>log out</button>
			</form>

			<Avatar name={data.user.name} avatar={data.user.avatar} />
		{:else}
			<Login />
		{/if}
	</div>
</nav>

<main class="flex-1 px-4 pt-16 w-full max-w-4xl mx-auto dark:bg-zinc-900">
	<slot />
</main>

{#if data.user && $page.url.pathname !== '/publish'}
	<Uploader />
{/if}
