import { CapacitorConfig } from '@capacitor/cli';

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
	config = { ...defaultConfig, plugins: { CapacitorHttp: { enabled: true } } };
}

export default config;
