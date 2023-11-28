import * as SecureStore from "expo-secure-store";
import { storageKeys } from "../constants/storage-keys";

export const generateNonce = (length: number) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

export const saveToStorage = async (
  key: keyof typeof storageKeys,
  value: string
) => {
  await SecureStore.setItemAsync(key, value);
};

export const getFromStorage = async (key: keyof typeof storageKeys) => {
  return await SecureStore.getItemAsync(key);
};

export const deleteFromStorage = async (key: keyof typeof storageKeys) => {
  await SecureStore.deleteItemAsync(key);
};

export const deleteAllFromStorage = () => {
  Object.keys(storageKeys).forEach(async (key) => {
    await SecureStore.deleteItemAsync(key);
  });
};
