<script lang="ts">
	import { CheckSVG, CrossSVG } from '$lib/components/svg';
	import { mapTexts } from '$lib/map-config';

	export let onConfirm: (x: HTMLInputElement, y: HTMLInputElement) => void;
	export let onClose: () => void;

	let x: HTMLInputElement;
	let y: HTMLInputElement;

	let modalSubmit = (e: SubmitEvent) => {
		e.preventDefault();

		onConfirm(x, y);
	};
</script>

<div class="absolute top-0 left-0 bg-opacity-80 w-full h-full bg-zinc-800">
	<div
		class="absolute w-fit h-fit left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 rounded p-4"
	>
		<form on:submit={modalSubmit} class="flex flex-col gap-4 text-zinc-900 font-bold">
			<input
				bind:this={x}
				type="number"
				name="x"
				placeholder={mapTexts.goToCoordinatesXPlaceholder}
				class="text-center bg-zinc-200 rounded"
			/>
			<input
				bind:this={y}
				type="number"
				name="y"
				placeholder={mapTexts.goToCoordinatesYPlaceholder}
				class="text-center bg-zinc-200 rounded"
			/>
			<div class="flex justify-around">
				<button type="submit"><CheckSVG /></button>
				<button type="button" on:click={onClose}><CrossSVG /></button>
			</div>
		</form>
	</div>
</div>
