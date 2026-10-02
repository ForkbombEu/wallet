import type { CapacitorConfig } from '@capacitor/cli';

let config: CapacitorConfig;
const defaultConfig: CapacitorConfig = {
	appId: 'com.didroom.wallet',
	appName: 'DIDroom',
	webDir: 'build',
	server: {
		androidScheme: 'http',
		cleartext: true
	},
	plugins: {
		// Capawesome handles Android insets, including the full-screen QR scanner.
		SystemBars: {
			insetsHandling: 'disable'
		},
		Keyboard: {
			resizeOnFullScreen: false
		}
	},
	ios: {
		scheme: 'Didroom',
		webContentsDebuggingEnabled: true
	}
};
if (process.env.ANDROID) {
	config = defaultConfig;
} else {
	config = {
		...defaultConfig,
		plugins: { ...defaultConfig.plugins, CapacitorHttp: { enabled: true } }
	};
}

export default config;
