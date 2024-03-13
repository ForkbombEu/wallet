import { paraglide } from '@inlang/paraglide-js-adapter-sveltekit/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import plainText from 'vite-plugin-plain-text';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		sveltekit(),
		paraglide({
			project: './project.inlang',
			outdir: './src/paraglide'
		}),
		SvelteKitPWA(),
		plainText(['**/*.zen'], { dtsAutoGen: true, distAutoClean: true })
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
