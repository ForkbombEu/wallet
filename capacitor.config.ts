import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'org.dyne.wallet',
    appName: 'wallet',
    webDir: 'build',
    server: {
        androidScheme: 'https',
        cleartext: true
    }
};

export default config;
