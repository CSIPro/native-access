import { StateCreator } from "zustand";
import { z } from "zod";

import { getFromStorageAsync, saveToStorageAsync } from "@/lib/utils";
import { Appearance } from "react-native";

export const Theme = z.enum(["system", "light", "dark"]);
export type Theme = z.infer<typeof Theme>;

export interface ConfigSlice {
  theme: Theme;
  seenOnboarding: boolean;
  setTheme: (theme: Theme) => void;
  setSeenOnboarding: (seenOnboarding: boolean) => void;
}

export const createConfigSlice: StateCreator<ConfigSlice> = (set, get) => {
  getFromStorageAsync("THEME").then((theme) => {
    if (theme) {
      const themeSafeParse = Theme.safeParse(theme);
      if (themeSafeParse.success) {
        get().setTheme(themeSafeParse.data);
      }
    }
  });

  getFromStorageAsync("SEEN_ONBOARDING").then((seenOnboarding) => {
    if (seenOnboarding) {
      const value = seenOnboarding === "true";

      set({ seenOnboarding: value });
    }
  });

  const setTheme = (theme: Theme) => {
    const themeSafeParse = Theme.safeParse(theme);
    if (!themeSafeParse.success) {
      return;
    }

    Appearance.setColorScheme(theme === "system" ? null : theme);
    set({ theme });
    saveToStorageAsync("THEME", theme);
  };

  const setSeenOnboarding = (seenOnboarding: boolean) => {
    set({ seenOnboarding });
    saveToStorageAsync("SEEN_ONBOARDING", seenOnboarding ? "true" : "false");
  };

  return {
    theme: "system",
    seenOnboarding: false,
    setTheme,
    setSeenOnboarding,
  };
};
