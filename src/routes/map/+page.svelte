<script lang="ts">
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import TileLayer from 'ol/layer/Tile';
	import Tile from 'ol/source/TileImage';
	import TileGrid from 'ol/tilegrid/TileGrid';
	import { onMount } from 'svelte';
	import MousePosition from 'ol/control/MousePosition';
	import { toStringXY } from 'ol/coordinate';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { ZoomInSVG, ZoomOutSVG, SearchSVG } from '$lib/components/svg/index';
	import { GoToCoordinatesModal } from '$lib/components/modals';
	import { mapConfig, mapTexts } from '$lib/map-config';

	// Where the coordinates will be rendered
	let coordinatesDiv: HTMLDivElement;

	// URL search params
	let searchParams = $page.url.searchParams;

	// Coordinates where the map is currently positioned
	let currentX = searchParams.has('x') ? Number(searchParams.get('x')) : 0;
	let currentY = searchParams.has('y') ? Number(searchParams.get('y')) : 0;
	let currentZoom = searchParams.has('zoom') ? Number(searchParams.get('zoom')) : 8;

	// MAP COMPONENTS AND PIECES

	/* Map view */
	let view = new View({
		extent: mapConfig.extent,
		center: [currentX, currentY],
		constrainResolution: true,
		zoom: currentZoom,
		resolutions: [256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125]
	});

	/* Each Tile image */
	let tileImage = new Tile({
		interpolate: false,
		url: '/map_data/world/{z}/{x}_{y}.png',
		wrapX: false,
		tileGrid: new TileGrid({
			extent: mapConfig.extent,
			origin: mapConfig.origin,
			resolutions: mapConfig.resolutions,
			tileSize: mapConfig.tileSize
		})
	});

	/* Tile map layer */
	let mapLayer = new TileLayer({
		source: tileImage,
		extent: mapConfig.extent
	});

	onMount(() => {
		// SOME MAP FUNCTIONS

		/* Used to display coordinates at the bottom of the map */
		let mousePosition = new MousePosition({
			coordinateFormat: (coordinate) => {
				if (coordinate) {
					return toStringXY([coordinate[0], coordinate[1]]);
				}
				return '0, 0';
			},
			target: coordinatesDiv,
			placeholder: '?, ?'
		});

		// Map generation
		const map = new Map({
			target: 'map',
			layers: [mapLayer],
			view: view,
			controls: [mousePosition]
		});

		// MORE MAP FUNCTIONS XD

		// Change url to the current coordinates
		map.on('moveend', () => {
			currentX = Math.round(<number>map.getView().getCenter()?.at(0));
			currentY = Math.round(<number>map.getView().getCenter()?.at(1));
			currentZoom = <number>map.getView().getZoom();

			searchParams.set('x', currentX ? currentX.toString() : '0');
			searchParams.set('y', currentY ? currentY.toString() : '0');
			searchParams.set('zoom', currentZoom ? currentZoom.toString() : '8');
			goto(`?${searchParams.toString()}`);
		});
	});

	// EVEN MORE FUNCTIONS THAT NEEDS TO BE OUTSITE THE ONMOUNT()

	/* Zoom In the map by 1 zoom level */
	let zoomIn = () => {
		view.animate({ zoom: view.getConstrainedZoom(<number>view.getZoom() + 1), duration: 200 });
	};

	/* Zoom Out the map by 1 zoom level */
	let zoomOut = () => {
		view.animate({ zoom: view.getConstrainedZoom(<number>view.getZoom() - 1), duration: 200 });
	};

	/* Counter for opened modals. Used to prevent multiple modals from opening at the same time. */
	/* 0 = No modal opened, 1 = Only current modal opened(can be opened)*/
	let activeModalsCounter = 0;

	/* Go to the specified coordinates */
	let goToCoordinatesActive = false;
	let goToCoordinatesConfirm = (x: HTMLInputElement, y: HTMLInputElement) => {
		let toX = Number(x.value == '' ? 0 : x.value);
		let toY = Number(y.value == '' ? 0 : y.value);

		goToCoordinatesActive = false;
		--activeModalsCounter;

		view.animate({ center: [toX, toY] });
	};
</script>

<div class="w-full h-[calc(100vh-6rem)] relative">
	<!-- Base map, waypoints and other stuff -->
	<div id="map" class="w-full h-full bg-black"></div>

	<!-- Coordinates overlay -->
	<div
		id="coordinates"
		bind:this={coordinatesDiv}
		class="absolute bottom-1 right-1 min-w-[4rem] h-8 w-fit whitespace-nowrap bg-zinc-900 rounded font-bold flex flex-col justify-center items-center px-2"
	></div>

	<!-- Controls -->
	<div id="controls" class="absolute top-2 right-1 bg-zinc-900 w-fit h-fit rounded flex flex-col">
		<!-- Zoom In -->
		<button
			class="p-2 border-b-[1px] border-solid border-zinc-200"
			on:click={zoomIn}
			title={mapTexts.zoomIn}
		>
			<ZoomInSVG classe="w-4 h-4 text-zinc-200" />
		</button>

		<!-- Zoom Out -->
		<button
			class="p-2 border-b-[1px] border-solid border-zinc-200"
			on:click={zoomOut}
			title={mapTexts.zoomOut}
		>
			<ZoomOutSVG classe="w-4 h-4 text-zinc-200" />
		</button>

		<!-- Open Go To Coordinate Modal -->
		<button
			class="p-2"
			on:click={() => {
				goToCoordinatesActive = true;
				++activeModalsCounter;
			}}
			title={mapTexts.goToCoordinates}
		>
			<SearchSVG classe="w-4 h-4 text-zinc-200" />
		</button>
	</div>

	<!-- Modals & Popups -->

	<!-- Go To Coordinates Modal -->
	{#if goToCoordinatesActive && activeModalsCounter == 1}
		<GoToCoordinatesModal
			onConfirm={goToCoordinatesConfirm}
			onClose={() => {
				goToCoordinatesActive = !goToCoordinatesActive;
				--activeModalsCounter;
			}}
		/>
	{/if}
</div>

<style>
	/* Remove the default styles to the coordinates element */
	:global(.ol-mouse-position) {
		position: static;
		top: 0;
		right: 0;
		width: fit-content;
		height: fit-content;
	}
</style>
