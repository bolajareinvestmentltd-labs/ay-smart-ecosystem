import type { CapacitorConfig } from '@capacitor/cli';

const capacitorServerUrl = process.env.CAPACITOR_SERVER_URL || 'https://ay-smart-ecosystem.vercel.app';

const config: CapacitorConfig = {
  appId: 'com.aysmart.eco',
  appName: "AY'SMART ECO",
  webDir: '.capacitor',
  server: {
    url: capacitorServerUrl,
    cleartext: capacitorServerUrl.startsWith('http://'),
  },
};

export default config;
