<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let file: File | undefined;
	let pending = false;

	let show = false;

	$: src = file ? URL.createObjectURL(file) : undefined;
</script>

<svelte:window
	on:popstate={(e) => {
		show = !!e.state['uploader:show'];
	}}
	on:keydown={(e) => {
		if (show && e.key === 'Escape') {
			history.back();
		}
	}}
/>

<form
	class="relative w-full h-full"
	method="POST"
	action="/?/post"
	enctype="multipart/form-data"
	use:enhance={() => {
		pending = true;

		return async ({ result, update }) => {
			if (result.type === 'redirect') {
				// prevent back navigation from reopening modal
				history.replaceState({}, '');

				await goto(result.location, {
					replaceState: true
				});
			} else {
				// TODO handle network errors
			}

			pending = false;
			file = undefined;
			show = false;
		};
	}}
>
	<!-- svelte-ignore a11y-click-events-have-key-events-->
	<div
		class="fixed w-screen h-screen bg-[#ffffff88] backdrop-blur-lg backdrop-grayscale-50 top-0 left-0 flex justify-center items-center z-10"
		class:hidden={!show}
		on:click={(e) => {
			if (show && e.target === e.currentTarget) {
				history.back();
			}
		}}
	>
		<div class="w-screen height-screen max-w-2xl max-h-[144rem] p-8">
			<div class="flex flex-col bg-white shadow-xl p-8 w-sc rounded-md">
				<img class="flex-1 mb-4 object-contain" alt="Preview" {src} />

				<div class="relative flex w-full border-b border-zinc-200 focus-within:border-pink-600">
					<input
						class="w-full border-b border-zinc-200 resize-none p-2 pr-20 focus-visible:outline-none"
						name="description"
						autocomplete="off"
						spellcheck="false"
						placeholder="enter a description"
						required={browser}
					/>

					<button
						disabled={pending}
						class="absolute w-16 h-full right-0 transition-opacity text-pink-600 focus-visible:outline-none focus-visible:bg-pink-100 opacity-0"
					>
						upload
					</button>
				</div>
			</div>
		</div>
	</div>

	<label
		class="absolute left-0 top-0 w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800"
	>
		<svg
			class="relative w-24 h-24 p-6 -top-1 rounded-full bg-zinc-100 dark:bg-zinc-800"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
		>
			<g class="fill-zinc-800 dark:fill-zinc-300">
				<path
					d="m4.45,11.91c-.11,2.21-.36,4.41-.75,6.59-.05.27.07.53.35.62.58.17,1.19.06,1.78.02.7-.04,1.39-.07,2.09-.09,1.38-.03,2.76-.03,4.13-.01,2.74.02,5.48.07,8.22-.15.27-.02.5-.21.5-.5,0-3.59-.37-7.17-.38-10.76,0-.2-.15-.45-.37-.48-.98-.14-1.95-.2-2.93-.15l.35.15c-.37-.4-.43-.98-.68-1.44-.28-.53-.74-.85-1.33-.97-1.49-.3-3.17-.19-4.69-.16-.29,0-.47.23-.5.5-.06.52-.71.93-.91,1.41-.25.59.61,1.1.86.5.32-.75.95-1.05,1.05-1.92l-.5.5c.95-.02,1.9-.01,2.85.02.46.02.93.02,1.39.08.56.07.8.26,1.01.77.19.48.36,1.27.9,1.51.32.14.9.02,1.24.02.54.01,1.08.05,1.61.13l-.37-.48c0,3.59.37,7.17.38,10.76l.5-.5c-2.66.21-5.32.18-7.98.15-1.3-.01-2.6-.02-3.9,0-.66.01-1.32.03-1.98.07s-1.46.23-2.09.05l.35.62c.41-2.27.68-4.55.79-6.85.03-.64-.97-.64-1,0h0Z"
				/>
				<path
					d="m13.65,9.35c-1.33.14-2.92-.37-3.98.74-.53.56-.58,1.31-.56,2.04s.23,1.39.67,2c.84,1.13,2.16,1.92,3.6,1.62,1.37-.29,2.2-1.64,2.23-2.97s-.78-3.43-2.43-3.34c-.64.03-.64,1.03,0,1,.95-.05,1.38,1.31,1.43,2.06.06.9-.34,1.93-1.27,2.24-1,.33-1.99-.25-2.62-1-.34-.41-.58-.86-.61-1.4-.03-.46-.09-1.07.2-1.46.27-.36.79-.5,1.21-.52.71-.05,1.41.08,2.12.01.27-.03.5-.21.5-.5,0-.25-.23-.53-.5-.5h0Z"
				/>
				<path d="m4.66,4.37l-.09,5.02c-.01.64.99.64,1,0l.09-5.02c.01-.64-.99-.64-1,0h0Z" />
				<path d="m2.54,7.39h5.33c.64,0,.64-1,0-1H2.54c-.64,0-.64,1,0,1h0Z" />
				<path
					d="m17.33,9.54s-.01,0-.02,0c-.04,0-.1.01-.14.02,0,0,0,0-.01,0-.05.01-.11.04-.16.06-.04.02-.1.07-.13.09-.01,0-.02.02-.03.03-.03.04-.07.08-.1.13-.03.05-.05.1-.07.16,0,.01,0,.02,0,.04,0,.04-.01.09-.02.14,0,0,0,0,0,.01,0,0,0,.01,0,.02,0,.05,0,.11.02.17s.04.11.07.15c.06.09.13.17.23.22.05.03.1.05.15.06s.13.02.17.03c.01,0,.02,0,.03,0,.06,0,.11-.01.17-.02.05-.01.12-.04.15-.06.01,0,.03-.01.04-.02.04-.03.09-.06.13-.1.03-.03.08-.09.1-.13.04-.06.06-.12.06-.19.01-.07.01-.13,0-.2-.02-.07-.05-.12-.09-.17-.04-.05-.08-.1-.14-.13l-.12-.05c-.09-.02-.18-.02-.27,0l-.12.05c-.08.04-.13.1-.18.18,0,.01-.01.02-.02.03l.08-.1s-.02.02-.03.02l.1-.08s-.03.02-.04.02l.12-.05s-.03.01-.05.01l.13-.02s-.04,0-.06,0l.13.02s-.03,0-.04-.01l.12.05s-.03-.01-.04-.02l.1.08s-.02-.02-.03-.03l.08.1s-.01-.02-.02-.03l.05.12s0-.02,0-.04l.02.13s0-.03,0-.04l-.02.13s0-.03.01-.05l-.05.12s.02-.03.03-.05l-.08.1s.02-.02.04-.03l-.1.08s.02-.02.04-.02l-.12.05s.02,0,.04,0l-.13.02s.02,0,.02,0c.07,0,.13-.01.19-.04.06-.02.12-.05.16-.1.05-.05.08-.1.1-.16.03-.06.05-.12.04-.19l-.02-.13c-.02-.08-.07-.16-.13-.22l-.1-.08c-.08-.05-.16-.07-.25-.07h0Z"
				/>
			</g>
		</svg>

		<input
			class="hidden"
			type="file"
			name="file"
			accept=".jpg,.jpeg,.png"
			required
			on:change={(e) => {
				file = e.currentTarget.files?.[0];

				if (file) {
					history.pushState({ 'uploader:show': true }, '');
					show = true;
				}
			}}
		/>

		<button class="hidden bg-white w-full h-full">upload</button>
	</label>
</form>

<style>
	/* label {
		background-image: url($lib/icons/camera-plus.svg);
		background-size: 2rem 2rem;
		background-position: 50% 50%;
	} */

	/* in browsers without JS, the upload button is visible when the file input is populated */
	label:has(input[type='file']:valid) button {
		display: block;
	}

	input[name='description']:valid + button {
		opacity: 1;
	}

	/* label {
		filter: drop-shadow(0 -1px 4px rgba(255, 255, 255, 0.1));
	} */
</style>
