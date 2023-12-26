export default {
  expo: {
    name: "NativeAccess",
    scheme: "native-access",
    slug: "NativeAccess",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#7145d6",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      googleServicesFile: process.env.GOOGLE_SERVICES_PLIST,
      config: {
        usesNonExemptEncryption: false,
      },
    },
    android: {
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        monochromeImage: "./assets/adaptive-icon.png",
        backgroundColor: "#7145d6",
      },
      permissions: [
        "android.permission.BLUETOOTH",
        "android.permission.BLUETOOTH_ADMIN",
        "android.permission.BLUETOOTH_CONNECT",
      ],
      package: "com.csipro.nativeAccess",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      "expo-router",
      "@react-native-google-signin/google-signin",
      [
        "react-native-ble-plx",
        {
          isBackgroundEnabled: false,
          modes: ["central"],
        },
      ],
      [
        "expo-local-authentication",
        {
          faceIDPermission: "Allow $(PRODUCT_NAME) to use Face ID",
        },
      ],
    ],
    updates: {
      url: "https://u.expo.dev/9ca4842f-91b6-4a15-8832-b5f4b1270f63",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "9ca4842f-91b6-4a15-8832-b5f4b1270f63",
      },
      aesIv: process.env.AES_IV,
      aesKey: process.env.AES_KEY,
      bleCharUuid: process.env.BLE_CHARACTERISTIC_UUID,
      bleServiceUuid: process.env.BLE_SERVICE_UUID,
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseDbUrl: process.env.FIREBASE_DB_URL,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      githubClientId: process.env.GITHUB_CLIENT_ID,
      githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },
};
