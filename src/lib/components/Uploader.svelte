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

				<div class="relative flex w-full border-b border-slate-200 focus-within:border-pink-600">
					<input
						class="w-full border-b border-slate-200 resize-none p-2 pr-20 focus-visible:outline-none"
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

	<label class="absolute left-0 top-0 w-full h-full bg-no-repeat">
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
	label {
		background-image: url($lib/icons/camera-plus.svg);
		background-size: 2rem 2rem;
		background-position: 50% 50%;
	}

	/* in browsers without JS, the upload button is visible when the file input is populated */
	label:has(input[type='file']:valid) button {
		display: block;
	}

	input[name='description']:valid + button {
		opacity: 1;
	}
</style>
