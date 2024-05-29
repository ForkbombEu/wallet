import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.forkbomb.wallet',
	appName: 'Didroom',
	webDir: 'build',
	// Note – This breaks the app
	// plugins: {
	// 	// CapacitorHttp: {
	// 	// 	enabled: true
	// 	// }
	// },
	server: {
		androidScheme: 'https',
		cleartext: true
	}
};

export default config;
