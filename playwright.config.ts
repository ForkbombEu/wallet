import { devices, type PlaywrightTestConfig } from '@playwright/test'; 

const config: PlaywrightTestConfig = {
	use: {
		video: 'retain-on-failure',
		viewport: { width: 412, height: 915 },
		isMobile: true,
		locale: 'en-GB',
		...devices['Pixel 5']
	},
	webServer: {
		command: 'pnpm build && pnpm preview',
		port: 4173
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/
};

export default config;
