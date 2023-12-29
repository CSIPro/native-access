import Constants from "expo-constants";

import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: Constants.expoConfig.extra?.firebaseApiKey,
  authDomain: Constants.expoConfig.extra?.firebaseAuthDomain,
  appId: Constants.expoConfig.extra?.firebaseAppId,
  databaseURL: Constants.expoConfig.extra?.firebaseDbUrl,
  projectId: Constants.expoConfig.extra?.firebaseProjectId,
  storageBucket: Constants.expoConfig.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig.extra?.firebaseMessagingSenderId,
  measurementId: Constants.expoConfig.extra?.firebaseMeasurementId,
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const firestore = getFirestore(firebaseApp);
