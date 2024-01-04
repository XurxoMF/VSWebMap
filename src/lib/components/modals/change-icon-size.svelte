<script lang="ts">
	import { CheckSVG, CrossSVG } from '$lib/components/svg';
	import { mapTexts } from '$lib/map-config';

	export let onConfirm: (size: HTMLInputElement) => void;
	export let onClose: () => void;
	export let currentSize: number;

	let size: HTMLInputElement;

	let modalSubmit = (e: SubmitEvent) => {
		e.preventDefault();

		onConfirm(size);
	};
</script>

<div class="absolute top-0 left-0 bg-opacity-80 w-full h-full bg-zinc-800">
	<div
		class="absolute md:w-64 h-fit left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 rounded p-4"
	>
		<h1 class="font-bold w-fit m-2 mx-auto text-center">{mapTexts.changeIconSize}</h1>
		<form on:submit={modalSubmit} class="flex flex-col gap-4 text-zinc-900 font-bold">
			<input
				bind:this={size}
				type="number"
				step="0.01"
				name="size"
				min="1.0"
				max="2.0"
				required={true}
				value={currentSize}
				placeholder={mapTexts.changeIconSizePlaceholder}
				class="text-center bg-zinc-200 rounded w-full"
			/>
			<div class="flex justify-around">
				<button type="submit"><CheckSVG /></button>
				<button type="button" on:click={onClose}><CrossSVG /></button>
			</div>
		</form>
	</div>
</div>
