/** @type {import('tailwindcss').Config} */

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['main'],
	theme: {
		extend: {
			fontFamily: {
				sans: 'Poppins'
			}
		}
	},
	plugins: []
};
