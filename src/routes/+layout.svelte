<script lang="ts">
	import { enhance } from '$app/forms';
	import Avatar from '$lib/components/Avatar.svelte';
	import Login from '$lib/components/Login.svelte';
	import Uploader from '$lib/components/Uploader.svelte';
	import logo from '$lib/icons/logo.avif';
	import '../app.css';

	export let data;
</script>

<nav class="fixed top-0 w-full flex justify-between items-center px-4 py-2 border-b bg-white z-10">
	<a href="/"><img class="w-12 h-12" alt="SvelteSnaps" src={logo} /></a>

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

<main class="flex-1 px-4 py-24 w-full max-w-2xl mx-auto">
	<slot />
</main>

{#if data.user}
	<footer class="fixed bottom-0 w-full flex justify-center items-center p-4 border-t bg-white z-10">
		<Uploader />
	</footer>
{/if}
