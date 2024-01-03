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
	goToCoordinatesXPlaceholder: `Coordenada X`,
	goToCoordinatesZPlaceholder: `Coordenada Z`
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
 *				rgb: [number, number, number], // Color used for the icon.
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
				type: 'Agriculture trader',
				rgb: [255, 0, 255],
				icon: '/map_icons/trader.svg',
				minZoom: 6,
				name: 'Comerciante agrícola'
			},
			{
				type: 'Trader (Artisan)',
				rgb: [255, 0, 255],
				icon: '/map_icons/trader.svg',
				minZoom: 6,
				name: 'Comerciante artesano'
			},
			{
				type: 'Building materials trader',
				rgb: [255, 0, 255],
				icon: '/map_icons/trader.svg',
				minZoom: 6,
				name: 'Comerciante de materiales de construcción'
			},
			{
				type: 'Clothing trader',
				rgb: [255, 0, 255],
				icon: '/map_icons/trader.svg',
				minZoom: 6,
				name: 'Comerciante de ropa'
			},
			{
				type: 'Commodities trader',
				rgb: [255, 0, 255],
				icon: '/map_icons/trader.svg',
				minZoom: 6,
				name: 'Comerciante de materias primas'
			},
			{
				type: 'Furniture trader',
				rgb: [255, 0, 255],
				icon: '/map_icons/trader.svg',
				minZoom: 6,
				name: 'Comerciante de muebles'
			},
			{
				type: 'Luxuries trader',
				rgb: [255, 0, 255],
				icon: '/map_icons/trader.svg',
				minZoom: 6,
				name: 'Comerciante de lujos'
			},
			{
				type: 'Survival goods trader',
				rgb: [255, 0, 255],
				icon: '/map_icons/trader.svg',
				minZoom: 6,
				name: 'Comerciante de bienes de supervivencia'
			},
			{
				type: 'Treasure hunter trader',
				rgb: [255, 0, 255],
				icon: '/map_icons/trader.svg',
				minZoom: 6,
				name: 'Comerciante cazador de tesoros'
			}
		]
	},
	translocators: {
		group: 'Translocators',
		name: 'Translocadores',
		values: [
			{
				type: 'Translocator',
				rgb: [255, 0, 0],
				icon: '/map_icons/spiral.svg',
				minZoom: 3,
				name: 'Translocador'
			}
		]
	},
	waypoints: {
		group: 'Waypoints',
		name: 'Puntos de interés',
		values: [
			{
				type: 'Base',
				rgb: [0, 0, 255],
				icon: '/map_icons/home.svg',
				minZoom: 6,
				name: 'Base'
			},
			{
				type: 'TIENDA',
				rgb: [0, 0, 255],
				icon: '/map_icons/shop.svg',
				minZoom: 5,
				name: 'Tienda'
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
			rgb: number[];
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
			rgb: number[];
			icon: string;
			minZoom: number;
			name: string;
		}[];
	};
};
