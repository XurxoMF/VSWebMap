<script lang="ts">
	import { onMount } from 'svelte';
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
	// Other imports
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { ZoomInSVG, ZoomOutSVG, SearchSVG } from '$lib/components/svg/index';
	import { GoToCoordinatesModal } from '$lib/components/modals';
	import { mapConfig, mapTexts, waypointConfig } from '$lib/map-config';
	import { getFriendlyCoord, getLiteralCoord, getOppositeAbsolute } from '$lib/helpers';

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
		traders: { type: string; layer: VectorLayer<VectorSource> }[];
		translocators: VectorLayer<VectorSource>;
		waypoints: { type: string; layer: VectorLayer<VectorSource> }[];
	};

	let waypointLayers: WaypointsType = {
		traders: [],
		translocators: new VectorLayer<VectorSource>(),
		waypoints: []
	};

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

		waypointLayers.waypoints.push({ type: type.type, layer: vectorLayer });
	});

	// Translocator import
	if (waypointConfig.translocators) {
		let type = waypointConfig.translocators;

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

		waypointLayers.translocators = vectorLayer;
	}

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

		// Map generation
		const map = new Map({
			target: 'map',
			layers: [
				mapLayer,
				...waypointLayers.traders.map((e) => e.layer),
				...waypointLayers.waypoints.map((e) => e.layer),
				waypointLayers.translocators
			],
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
