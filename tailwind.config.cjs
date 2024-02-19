/** @type {import('tailwindcss').Config} */

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['main'],
	theme: {
		extend: {
			fontFamily: {
				sans: 'var(--sans-font-family)',
				icon: 'var(--icon-font-family)'
			},
			colors: {
				surface: 'var(--surface)',
				primary: 'var(--primary)',
				on: 'var(--on)',
				'on-alt': 'var(--on-alt)',
				accent: 'var(--accent)',
				'on-accent': 'var(--on-accent)',
				success: 'var(--success)',
				warning: 'var(--warning)',
				error: 'var(--error)'
			}
		}
	},
	plugins: []
};
