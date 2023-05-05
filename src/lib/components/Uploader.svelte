<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { goto, pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Modal from './Modal.svelte';

	let file: File | undefined;
	let pending = false;

	$: src = file ? URL.createObjectURL(file) : undefined;
</script>

<form
	class="relative w-full h-full"
	method="POST"
	action="/?/post"
	enctype="multipart/form-data"
	use:enhance={() => {
		pending = true;

		return async ({ result }) => {
			if (result.type === 'redirect') {
				await goto(result.location, {
					replaceState: true
				});
			} else {
				// TODO handle network errors
			}

			pending = false;
			file = undefined;
		};
	}}
>
	{#if $page.state.show_uploader}
		<Modal on:close={() => history.back()}>
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
							class:hidden={browser}
						>
							upload
						</button>
					</div>
				</div>
			</div>
		</Modal>
	{/if}

	<label class="fixed right-3 bottom-3 w-16 h-16 drop-shadow-lg">
		<input
			class="hidden"
			type="file"
			name="file"
			accept=".jpg,.jpeg,.png"
			required
			on:change={(e) => {
				file = e.currentTarget.files?.[0];

				if (file) {
					pushState({ show_uploader: true });
				}
			}}
		/>

		<svg
			class="absolute w-full h-full p-2 rounded-full border-2 border-pink-600 bg-white dark:bg-zinc-900"
			viewBox="0 0 24 24"
		>
			<g class="fill-pink-600">
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

		<button disabled={browser} class="hidden">
			<svg class="absolute w-full h-full p-3 rounded-full top-0 bg-pink-600" viewBox="0 0 24 24">
				<g class="fill-white">
					<path
						d="m4.24,14.61l-.52,5.26c-.03.28.25.49.5.5,3.87.2,7.75.35,11.63.47.95.03,1.9.05,2.85.07.59.01,1.36.12,1.55-.61.11-.39.04-.88.05-1.29,0-.49.02-.98.03-1.47.02-.98.04-1.97.06-2.95.01-.64-.99-.64-1,0-.02.86-.03,1.72-.05,2.58s-.1,1.73-.05,2.58v.25c.06-.09.03-.11-.09-.08-.2.02-.42,0-.62-.01-.45-.01-.91-.02-1.36-.03-.87-.02-1.73-.05-2.6-.07-3.46-.11-6.93-.25-10.39-.43l.5.5.52-5.26c.06-.64-.94-.64-1,0h0Z"
					/>
					<path
						d="m12.68,17.19c-.15-4.34,0-8.68.43-12.99.06-.64-.94-.64-1,0-.43,4.32-.58,8.66-.43,12.99.02.64,1.02.64,1,0h0Z"
					/>
					<path
						d="m7.81,8.93c.71-.77,1.45-1.52,2.24-2.22.4-.36.81-.71,1.23-1.05.22-.18.45-.36.68-.53.19-.14.44-.41.67-.42.38-.01.92.51,1.22.73.42.3.82.63,1.21.97.76.67,1.44,1.41,2.07,2.2.4.51,1.1-.21.71-.71-.73-.93-1.54-1.78-2.45-2.53-.42-.35-.86-.68-1.31-.99-.42-.29-.92-.71-1.45-.71s-.97.44-1.37.74c-.49.38-.98.77-1.45,1.18-.95.82-1.86,1.71-2.71,2.63-.43.47.27,1.18.71.71h0Z"
					/>
				</g>
			</svg>
		</button>
	</label>
</form>

<style>
	/* label {
		background-image: url($lib/icons/camera-plus.svg);
		background-size: 2rem 2rem;
		background-position: 50% 50%;
	} */

	/* in browsers without JS, the upload button is visible when the file input is populated */
	input[type='file']:valid + svg + button:not(:disabled) {
		display: block;
	}

	input[name='description']:valid + button {
		opacity: 1;
	}

	/* label {
		filter: drop-shadow(0 -1px 4px rgba(255, 255, 255, 0.1));
	} */
</style>
