import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

import { storageKeys } from "@/constants/storage-keys";
import { Room } from "@/hooks/use-rooms";
import { firebaseAuth } from "./firebase-config";

export const formatRoomName = (room: Room) => {
  return `${room.name} (${room.building}-${room.room})`;
};

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

export const deleteLog = async (id: string) => {
  const authUser = firebaseAuth.currentUser;

  if (!authUser) {
    throw new Error("You don't seem to be logged in...");
  }

  try {
    const token = await authUser.getIdToken();
    const apiUrl = Constants.expoConfig.extra?.authApiUrl;

    const res = await fetch(`${apiUrl}/logs/delete`, {
      method: "POST",
      body: JSON.stringify({ logId: id }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message ?? "Something went wrong while deleting the log"
      );
    }

    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const generatePasscode = (): string => {
  const totalLength = Math.floor(Math.random() * 4 + 4);
  const possible = "0123456789ABCD";

  let text = "";

  for (let i = 0; i < totalLength; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  if (!/^(?=.*[\d])(?=.*[A-D])[\dA-D]{4,10}$/gm.test(text)) {
    return generatePasscode();
  }

  return text;
};
