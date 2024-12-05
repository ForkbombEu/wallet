import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.didroom.wallet',
	appName: 'DIDroom',
	webDir: 'build',
	// plugins: {
	// 	CapacitorHttp: {
	// 		enabled: true
	// 	}
	// },
	server: {
		androidScheme: 'https',
		cleartext: true,
		allowNavigation: ['staging.admin.didroom.com']
	},
	ios: {
		scheme: 'Didroom',
		webContentsDebuggingEnabled: true
	}
};

export default config;
