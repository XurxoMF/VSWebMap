/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {},
		fontFamily: {
			pn: ['"Proxima Nova"']
		}
	},
	plugins: [
		function ({ addUtilities }) {
			const newUtilities = {
				'.no-pointer-events': {
					'pointer-events': 'none'
				}
			};
			addUtilities(newUtilities, ['responsive', 'hover']);
		}
	]
};
