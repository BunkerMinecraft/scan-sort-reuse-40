import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4a192d3188ec42609c3e8c64b5616aa2',
  appName: 'scan-sort-reuse',
  webDir: 'dist',
  server: {
    url: 'https://4a192d31-88ec-4260-9c3e-8c64b5616aa2.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    }
  }
};

export default config;