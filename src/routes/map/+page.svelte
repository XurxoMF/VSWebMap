<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	// OL imports
	import 'ol/ol.css';
	import { Feature, Map, View } from 'ol';
	import { toStringXY } from 'ol/coordinate';
	import { GeoJSON } from 'ol/format';
	import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
	import { Icon, Style, Text, Fill, Stroke } from 'ol/style';
	import { TileImage as Tile, Vector as VectorSource } from 'ol/source';
	import TileGrid from 'ol/tilegrid/TileGrid';
	import MousePosition from 'ol/control/MousePosition';
	import { Point, type Geometry, LineString, MultiPoint } from 'ol/geom';
	import type BaseLayer from 'ol/layer/Base';
	// Other imports
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import {
		ZoomInSVG,
		ZoomOutSVG,
		SearchSVG,
		VisibleSVG,
		HiddenSVG,
		ArrowDownSVG,
		ArrowUpSVG
	} from '$lib/components/svg/index';
	import { GoToCoordinatesModal } from '$lib/components/modals';
	import { mapConfig, mapTexts, waypointConfig } from '$lib/map-config';
	import { getFriendlyCoord, getLiteralCoord, getOppositeAbsolute } from '$lib/helpers';
	import { writable } from 'svelte/store';

	/* 
	 IMPORTANT

	 For the map to work properly we had to invert user friendly cordinates in axis X so make sure to always
	 invert them!

	 If you're trying to get literal coordinates you've to invert the user friendly value.

	 Examples:
	  - getFriendlyCoord(512100) will return 100 but we have to invert it. -getFriendlyCoord(512100) will return -100.
	  - getLiteralCoord(100) will return 512100 but we have to invert it. getLiteralCoord(-100) will return 511900.

	 It may seem strange at first, but coordinates in x are inverted so if the user wants to go to x=100 and we get the literal coord with getLiteralCoord(100) it'll give us the opposite coordinate(100 blocks in the wrong direction) so we have to get it with getLiteralCoord(-100) to get the right coordinate(100 block in the right direction)...

	 Idk I'm not good at explaining this things lol. Pls don judge me.
	*/

	// Where the coordinates will be rendered
	let coordinatesDiv: HTMLDivElement;

	// URL search params
	let searchParams = $page.url.searchParams;

	// Coordinates where the map is currently positioned
	let currentX = searchParams.has('x')
		? Number(searchParams.get('x'))
		: -getFriendlyCoord(mapConfig.center[0]);
	let currentY = searchParams.has('y')
		? Number(searchParams.get('y'))
		: getFriendlyCoord(mapConfig.center[0]);
	let currentZoom = searchParams.has('zoom') ? Number(searchParams.get('zoom')) : 8;

	// MAP COMPONENTS AND PIECES

	/* Map view */
	let view = new View({
		extent: mapConfig.extent,
		center: [getLiteralCoord(-currentX), getLiteralCoord(currentY)],
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
			resolutions: mapConfig.resolutions,
			tileSize: mapConfig.tileSize
		})
	});

	/* Tile map layer */
	let mapLayer = new TileLayer({
		source: tileImage,
		extent: mapConfig.extent
	});

	// WAYPOINT IMPORTS

	type WaypointsType = {
		traders?: { type: string; layer: VectorLayer<VectorSource> }[];
		translocators?: { type: string; layer: VectorLayer<VectorSource> }[];
		waypoints?: { type: string; layer: VectorLayer<VectorSource> }[];
	};

	let waypointLayers: WaypointsType = {};

	// Trader import
	waypointConfig.traders.values.forEach((type) => {
		let vectorSource = new VectorSource({
			loader: (extent, resolution, projection) => {
				const format = new GeoJSON();
				fetch('/map_data/geojson/traders.geojson')
					.then((response) => response.json())
					.then((json) => {
						let features = <Feature<Geometry>[]>format.readFeatures(json, {
							featureProjection: projection
						});

						features = features.filter((f) => f.getProperties()['wares'] == type.type);

						features.forEach((feature) => {
							const geometry = feature.getGeometry();
							if (geometry instanceof Point) {
								let coords = geometry.getCoordinates();
								geometry.setCoordinates([coords[0], getOppositeAbsolute(coords[1])]);
							}
						});

						vectorSource.addFeatures(features);
					});
			}
		});

		let vectorLayer = new VectorLayer({
			minZoom: typeof (type.minZoom - 1) == 'number' ? type.minZoom - 1 : 4,
			source: vectorSource,
			visible: false,
			style: (feature) => {
				return new Style({
					image: new Icon({
						color: type.rgb || [0, 0, 0],
						opacity: 1,
						src: type.icon || '/map_icons/trader.svg'
					}),
					text: new Text({
						font: 'bolder .6rem monospace',
						text: feature.get('name'),
						textAlign: 'center',
						textBaseline: 'top',
						offsetY: 12,
						fill: new Fill({ color: [0, 0, 0] }),
						stroke: new Stroke({ color: [255, 255, 255, 0.6], width: 3 })
					})
				});
			}
		});

		if (waypointLayers.traders == undefined) waypointLayers.traders = [];

		waypointLayers.traders.push({ type: type.type, layer: vectorLayer });
	});

	// Waypoint import
	waypointConfig.waypoints.values.forEach((type) => {
		let vectorSource = new VectorSource({
			loader: (extent, resolution, projection) => {
				const format = new GeoJSON();
				fetch('/map_data/geojson/landmarks.geojson')
					.then((response) => response.json())
					.then((json) => {
						let features = <Feature<Geometry>[]>format.readFeatures(json);

						features = features.filter((f) => f.getProperties()['type'] == type.type);

						features.forEach((feature) => {
							const geometry = feature.getGeometry();
							if (geometry instanceof Point) {
								let coords = geometry.getCoordinates();
								geometry.setCoordinates([coords[0], getOppositeAbsolute(coords[1])]);
							}
						});

						vectorSource.addFeatures(features);
					});
			}
		});

		let vectorLayer = new VectorLayer({
			minZoom: typeof (type.minZoom - 1) == 'number' ? type.minZoom - 1 : 1,
			source: vectorSource,
			visible: false,
			style: (feature) => {
				return new Style({
					image: new Icon({
						color: type.rgb || [0, 0, 0],
						opacity: 1,
						src: type.icon || '/map_icons/star1.svg'
					}),
					text: new Text({
						font: 'bolder .6rem monospace',
						text: feature.get('label'),
						textAlign: 'center',
						textBaseline: 'top',
						offsetY: 12,
						fill: new Fill({ color: [0, 0, 0] }),
						stroke: new Stroke({ color: [255, 255, 255, 0.6], width: 3 })
					})
				});
			}
		});

		if (waypointLayers.waypoints == undefined) waypointLayers.waypoints = [];

		waypointLayers.waypoints.push({ type: type.type, layer: vectorLayer });
	});

	// Translocator import
	waypointConfig.translocators.values.forEach((type) => {
		let vectorSource = new VectorSource({
			loader: (extent, resolution, projection) => {
				const format = new GeoJSON();
				fetch('/map_data/geojson/translocators.geojson')
					.then((response) => response.json())
					.then((json) => {
						let features = <Feature<Geometry>[]>format.readFeatures(json);

						features.forEach((feature) => {
							const geometry = feature.getGeometry();
							if (geometry instanceof LineString) {
								let coords = geometry.getCoordinates();
								geometry.setCoordinates([
									[coords[0][0], getOppositeAbsolute(coords[0][1])],
									[coords[1][0], getOppositeAbsolute(coords[1][1])]
								]);
							}
						});

						vectorSource.addFeatures(features);
					});
			}
		});

		let vectorLayer = new VectorLayer({
			minZoom: typeof (type.minZoom - 1) == 'number' ? type.minZoom - 1 : 1,
			source: vectorSource,
			visible: false,
			style: (feature) => {
				return [
					new Style({
						stroke: new Stroke({
							color: type.rgb || [0, 0, 0],
							width: 2
						})
					}),
					new Style({
						image: new Icon({
							color: type.rgb || [0, 0, 0],
							opacity: 1,
							src: type.icon || '/map_icons/spiral.svg'
						}),
						geometry: (feature) => {
							// @ts-ignore
							return new MultiPoint(feature.getGeometry().getCoordinates());
						}
					})
				];
			}
		});

		if (waypointLayers.translocators == undefined) waypointLayers.translocators = [];

		waypointLayers.translocators.push({ type: type.type, layer: vectorLayer });
	});

	// LEGEND RELATED STUFF

	// States of the dropdown menus
	type LegendMenuStates = {
		traders: boolean;
		translocators: boolean;
		waypoints: boolean;
	};

	let legendMenusStates = writable<LegendMenuStates>({
		traders: false,
		translocators: false,
		waypoints: true
	});

	const localMenuStates = localStorage.getItem('lms');

	if (localMenuStates != null) {
		let lms: LegendMenuStates = JSON.parse(localMenuStates);

		legendMenusStates.update(() => lms);
	}

	const legendMenusStatesUnsuscribe = legendMenusStates.subscribe((value) => {
		localStorage.setItem('lms', JSON.stringify(value));
	});

	// States of the waypoint layers visibility
	let legendWaypointStates = writable<Set<string>>(new Set());

	const localWaypointStates = localStorage.getItem('lws');

	if (localWaypointStates != null) {
		let lws: string[] = JSON.parse(localWaypointStates);

		if (lws.length > 0) {
			legendWaypointStates.update(() => new Set(lws));
		}
	} else {
		legendWaypointStates.update(() => {
			let newStates = new Set<string>();
			waypointLayers.traders?.forEach((e) =>
				newStates.add(`${waypointConfig.traders.group}-${e.type}`)
			);
			waypointLayers.translocators?.forEach((e) =>
				newStates.add(`${waypointConfig.translocators.group}-${e.type}`)
			);
			waypointLayers.waypoints?.forEach((e) =>
				newStates.add(`${waypointConfig.waypoints.group}-${e.type}`)
			);
			return newStates;
		});
	}

	waypointLayers.traders?.forEach((e) =>
		e.layer.setVisible($legendWaypointStates.has(`${waypointConfig.traders.group}-${e.type}`))
	);
	waypointLayers.translocators?.forEach((e) =>
		e.layer.setVisible($legendWaypointStates.has(`${waypointConfig.translocators.group}-${e.type}`))
	);
	waypointLayers.waypoints?.forEach((e) =>
		e.layer.setVisible($legendWaypointStates.has(`${waypointConfig.waypoints.group}-${e.type}`))
	);

	const legendWaypointStatesUnsuscribe = legendWaypointStates.subscribe((value) => {
		localStorage.setItem('lws', JSON.stringify([...value]));
	});

	const toggleWaypointVisivility = (group: string, type: string, state: boolean): void => {
		switch (group) {
			case waypointConfig.traders.group:
				const trader = waypointLayers.traders?.find((e) => e.type == type);
				trader?.layer.setVisible(state);
				break;
			case waypointConfig.translocators.group:
				const translocator = waypointLayers.translocators?.find((e) => e.type == type);
				translocator?.layer.setVisible(state);
				break;
			case waypointConfig.waypoints.group:
				const waypoint = waypointLayers.waypoints?.find((e) => e.type == type);
				waypoint?.layer.setVisible(state);
				break;
			default:
				break;
		}

		if (state) {
			legendWaypointStates.update((current) => {
				current.add(`${group}-${type}`);
				return current;
			});
		} else {
			legendWaypointStates.update((current) => {
				current.delete(`${group}-${type}`);
				return current;
			});
		}
	};

	const toggleWaypointGroupVisivility = (group: string, state: boolean): void => {
		switch (group) {
			case waypointConfig.traders.group:
				waypointLayers.traders?.forEach((e) => {
					toggleWaypointVisivility(group, e.type, state);
				});
				break;
			case waypointConfig.translocators.group:
				waypointLayers.translocators?.forEach((e) => {
					toggleWaypointVisivility(group, e.type, state);
				});
				break;
			case waypointConfig.waypoints.group:
				waypointLayers.waypoints?.forEach((e) => {
					toggleWaypointVisivility(group, e.type, state);
				});
				break;
			default:
				break;
		}
	};

	onMount(() => {
		// SOME MAP FUNCTIONS

		/* Used to display coordinates at the bottom of the map */
		let mousePosition = new MousePosition({
			coordinateFormat: (coordinate) => {
				if (coordinate) {
					return toStringXY([-getFriendlyCoord(coordinate[0]), getFriendlyCoord(coordinate[1])]);
				}
				return '0, 0';
			},
			target: coordinatesDiv,
			placeholder: '?, ?'
		});

		// Layers the map will use and it's imports
		const layers: BaseLayer[] = [mapLayer];

		if (waypointLayers.traders != undefined)
			layers.push(...waypointLayers.traders?.map((e) => e.layer));
		if (waypointLayers.waypoints != undefined)
			layers.push(...waypointLayers.waypoints?.map((e) => e.layer));
		if (waypointLayers.translocators != undefined)
			layers.push(...waypointLayers.translocators?.map((e) => e.layer));

		// Map generation
		const map = new Map({
			target: 'map',
			layers,
			view: view,
			controls: [mousePosition]
		});

		// MORE MAP FUNCTIONS XD

		// Change url to the current coordinates
		map.on('moveend', () => {
			currentX = -getFriendlyCoord(Math.round(<number>map.getView().getCenter()?.at(0)));
			currentY = getFriendlyCoord(Math.round(<number>map.getView().getCenter()?.at(1)));
			currentZoom = <number>map.getView().getZoom();

			searchParams.set('x', currentX ? currentX.toString() : '0');
			searchParams.set('y', currentY ? currentY.toString() : '0');
			searchParams.set('zoom', currentZoom ? currentZoom.toString() : '0');
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
	let goToCoordinatesConfirm = (x: HTMLInputElement, z: HTMLInputElement) => {
		let toX = getLiteralCoord(-Number(x.value == '' ? 0 : x.value));
		let toZ = getLiteralCoord(Number(z.value == '' ? 0 : z.value));

		goToCoordinatesActive = false;
		--activeModalsCounter;

		view.animate({ center: [toX, toZ] });
	};

	onDestroy(() => {
		legendWaypointStatesUnsuscribe();
		legendMenusStatesUnsuscribe();
	});
</script>

<div class="w-full h-[calc(100vh-6rem)] relative">
	<!-- Base map, waypoints and other stuff -->
	<div id="map" class="w-full h-full bg-black"></div>

	<!-- Coordinates overlay -->
	<div
		id="coordinates"
		bind:this={coordinatesDiv}
		class="absolute bottom-2 right-2 min-w-[4rem] h-8 w-fit whitespace-nowrap bg-zinc-900 rounded font-bold flex flex-col justify-center items-center px-2"
	></div>

	<!-- Controls -->
	<div id="controls" class="absolute top-2 right-2 bg-zinc-900 w-fit h-fit rounded flex flex-col">
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

	<div
		id="legend"
		class="absolute top-2 left-2 bg-zinc-900 w-1/3 max-w-56 h-fit rounded flex flex-col p-2 gap-2 text-sm"
	>
		<!-- Traders Section -->
		{#if waypointConfig.traders != undefined && waypointConfig.traders.values.length > 0}
			<div class="border-solid border-2 border-zinc-200 rounded">
				<div class="flex flex-row justify-between p-1 px-2">
					<h1 class="font-bold">{waypointConfig.traders.name}</h1>
					<div class="flex flex-row gap-2 ml-4">
						<button
							on:click={() => toggleWaypointGroupVisivility(waypointConfig.traders.group, true)}
						>
							<VisibleSVG classe="w-4 h-4 text-zinc-200" />
						</button>
						<button
							on:click={() => toggleWaypointGroupVisivility(waypointConfig.traders.group, false)}
						>
							<HiddenSVG classe="w-4 h-4 text-zinc-200" />
						</button>
						<button
							on:click={() => legendMenusStates.update((s) => ({ ...s, traders: !s.traders }))}
						>
							{#if $legendMenusStates.traders}
								<ArrowUpSVG classe="w-4 h-4 text-zinc-200" />
							{:else}
								<ArrowDownSVG classe="w-4 h-4 text-zinc-200" />
							{/if}
						</button>
					</div>
				</div>

				<div
					class={`border-solid border-t-2 border-zinc-200 ${
						$legendMenusStates.traders ? '' : 'hidden'
					}`}
				>
					{#each waypointConfig.traders.values as layer}
						<div class="p-1 px-2 odd:bg-zinc-800 flex flex-row justify-between gap-4 group">
							<h1
								class="overflow-hidden text-ellipsis whitespace-nowrap select-none group-hover:whitespace-normal"
							>
								{layer.name}
							</h1>
							<button
								on:click={() =>
									toggleWaypointVisivility(
										waypointConfig.traders.group,
										layer.type,
										!$legendWaypointStates.has(`${waypointConfig.traders.group}-${layer.type}`)
									)}
							>
								{#if $legendWaypointStates.has(`${waypointConfig.traders.group}-${layer.type}`)}
									<VisibleSVG classe="w-4 h-4 text-zinc-200" />
								{:else}
									<HiddenSVG classe="w-4 h-4 text-zinc-200" />
								{/if}
							</button>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Translocators Section -->
		{#if waypointConfig.translocators != undefined && waypointConfig.translocators.values.length > 0}
			<div class="border-solid border-2 border-zinc-200 rounded">
				<div class="flex flex-row justify-between p-1 px-2">
					<h1 class="font-bold">{waypointConfig.translocators.name}</h1>
					<div class="flex flex-row gap-2 ml-4">
						<button
							on:click={() =>
								toggleWaypointGroupVisivility(waypointConfig.translocators.group, true)}
						>
							<VisibleSVG classe="w-4 h-4 text-zinc-200" />
						</button>
						<button
							on:click={() =>
								toggleWaypointGroupVisivility(waypointConfig.translocators.group, false)}
						>
							<HiddenSVG classe="w-4 h-4 text-zinc-200" />
						</button>
						<button
							on:click={() =>
								legendMenusStates.update((s) => ({ ...s, translocators: !s.translocators }))}
						>
							{#if $legendMenusStates.translocators}
								<ArrowUpSVG classe="w-4 h-4 text-zinc-200" />
							{:else}
								<ArrowDownSVG classe="w-4 h-4 text-zinc-200" />
							{/if}
						</button>
					</div>
				</div>

				<div
					class={`border-solid border-t-2 border-zinc-200 ${
						$legendMenusStates.translocators ? '' : 'hidden'
					}`}
				>
					{#each waypointConfig.translocators.values as layer}
						<div class="p-1 px-2 odd:bg-zinc-800 flex flex-row justify-between gap-4 group">
							<h1
								class="overflow-hidden text-ellipsis whitespace-nowrap select-none group-hover:whitespace-normal"
							>
								{layer.name}
							</h1>
							<button
								on:click={() =>
									toggleWaypointVisivility(
										waypointConfig.translocators.group,
										layer.type,
										!$legendWaypointStates.has(
											`${waypointConfig.translocators.group}-${layer.type}`
										)
									)}
							>
								{#if $legendWaypointStates.has(`${waypointConfig.translocators.group}-${layer.type}`)}
									<VisibleSVG classe="w-4 h-4 text-zinc-200" />
								{:else}
									<HiddenSVG classe="w-4 h-4 text-zinc-200" />
								{/if}
							</button>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Waypoints Section -->
		{#if waypointConfig.waypoints != undefined && waypointConfig.waypoints.values.length > 0}
			<div class="border-solid border-2 border-zinc-200 rounded">
				<div class="flex flex-row justify-between p-1 px-2">
					<h1 class="font-bold">{waypointConfig.waypoints.name}</h1>
					<div class="flex flex-row gap-2 ml-4">
						<button
							on:click={() => toggleWaypointGroupVisivility(waypointConfig.waypoints.group, true)}
						>
							<VisibleSVG classe="w-4 h-4 text-zinc-200" />
						</button>
						<button
							on:click={() => toggleWaypointGroupVisivility(waypointConfig.waypoints.group, false)}
						>
							<HiddenSVG classe="w-4 h-4 text-zinc-200" />
						</button>
						<button
							on:click={() => legendMenusStates.update((s) => ({ ...s, waypoints: !s.waypoints }))}
						>
							{#if $legendMenusStates.waypoints}
								<ArrowUpSVG classe="w-4 h-4 text-zinc-200" />
							{:else}
								<ArrowDownSVG classe="w-4 h-4 text-zinc-200" />
							{/if}
						</button>
					</div>
				</div>

				<div
					class={`border-solid border-t-2 border-zinc-200 ${
						$legendMenusStates.waypoints ? '' : 'hidden'
					}`}
				>
					{#each waypointConfig.waypoints.values as layer}
						<div class="p-1 px-2 odd:bg-zinc-800 flex flex-row justify-between gap-4 group">
							<h1
								class="overflow-hidden text-ellipsis whitespace-nowrap select-none group-hover:whitespace-normal"
							>
								{layer.name}
							</h1>
							<button
								on:click={() =>
									toggleWaypointVisivility(
										waypointConfig.waypoints.group,
										layer.type,
										!$legendWaypointStates.has(`${waypointConfig.waypoints.group}-${layer.type}`)
									)}
							>
								{#if $legendWaypointStates.has(`${waypointConfig.waypoints.group}-${layer.type}`)}
									<VisibleSVG classe="w-4 h-4 text-zinc-200" />
								{:else}
									<HiddenSVG classe="w-4 h-4 text-zinc-200" />
								{/if}
							</button>
						</div>
					{/each}
				</div>
			</div>
		{/if}
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
