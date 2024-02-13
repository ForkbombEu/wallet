/** @type {import('tailwindcss').Config} */

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['main'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['"Gantari Variable"', 'sans-serif'],
				icon: ['"Material Symbols Rounded"']
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
