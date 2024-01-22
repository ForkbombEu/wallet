import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'org.dyne.wallet',
	appName: 'wallet',
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
