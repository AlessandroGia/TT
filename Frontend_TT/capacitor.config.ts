import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'TT',
  webDir: 'www',
  server: {
    cleartext: true,
    androidScheme: 'http'
  },  
  plugins: {
    Cordova: {
      platforms: ['android', 'ios']
    }
  }
};

export default config;
