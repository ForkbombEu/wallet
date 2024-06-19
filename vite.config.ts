import { sentrySvelteKit } from "@sentry/sveltekit";
import { paraglide } from '@inlang/paraglide-js-adapter-sveltekit/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sentrySvelteKit({
        sourceMapsUploadOptions: {
            org: "phoebus-84",
            project: "javascript-sveltekit"
        }
    }), sveltekit(), paraglide({
        project: './project.inlang',
        outdir: './src/paraglide'
    }), SvelteKitPWA()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});