import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

import { storageKeys } from "@/constants/storage-keys";
import { NestRoom } from "@/hooks/use-rooms";
import { z } from "zod";
import { NestUser } from "@/hooks/use-user-data";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const BASE_API_URL = Constants.expoConfig.extra?.authApiUrl;

export const NestError = z.object({
  statusCode: z.number(),
  message: z.string(),
});

export type NestError = z.infer<typeof NestError>;

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const formatRoomName = (room: NestRoom) => {
  return `${room.name} (${room.building}${
    room.roomNumber ? `-${room.roomNumber}` : ""
  })`;
};

export const formatUserName = (user: Partial<NestUser>) => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }

  return "Unknown";
};

export const formatBirthday = (date: string) => {
  const birthday = new Date(date);
  const offset = birthday.getTimezoneOffset() * 60000;

  const localDate = new Date(birthday.getTime() + offset);

  return format(localDate, "dd 'de' MMMM", { locale: es });
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
