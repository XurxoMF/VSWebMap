/**
 * Here you can add routes and names for the pages you have!
 */
export let pages = [
	{
		name: 'Mapa',
		route: '/map'
	},
	{
		name: 'Discord',
		route: '/discord'
	}
];

/**
 * Here you can change almost all the website texts.
 *
 * TIPS:
 *  - Keys ended in HTML will be rendered as HTML sou can use any HTML tag to format your text.
 *  - If you want to write HTML you can surround the text with ` instead of ' or ", that way you can write multiline text.
 * 	  This will not affect to the result code but is easier to write and read.
 */
export let texts = {
	Nav: 'VVS',
	Footer: 'Web Oficial de Vaporwave Vintage Story',

	/* Main page sentences */
	WellcomeHTML: 'Bienvenid@ a la web oficial del servidor Vaporwave Vintage Story!',
	DescriptionHTML: `
		<span class="inline-block mb-2">
			<strong>Vaporwave Vintage Story</strong> (VVS) es el servidor de Vintage Story <strong>NO PVP</strong>, <strong>con mods</strong> y <strong>en español</strong> de la comunidad de discord <a href="https://discord.gg/ybneJBRAWx" class="font-bold underline">Astro Vaporwave</a>.
		</span>
		<br />
		<span class="inline-block mb-2">
			El servidor está principalmente enfocado en la construcción, la exploración y el PVE, incorporando un sistema de mercado y tiendas para añadir algo de roleplay si se desea.
		</span>
		<br />
		<span class="inline-block mb-2">
			Cualquiera puede entrar, esté o no en el servidor de Discord, desde el menú de servidores públicos dentro del juego pero, por estar en el servidor <a href="https://discord.gg/ybneJBRAWx" class="font-bold underline">Astro Vaporwave</a>, se tendrán algunas ventajas como canales privados para tu clan (grupos dentro del juego), soporte en caso de algún error, notificaciones de novedades y actualizaciones, etc.
		</span>
	`,
	TitleServerFeaturesHTML: `CARACTERÍSTICAS DEL SERVIDOR`,
	ListServerFeaturesHTML: [
		'Abierto 24/7/365',
		'32 jugadores simultáneos',
		'PvE + PvP activado para defensa propia',
		'Anticheat por si las moscas',
		'Resonance Archives bloqueado, será un evento del servidor',
		'Con océanos, continentes y ríos con corriente (Rivers)',
		'Mazmorras, estructuras y minas enormes',
		'El fuego no se propaga',
		'Amigable con jugadores nuevos en el servidor y en el juego en general',
		'Economía y creación de tiendas(Vinconomy)',
		'Claimeo de terrenos ilimitado',
		'Creación de grupos/clanes/facciónes...',
		'Chat de voz de proximidad',
		'Habilidades/Skills',
		'Mascotas',
		'Integración con Discord',
		'La comunidad decide que cambiar y que no. Se aceptan sugerencias ^^'
	],
	TitleWorldFeaturesHTML: `CARACTERÍSTICAS DEL MUNDO`,
	ListWorldFeaturesHTML: [
		'+70 Mods',
		'1.000.000 x 1.000.000 bloques',
		'Caducidad de la comida 75%',
		'Respawns infinitos con engranajes temporales',
		'Casi todos los bloques son cincelables',
		'12 días por mes',
		'Tormentas temporales cada 10-20 días',
		'60% tierra firme y 40% océanos, con una escala del 400%',
		'Sin recetas exclusivas de clase'
	]
};
