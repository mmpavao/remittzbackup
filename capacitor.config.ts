import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.remittz.app',
  appName: 'Remittz',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: 'release.keystore',
      keystoreAlias: 'release',
      keystorePassword: 'remittz123',
      storePassword: 'remittz123',
    }
  }
};

export default config;