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
	},
	{
		name: 'Normas',
		route: 'rules'
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
			Para poder entrar tendrás que acceder al <a href="https://discord.gg/ybneJBRAWx" class="font-bold underline">servidor de Discord Astro Vaporwave</a>, ir a <a href="https://discord.com/channels/726133117722820671/1173377109750726657" class="font-bold underline">este canal</a> y solicitar el acceso al servidor. A parte del acceso al servidor, también se tendrán algunas ventajas como canales privados para tu clan (grupos dentro del juego), soporte en caso de algún error, notificaciones de novedades y actualizaciones, etc.
		</span>
	`,
	TitleServerFeaturesHTML: `CARACTERÍSTICAS DEL SERVIDOR`,
	ListServerFeaturesHTML: [
		'Abierto 24/7/365',
		'32 jugadores simultáneos',
		'Whitelist',
		'PvE + PvP activado para defensa propia',
		'Empiezas con 1 engranaje temporal',
		'Anticheat por si las moscas',
		'Resonance Archives bloqueado, será un evento del servidor',
		'Con océanos, continentes y ríos con corriente',
		'Mazmorras, estructuras y minas enormes',
		'El fuego no se propaga',
		'Amigable con jugadores nuevos en el servidor y en el juego',
		'Economía y creación de tiendas',
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
		'+60 Mods',
		'1.000.000 x 1.000.000 bloques',
		'Caducidad de la comida 75%',
		'Respawns infinitos con engranajes temporales',
		'Casi todos los bloques son cincelables',
		'12 días por mes',
		'Tormentas temporales cada 10-20 días',
		'70% tierra firme y 30% océanos, con una escala del 400%'
	],

	/* Rules */
	RulesTitle: 'Normas del servidor',
	RulesDescription:
		'El servidor tiene como objetivo ser divertido y amigable con todos. Para esto, es necesario que todos cumplamos algunas reglas básicas.<br/>Incumplir alguna de estas normas pude resultar en un baneo del servidor de Vintage Story e includo del Servidor de Discord.',
	Rules: [
		{
			title: 'No reclamar recursos naturales',
			description:
				'No reclamar recursos naturales como minerales, árboles frutales(si los plantasteis vosotros si), etc...<br/>Los claims son ilimitados pero para estructuras propias como casas, huertos, granjas... cualquier cosa hecha o plantada por vosotros!'
		},
		{
			title: 'Nada de robar y/o matar a otros jugadores',
			description:
				'Si alguien os ataca podéis defenderos y luego reportar al jugador que os atacó en <a href="https://discord.com/channels/726133117722820671/1174025705600843797" class="font-bold underline">este canal del servidor de Discord.</a>'
		},
		{
			title: 'Nada de insultos y/o faltas de respeto',
			description:
				'La gente quiere disfrutar del juego y que alguien llegue a molestar no es de agrado para nadie así que respeta a otro jugadores igual que te gustaría que respetaran a ti.'
		},
		{
			title: 'No cambiar el nombre de los teletransportes',
			description:
				'No cambiar el nombre de los teletransportes si están siendo usados por otra persona.'
		},
		{
			title: 'Respeta el espacio de otros',
			description:
				'No construyas nada demasiado cerca de otros jugadores si su permiso, puede que quieran ampliar sus casa y luego no tienen espacio.'
		},
		{
			title: 'Dejar un margen en el spawn',
			description:
				'Solo una pequeña zona del spawn está protegida pero eso no quiere decir que puedas construirte un casa a 10 bloques de este. Deja mínimo 500 bloques a cada lado de este para futuros proyectos!'
		}
	]
};
