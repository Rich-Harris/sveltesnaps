<script lang="ts">
	import { enhance } from '$app/forms';
	import Avatar from '$lib/components/Avatar.svelte';
	import Login from '$lib/components/Login.svelte';
	import Uploader from '$lib/components/Uploader.svelte';
	import logo from '$lib/icons/logo.avif';
	import '../app.css';

	export let data;
</script>

<nav
	class="fixed top-0 w-full h-16 flex justify-between items-center px-4 py-2 z-10 border-b bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
>
	<a href="/" class="leading-5">
		<span>SVELTE</span><br />
		<span
			>SN<svg class="relative inline w-4 h-4 mx-[0.1em] -top-[0.1em]" viewBox="0 0 24 24">
				<g class="fill-black dark:fill-zinc-300">
					<path
						d="m1.8,9.66c.26,3.58.11,7.17-.48,10.71-.07.39.22.69.62.62,6.54-1.19,13.23-1.46,19.85-.83.2.02.45-.17.48-.37.38-2.22.66-4.45.85-6.69.1-1.18.16-2.36.2-3.54.02-.68.3-1.93-.44-2.34-.36-.19-.85-.11-1.24-.11-.56,0-1.13.04-1.69.02-.59-.02-.84-.54-1.18-.97s-.66-.86-.99-1.28c-.26-.34-.51-.73-.89-.95-.43-.26-.96-.25-1.45-.27-1.14-.06-2.28-.07-3.42-.02-.53.02-1.15-.03-1.65.17-.41.16-.66.51-.9.86-.72,1.06-1.34,2.18-1.88,3.35l.43-.25c-.6.03-1.19.06-1.79.1l.5.5c-.04-.4-.12-.78-.26-1.16-.09-.23-.24-.34-.48-.37l-1.47-.16c-.28-.03-.48.25-.5.5l-.09,1.31.63-.48c-.97-.27-1.96-.01-2.68.69-.46.45.25,1.16.71.71s1.08-.61,1.71-.44c.33.09.61-.16.63-.48l.09-1.31-.5.5,1.47.16-.48-.37c.11.29.2.58.23.89.03.26.21.52.5.5.6-.03,1.19-.06,1.79-.1.16,0,.36-.09.43-.25.52-1.13,1.11-2.23,1.81-3.25.23-.34.36-.5.77-.58.31-.06.66-.04.97-.05.57-.02,1.14-.03,1.71-.03.65,0,1.3.02,1.95.06.42.03.68.06.97.38.22.24.41.53.61.79.38.49.75.98,1.13,1.47.25.32.49.61.88.74.45.15.97.09,1.44.08.31,0,.61,0,.92-.01.08,0,.74-.05.71-.07.09.06,0,.79,0,.9,0,.33-.02.65-.03.98-.02.61-.05,1.22-.09,1.83-.16,2.6-.47,5.19-.91,7.77l.48-.37c-6.71-.64-13.48-.34-20.11.86l.62.62c.61-3.63.79-7.3.52-10.97-.05-.64-1.05-.64-1,0h0Z"
					/>
					<path
						d="m13.24,8.98c-1.71.15-3.61.75-4.43,2.4-.77,1.54-.22,3.44,1.09,4.49s3.42,1.5,4.87.62c.73-.45,1.25-1.21,1.73-1.89.51-.72.94-1.54.92-2.44-.02-1.06-.65-1.77-1.52-2.3-.92-.56-1.93-1.06-3.03-.99-.64.04-.64,1.04,0,1,.77-.05,1.47.25,2.13.62.55.31,1.22.65,1.38,1.32s-.13,1.35-.49,1.91-.78,1.15-1.27,1.61c-.97.93-2.67.66-3.73.02s-1.74-1.99-1.33-3.22c.5-1.51,2.26-2.03,3.67-2.16.64-.06.64-1.06,0-1h0Z"
					/>
				</g>
			</svg>PS</span
		>
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

<main class="flex-1 px-4 py-16 w-full max-w-4xl mx-auto dark:bg-zinc-900">
	<slot />
</main>

{#if data.user}
	<footer
		class="fixed bottom-0 w-full h-16 flex justify-center items-center border-t z-10 bg-white dark:bg-zinc-800 dark:border-zinc-700"
	>
		<Uploader />
	</footer>
{/if}
