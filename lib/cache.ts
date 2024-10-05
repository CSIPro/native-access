import { storageKeys } from "@/constants/storage-keys";
import { z } from "zod";
import { getFromStorage, saveToStorage } from "./utils";

const cacheExpirationKeys: Partial<
  Record<keyof typeof storageKeys, keyof typeof storageKeys>
> = {
  ROOMS: "ROOMS_LAST_FETCHED",
  ROLES: "ROLES_LAST_FETCHED",
};

export const saveToCache = <T>(
  key: keyof typeof storageKeys,
  data: Array<T>
) => {
  try {
    saveToStorage(key, JSON.stringify(data));
    saveToStorage(cacheExpirationKeys[key], Date.now().toString());
  } catch (error) {
    console.error("Error saving rooms to cache", error);
  }
};

export const loadFromCache = <T extends z.ZodTypeAny>(
  schema: T,
  key: keyof typeof storageKeys
) => {
  try {
    const cachedData = getFromStorage(key);
    const dataParse = schema.safeParse(
      JSON.parse(
        cachedData || schema.description?.includes("array") ? "[]" : "{}"
      )
    );

    if (!dataParse.success) {
      throw new Error("An error occurred while parsing cached data");
    }

    return dataParse.data;
  } catch (error) {
    console.error("Error loading data from cache", error);
    return schema.description?.includes("array") ? [] : null;
  }
};
