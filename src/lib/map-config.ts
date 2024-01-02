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
 * type = Name shown on the geojson file.
 * name = Name to show on the legend and some other polaces.
 * rgb = Color used for the icon.
 * icon = SVG used as icon.
 * minZoom = 0 = always visible, 11 = only visible with maximum zoom
 */
export const waypointConfig = {
	traders: {
		name: 'Comerciantes',
		values: [
			{
				type: 'Agriculture trader',
				rgb: [255, 0, 255],
				icon: '/map_icons/trader.svg',
				minZoom: 6
			},
			{
				type: 'Trader (Artisan)',
				rgb: [255, 0, 255],
				icon: '/map_icons/trader.svg',
				minZoom: 6
			},
			{
				type: 'Building materials trader',
				rgb: [255, 0, 255],
				icon: '/map_icons/trader.svg',
				minZoom: 6
			},
			{
				type: 'Clothing trader',
				rgb: [255, 0, 255],
				icon: '/map_icons/trader.svg',
				minZoom: 6
			},
			{
				type: 'Commodities trader',
				rgb: [255, 0, 255],
				icon: '/map_icons/trader.svg',
				minZoom: 6
			},
			{
				type: 'Furniture trader',
				rgb: [255, 0, 255],
				icon: '/map_icons/trader.svg',
				minZoom: 6
			},
			{
				type: 'Luxuries trader',
				rgb: [255, 0, 255],
				icon: '/map_icons/trader.svg',
				minZoom: 6
			},
			{
				type: 'Survival goods trader',
				rgb: [255, 0, 255],
				icon: '/map_icons/trader.svg',
				minZoom: 6
			},
			{
				type: 'Treasure hunter trader',
				rgb: [255, 0, 255],
				icon: '/map_icons/trader.svg',
				minZoom: 6
			}
		]
	},
	translocators: {
		name: 'Translocadores',
		rgb: [255, 0, 0],
		icon: '/map_icons/spiral.svg',
		minZoom: 3
	},
	waypoints: {
		name: 'Puntos de interés',
		values: [
			{
				type: 'Base',
				rgb: [0, 0, 255],
				icon: '/map_icons/home.svg',
				minZoom: 6
			},
			{
				type: 'TIENDA',
				rgb: [0, 0, 255],
				icon: '/map_icons/shop.svg',
				minZoom: 5
			}
		]
	}
};
