import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.didroom.wallet',
	appName: 'DIDroom',
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
	},
	ios: {
    	scheme: "Didroom"
  	}
};

export default config;
