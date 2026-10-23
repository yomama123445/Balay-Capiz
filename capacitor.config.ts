/**
 * Capacitor Cross-Platform Configuration for BalayCapiz
 * Package ID: ph.edu.hercor.balaycapiz
 * Target Platforms: Android (APK / Play Store AAB), iOS (App Store / IPA)
 */

export interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  bundledWebRuntime?: boolean;
  server?: {
    androidScheme?: string;
    iosScheme?: string;
    hostname?: string;
    cleartext?: boolean;
  };
  android?: {
    buildOptions?: {
      keystorePath?: string;
      keystoreAlias?: string;
      releaseType?: 'APK' | 'AAB';
    };
    allowMixedContent?: boolean;
    captureInput?: boolean;
    webContentsDebuggingEnabled?: boolean;
  };
  ios?: {
    contentInset?: 'automatic' | 'scrollableAxes' | 'never' | 'always';
    allowsLinkPreview?: boolean;
    scrollEnabled?: boolean;
    backgroundColor?: string;
  };
  plugins?: Record<string, Record<string, unknown>>;
}

const config: CapacitorConfig = {
  appId: 'ph.edu.hercor.balaycapiz',
  appName: 'BalayCapiz',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    iosScheme: 'capacitor',
    hostname: 'balaycapiz.local',
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    buildOptions: {
      keystorePath: 'balaycapiz-release.keystore',
      keystoreAlias: 'balaycapiz',
      releaseType: 'AAB',
    },
  },
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: true,
    scrollEnabled: true,
    backgroundColor: '#FAF8F5',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1600,
      launchAutoHide: true,
      backgroundColor: '#0F172A',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0F172A',
      overlaysWebView: false,
    },
    Geolocation: {
      permissions: ['location'],
    },
    Camera: {
      permissions: ['camera', 'photos'],
    },
  },
};

export default config;
