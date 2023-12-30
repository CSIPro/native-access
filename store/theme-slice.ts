import { StateCreator } from "zustand";
import { z } from "zod";

import { getFromStorage, saveToStorage } from "@/lib/utils";
import { Appearance } from "react-native";

export const Theme = z.enum(["system", "light", "dark"]);
export type Theme = z.infer<typeof Theme>;

export interface ThemeSlice {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const createThemeSlice: StateCreator<ThemeSlice> = (set, get) => {
  getFromStorage("THEME").then((theme) => {
    if (theme) {
      const themeSafeParse = Theme.safeParse(theme);
      if (themeSafeParse.success) {
        get().setTheme(themeSafeParse.data);
      }
    }
  });

  const setTheme = (theme: Theme) => {
    const themeSafeParse = Theme.safeParse(theme);
    if (!themeSafeParse.success) {
      return;
    }

    Appearance.setColorScheme(theme === "system" ? null : theme);
    set({ theme });
    saveToStorage("THEME", theme);
  };

  return {
    theme: "system",
    setTheme,
  };
};
