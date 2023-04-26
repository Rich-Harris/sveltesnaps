<script lang="ts">
	import { enhance } from '$app/forms';

	let file: File | undefined;
	let description = '';
	let pending = false;

	let width = 0;
	let height = 0;

	$: src = file ? URL.createObjectURL(file) : undefined;
</script>

<form
	class="relative w-8 h-8"
	method="POST"
	action="/?/post"
	use:enhance={() => {
		pending = true;

		return async ({ update }) => {
			await update();

			pending = false;
			file = undefined;
		};
	}}
>
	<div
		class="fixed w-screen h-screen bg-[#ffffff88] backdrop-blur-lg backdrop-grayscale-50 top-0 left-0 flex justify-center items-center"
		class:hidden={!file}
	>
		<div class="w-screen height-screen max-w-2xl max-h-[96rem] p-8">
			<div class="flex flex-col bg-white shadow-xl p-8 w-sc rounded-md">
				<img
					class="flex-1 mb-4"
					alt="Preview"
					{src}
					on:load={(e) => {
						width = e.currentTarget.naturalWidth;
						height = e.currentTarget.naturalHeight;
					}}
				/>

				<input type="hidden" name="width" value={width} />
				<input type="hidden" name="height" value={height} />

				<div class="relative flex w-full">
					<input
						class="w-full border-b border-slate-200 resize-none p-2 pr-20"
						name="description"
						placeholder="enter a description"
						required
						bind:value={description}
					/>

					<button
						disabled={pending}
						class="absolute w-16 h-full right-0 transition-opacity"
						class:opacity-0={!description}
					>
						upload
					</button>
				</div>
			</div>
		</div>
	</div>

	<label class="absolute left-0 top-0 w-8 h-8 bg-no-repeat">
		<input
			class="hidden"
			type="file"
			name="file"
			accept=".jpg,.jpeg,.png"
			on:change={(e) => {
				file = e.currentTarget.files?.[0];
			}}
		/>
	</label>
</form>

<style>
	label {
		background-image: url($lib/icons/camera-plus.svg);
	}
</style>
