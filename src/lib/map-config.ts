export const mapConfig = {
	extent: [0, 0, 1024000, 1024000],
	center: [512000, 512000],
	resolutions: [512, 256, 128, 64, 32, 16, 8, 4, 2, 1],
	tileSize: [256, 256]
};

export const mapTexts = {
	zoomIn: 'Acercar',
	zoomOut: 'Alejar',
	goToCoordinates: 'Ir a las coordenadas',
	goToCoordinatesXPlaceholder: `Coordenada X`,
	goToCoordinatesZPlaceholder: `Coordenada Z`
};

export const waypointConfig = {
	traders: [
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
	],
	translocators: {
		rgb: [255, 0, 0],
		icon: '/map_icons/spiral.svg',
		minZoom: 3
	},
	waypoints: [
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
};
