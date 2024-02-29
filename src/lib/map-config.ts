export const mapConfig = {
	extent: [0, 0, 1024000, 1024000],
	center: [512000, 512000],
	resolutions: [512, 256, 128, 64, 32, 16, 8, 4, 2, 1],
	tileSize: [256, 256]
};

/**
 * This texts will be shown in buttons, inputs and some other places on the map page.
 */
export const mapTexts = {
	zoomIn: 'Acercar',
	zoomOut: 'Alejar',
	goToCoordinates: 'Ir a las coordenadas',
	goToCoordinatesXPlaceholder: 'Coordenada X',
	goToCoordinatesZPlaceholder: 'Coordenada Z',
	changeIconSize: 'Cambiar el tamaño de los waypoints',
	changeIconSizePlaceholder: 'Nuevo tamaño'
};

/**
 * Coordinates for the spawn waypoint.
 */
export const spawnLocation = {
	x: 511848,
	z: 511956,
	label: 'Spawn'
};

/**
 * Config for each waypoint inside each category.
 *
 * ```
 * {
 *		group: string, // Name used as ID of the group.
 *		name: string, // Name to show on the legend and some other places.
 *		values: [
 *			{
 *				type: string, // Name shown on the geojson file and ID of the waypoint.
 *				rgb: [number, number, number], // Only for translocators. Color used by the line conecting them.
 *				icon: string, // Route of the SVG used as icon. / is the static folder. Default /map_icons/icon.svg.
 *				minZoom: number, // 0 = always visible, 11 = only visible with zoom extremely close to the ground.
 *				name: string // Name to show on the legend and some other places.
 *			},
 *		]
 *	},
 * ```
 *
 * If you don't want to show some waypoint you can set value to an empty array. Example:
 * ```
 * traders: {
 *		group: 'Traders',
 *		name: 'Comerciantes',
 *		values: []
 * },
 * ```
 */
export const waypointConfig: WaypointConfig = {
	traders: {
		group: 'Traders',
		name: 'Comerciantes',
		values: [
			{
				type: 'Kitchenware Trader',
				icon: '/map_icons/landmark/campfire.svg',
				minZoom: 3,
				name: 'Comerciante Concinero'
			},
			{
				type: 'Comerciante de agricultura',
				icon: '/map_icons/trader/agriculture.svg',
				minZoom: 3,
				name: 'Comerciante de agricultura'
			},
			{
				type: 'Comerciante artesano',
				icon: '/map_icons/trader/artisan.svg',
				minZoom: 3,
				name: 'Comerciante artesano'
			},
			{
				type: 'Comerciante de materiales de construcción',
				icon: '/map_icons/trader/building-materials.svg',
				minZoom: 3,
				name: 'Comerciante de materiales de construcción'
			},
			{
				type: 'Comerciante de prendas',
				icon: '/map_icons/trader/clothing.svg',
				minZoom: 3,
				name: 'Comerciante de prendas'
			},
			{
				type: 'Comerciante de productos básicos',
				icon: '/map_icons/trader/commodities.svg',
				minZoom: 3,
				name: 'Comerciante de productos básicos'
			},
			{
				type: 'Comerciante de muebles',
				icon: '/map_icons/trader/furniture.svg',
				minZoom: 3,
				name: 'Comerciante de muebles'
			},
			{
				type: 'Comerciante de lujos',
				icon: '/map_icons/trader/luxuries.svg',
				minZoom: 3,
				name: 'Comerciante de lujos'
			},
			{
				type: 'Comerciante de bienes de supervivencia',
				icon: '/map_icons/trader/survival-goods.svg',
				minZoom: 3,
				name: 'Comerciante de bienes de supervivencia'
			},
			{
				type: 'Comerciante buscador de tesoros',
				icon: '/map_icons/trader/treasure-hunter.svg',
				minZoom: 3,
				name: 'Comerciante buscador de tesoros'
			}
		]
	},
	translocators: {
		group: 'Translocators',
		name: 'Translocadores',
		values: [
			{
				type: 'Translocador',
				rgb: [127, 4, 183],
				icon: '/map_icons/in-game/spiral.svg',
				minZoom: 1,
				name: 'Translocador'
			}
		]
	},
	waypoints: {
		group: 'Waypoints',
		name: 'Puntos de interés',
		values: [
			{
				type: 'SPAWN',
				icon: '/map_icons/in-game/star2.svg',
				minZoom: 0,
				name: 'Spawn'
			},
			{
				type: 'Base',
				icon: '/map_icons/in-game/home.svg',
				minZoom: 0,
				name: 'Base'
			},
			{
				type: 'TIENDA',
				icon: '/map_icons/misc/shop.svg',
				minZoom: 2,
				name: 'Tienda'
			},
			{
				type: 'RESTAU',
				icon: '/map_icons/misc/knife-and-fork.svg',
				minZoom: 2,
				name: 'Restaurante'
			}
		]
	}
};

/**
 * This is the format of the waypoint config. DON'T TOUCH THIS
 */
type WaypointConfig = {
	traders: {
		group: string;
		name: string;
		values: {
			type: string;
			icon: string;
			minZoom: number;
			name: string;
		}[];
	};
	translocators: {
		group: string;
		name: string;
		values: {
			type: string;
			rgb: number[];
			icon: string;
			minZoom: number;
			name: string;
		}[];
	};
	waypoints: {
		group: string;
		name: string;
		values: {
			type: string;
			icon: string;
			minZoom: number;
			name: string;
		}[];
	};
};
