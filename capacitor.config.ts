import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'ionic',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    BleClient: {
      request: true,
      statusReceiver: true,
      foregroundService: {
        notificationTitle: "My App is running",
        notificationText: "Foreground service keeps the app running while connected to a device",
        notificationChannelName: "My App"
      }
    }
  }
};

export default config;
