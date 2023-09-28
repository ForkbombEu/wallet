import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'io.ionic.starter',
	appName: 'walletamous',
	webDir: 'build',
	server: {
		androidScheme: 'https',
	// 	url: 'http://192.168.1.26:5173',
		cleartext: true
	}
};

export default config;
