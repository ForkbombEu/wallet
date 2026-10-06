import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: 'tests/ux',
	testMatch: '**/*.pw.ts',
	timeout: 30_000,
	workers: 1,
	use: {
		baseURL: 'http://127.0.0.1:4187',
		serviceWorkers: 'block',
		reducedMotion: 'reduce',
		screenshot: 'only-on-failure',
		launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
			? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
			: {}
	},
	projects: [
		{ name: 'mobile', use: { viewport: { width: 390, height: 844 }, colorScheme: 'light' } },
		{ name: 'small-dark', use: { viewport: { width: 360, height: 640 }, colorScheme: 'dark' } },
		{ name: 'desktop', use: { viewport: { width: 1440, height: 1000 }, colorScheme: 'light' } }
	],
	webServer: {
		command: 'pnpm exec vite dev --host 127.0.0.1 --port 4187 --strictPort',
		url: 'http://127.0.0.1:4187',
		reuseExistingServer: !process.env.CI,
		timeout: 60_000
	}
});
